import { createServer, request as httpRequest } from 'node:http';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, createWriteStream, promises as fs } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import os from 'node:os';
import path from 'node:path';

const execute = promisify(execFile);
const dataRoot = path.resolve(process.env.GODOT_CLOUD_DATA_ROOT || '/srv/godot-forge-cloud/data');
const usersRoot = path.join(dataRoot, 'users');
const starterPath = path.join(dataRoot, 'starter-v1.zip');
const starterUrl = process.env.GODOT_CLOUD_STARTER_URL;
const starterSha256 = process.env.GODOT_CLOUD_STARTER_SHA256;
const sharedSecret = process.env.GODOT_CLOUD_SHARED_SECRET || '';
const appOrigin = process.env.GODOT_CLOUD_APP_ORIGIN || '';
const assignedLearnerId = process.env.GODOT_CLOUD_LEARNER_ID || '';
const extraFrameOrigins = (process.env.GODOT_CLOUD_EXTRA_FRAME_ORIGINS || '').split(/\s+/).filter(Boolean);
const dockerNetwork = process.env.GODOT_CLOUD_NETWORK || 'godot-forge-cloud';
const editorImage = process.env.GODOT_CLOUD_EDITOR_IMAGE || 'godot-forge-cloud-editor:4.7.2';
const maxSessions = Number(process.env.GODOT_CLOUD_MAX_SESSIONS || 1);
const idleMilliseconds = Number(process.env.GODOT_CLOUD_IDLE_MINUTES || 45) * 60_000;
const sessions = new Map();
const pending = new Map();
let starterPromise;
let capacityQueue = Promise.resolve();

if ((assignedLearnerId && !/^[a-zA-Z0-9_-]{8,100}$/.test(assignedLearnerId)) ||
    extraFrameOrigins.some(origin => !/^https:\/\/[a-zA-Z0-9.-]+(?::[0-9]+)?$/.test(origin) && !/^http:\/\/(?:localhost|127\.0\.0\.1)(?::[0-9]+)?$/.test(origin)) ||
    sharedSecret.length < 32 || !/^https:\/\/[^/]+$/.test(appOrigin) ||
    !/^https:\/\/[^\s]+$/.test(starterUrl || '') || !/^[a-f0-9]{64}$/.test(starterSha256 || '') ||
    !Number.isInteger(maxSessions) || maxSessions < 1 || !Number.isFinite(idleMilliseconds) || idleMilliseconds < 60_000) {
  throw new Error('Invalid Godot cloud configuration. Check the secret, HTTPS URLs, SHA-256, and session limits.');
}

function sendJson(response, status, value) {
  const body = Buffer.from(JSON.stringify(value));
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': body.length,
    'cache-control': 'no-store',
  });
  response.end(body);
}

function authorized(request) {
  const provided = request.headers.authorization?.replace(/^Bearer /i, '') || '';
  const supplied = Buffer.from(provided);
  const expected = Buffer.from(sharedSecret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 4096) throw Object.assign(new Error('Request body too large.'), { status: 413 });
  }
  try { return JSON.parse(body); }
  catch { throw Object.assign(new Error('Invalid JSON.'), { status: 400 }); }
}

async function docker(...args) {
  const { stdout } = await execute('docker', args, { timeout: 120_000, maxBuffer: 1024 * 1024 });
  return stdout.trim();
}

async function fileSha256(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

async function downloadStarter() {
  if (await fs.access(starterPath).then(() => true, () => false)) {
    if (await fileSha256(starterPath) === starterSha256) return;
    await fs.rm(starterPath, { force: true });
  }
  const response = await fetch(starterUrl, { signal: AbortSignal.timeout(300_000) });
  if (!response.ok || !response.body) throw new Error(`Starter ZIP download failed: HTTP ${response.status}.`);
  const temporary = `${starterPath}.${randomBytes(8).toString('hex')}.tmp`;
  let size = 0;
  try {
    await pipeline(
      response.body,
      new Transform({ transform(chunk, encoding, callback) {
        size += chunk.length;
        callback(size > 160 * 1024 * 1024 ? new Error('Starter ZIP exceeded 160 MiB.') : null, chunk);
      } }),
      createWriteStream(temporary, { mode: 0o600 }),
    );
    if (await fileSha256(temporary) !== starterSha256) throw new Error('Starter ZIP SHA-256 mismatch.');
    await fs.rename(temporary, starterPath);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

async function ensureStarter() {
  if (!starterPromise) starterPromise = downloadStarter().catch(error => {
    starterPromise = undefined;
    throw error;
  });
  return starterPromise;
}

async function seedProject(directory) {
  const project = path.join(directory, 'project');
  if (await fs.access(path.join(project, 'project.godot')).then(() => true, () => false)) return;
  await ensureStarter();
  await fs.mkdir(project, { recursive: true });
  await execute('unzip', ['-q', starterPath, '-d', project], { timeout: 180_000 });
  if (!(await fs.access(path.join(project, 'project.godot')).then(() => true, () => false))) {
    throw new Error('Starter ZIP did not contain project.godot.');
  }
  await execute('chown', ['-R', '1000:1000', directory], { timeout: 180_000 });
}

async function runningContainerCount() {
  const names = await docker('ps', '--filter', 'label=godot-forge.cloud=1', '--format', '{{.Names}}');
  return names ? names.split('\n').length : 0;
}

async function containerState(name) {
  try { return await docker('inspect', '--format', '{{.State.Running}}', name); }
  catch { return 'missing'; }
}

async function waitForEditor(name, token) {
  const url = `http://${name}:3000/s/${token}/`;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(2000) });
      if (response.status >= 200 && response.status < 400) return;
    } catch { /* KasmVNC is still starting. */ }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  throw new Error('Godot editor did not become ready within one minute.');
}

async function ensureContainer(session) {
  const state = await containerState(session.name);
  if (state === 'true') return waitForEditor(session.name, session.token);
  let release;
  const previous = capacityQueue;
  capacityQueue = new Promise(resolve => { release = resolve; });
  await previous;
  try {
    const currentState = await containerState(session.name);
    if (currentState !== 'true') {
      if (await runningContainerCount() >= maxSessions) {
        throw Object.assign(new Error('All cloud editor slots are in use. Please try again shortly.'), { status: 503 });
      }
      if (currentState === 'false') {
        await docker('start', session.name);
      } else {
        await docker(
          'run', '-d', '--name', session.name,
          '--network', dockerNetwork,
          '--label', 'godot-forge.cloud=1',
          '--memory', '2560m', '--memory-swap', '2560m', '--cpus', '1.5', '--pids-limit', '512',
          '--security-opt', 'no-new-privileges',
          '--mount', `type=bind,src=${session.directory},dst=/config`,
          '-e', 'PUID=1000', '-e', 'PGID=1000',
          '-e', `SUBFOLDER=/s/${session.token}/`,
          '-e', 'START_DOCKER=false',
          editorImage,
        );
      }
    }
  } finally { release(); }
  await waitForEditor(session.name, session.token);
}

async function createSession(learnerId) {
  if (assignedLearnerId && learnerId !== assignedLearnerId) throw Object.assign(new Error('This instance belongs to another student.'), { status: 403 });
  if (typeof learnerId !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(learnerId)) {
    throw Object.assign(new Error('Invalid learner ID.'), { status: 400 });
  }
  const id = createHash('sha256').update(learnerId).digest('hex');
  if (pending.has(id)) return pending.get(id);
  const task = (async () => {
    const directory = path.join(usersRoot, id);
    const metadataPath = path.join(directory, 'session.json');
    await fs.mkdir(directory, { recursive: true, mode: 0o700 });
    let metadata;
    try { metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8')); }
    catch { metadata = null; }
    const token = /^[a-f0-9]{64}$/.test(metadata?.token || '') ? metadata.token : randomBytes(32).toString('hex');
    if (metadata?.token !== token) await fs.writeFile(metadataPath, JSON.stringify({ token }), { mode: 0o600 });
    const session = { id, token, directory, name: `godot-forge-${id.slice(0, 24)}`, lastSeen: Date.now() };
    sessions.set(token, session);
    try {
      await seedProject(directory);
      await ensureContainer(session);
    } catch (error) {
      sessions.delete(token);
      throw error;
    }
    return { path: `/s/${token}/`, downloadPath: `/download/${token}` };
  })();
  pending.set(id, task);
  try { return await task; }
  finally { pending.delete(id); }
}

async function stopSession(learnerId) {
  if (assignedLearnerId && learnerId !== assignedLearnerId) throw Object.assign(new Error('This instance belongs to another student.'), { status: 403 });
  if (typeof learnerId !== 'string' || !/^[a-zA-Z0-9_-]{8,100}$/.test(learnerId)) {
    throw Object.assign(new Error('Invalid learner ID.'), { status: 400 });
  }
  const id = createHash('sha256').update(learnerId).digest('hex');
  if (pending.has(id)) await pending.get(id);
  const session = [...sessions.values()].find(item => item.id === id);
  if (!session) return { stopped: true };
  if (await containerState(session.name) === 'true') await docker('stop', '--time', '20', session.name);
  session.lastSeen = Date.now();
  return { stopped: true };
}

function proxyHeaders(headers) {
  const result = { ...headers };
  delete result.host;
  delete result.connection;
  delete result['proxy-connection'];
  result['x-forwarded-proto'] = 'https';
  return result;
}

function responseHeaders(headers) {
  const result = { ...headers };
  delete result['x-frame-options'];
  delete result['content-security-policy'];
  delete result.connection;
  delete result['keep-alive'];
  delete result['transfer-encoding'];
  result['content-security-policy'] = `frame-ancestors 'self' ${[appOrigin, ...extraFrameOrigins].join(" ")}`;
  result['referrer-policy'] = 'no-referrer';
  result['cache-control'] = 'no-store';
  return result;
}

function proxyHttp(request, response, session) {
  session.lastSeen = Date.now();
  const upstream = httpRequest({
    hostname: session.name, port: 3000, path: request.url,
    method: request.method, headers: proxyHeaders(request.headers),
  }, remote => {
    response.writeHead(remote.statusCode || 502, responseHeaders(remote.headers));
    remote.pipe(response);
  });
  upstream.on('error', () => {
    if (!response.headersSent) sendJson(response, 502, { error: 'Cloud editor is starting. Reload in a moment.' });
    else response.destroy();
  });
  request.pipe(upstream);
}

function proxyWebSocket(request, socket, head, session) {
  session.lastSeen = Date.now();
  const upstream = httpRequest({
    hostname: session.name, port: 3000, path: request.url,
    method: 'GET', headers: { ...request.headers, host: session.name },
  });
  upstream.on('upgrade', (remote, remoteSocket, remoteHead) => {
    let headers = `HTTP/1.1 ${remote.statusCode} ${remote.statusMessage}\r\n`;
    for (let i = 0; i < remote.rawHeaders.length; i += 2) {
      if (!/^x-frame-options$/i.test(remote.rawHeaders[i])) headers += `${remote.rawHeaders[i]}: ${remote.rawHeaders[i + 1]}\r\n`;
    }
    socket.write(`${headers}\r\n`);
    if (head.length) remoteSocket.write(head);
    if (remoteHead.length) socket.write(remoteHead);
    socket.on('data', () => { session.lastSeen = Date.now(); });
    remoteSocket.on('data', () => { session.lastSeen = Date.now(); });
    socket.pipe(remoteSocket).pipe(socket);
  });
  upstream.on('response', () => socket.destroy());
  upstream.on('error', () => socket.destroy());
  upstream.end();
}

async function downloadProject(response, session) {
  session.lastSeen = Date.now();
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'godot-project-'));
  const archive = path.join(temporary, 'godot-forge-project.zip');
  try {
    await execute('zip', ['-qr', archive, 'project', '-x', 'project/.godot/*'], {
      cwd: session.directory, timeout: 180_000,
    });
    const size = (await fs.stat(archive)).size;
    response.writeHead(200, {
      'content-type': 'application/zip',
      'content-disposition': 'attachment; filename="godot-forge-project.zip"',
      'content-length': size,
      'cache-control': 'no-store',
      'referrer-policy': 'no-referrer',
    });
    await pipeline(createReadStream(archive), response);
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
}

await fs.mkdir(usersRoot, { recursive: true, mode: 0o700 });
for (const id of await fs.readdir(usersRoot)) {
  if (!/^[a-f0-9]{64}$/.test(id)) continue;
  const directory = path.join(usersRoot, id);
  try {
    const { token } = JSON.parse(await fs.readFile(path.join(directory, 'session.json'), 'utf8'));
    if (/^[a-f0-9]{64}$/.test(token)) {
      sessions.set(token, { id, token, directory, name: `godot-forge-${id.slice(0, 24)}`, lastSeen: Date.now() });
    }
  } catch { /* Ignore incomplete workspaces. */ }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (request.method === 'GET' && url.pathname === '/') {
      if (!assignedLearnerId) return sendJson(response, 404, { error: 'Open your student editor link.' });
      const session = await createSession(assignedLearnerId);
      response.writeHead(303, { location: session.path, 'cache-control': 'no-store' });
      return response.end();
    }
    if (request.method === 'GET' && url.pathname === '/health') return sendJson(response, 200, { ok: true });
    if (request.method === 'POST' && url.pathname === '/internal/session') {
      if (!authorized(request)) return sendJson(response, 401, { error: 'Unauthorized.' });
      const body = await readJson(request);
      return sendJson(response, 200, await createSession(body.learnerId));
    }
    if (request.method === 'POST' && url.pathname === '/internal/stop') {
      if (!authorized(request)) return sendJson(response, 401, { error: 'Unauthorized.' });
      const body = await readJson(request);
      return sendJson(response, 200, await stopSession(body.learnerId));
    }
    const editorMatch = url.pathname.match(/^\/s\/([a-f0-9]{64})(?:\/|$)/);
    if (editorMatch && sessions.has(editorMatch[1])) return proxyHttp(request, response, sessions.get(editorMatch[1]));
    const downloadMatch = url.pathname.match(/^\/download\/([a-f0-9]{64})$/);
    if (request.method === 'GET' && downloadMatch && sessions.has(downloadMatch[1])) {
      return await downloadProject(response, sessions.get(downloadMatch[1]));
    }
    return sendJson(response, 404, { error: 'Not found.' });
  } catch (error) {
    if (!response.headersSent) sendJson(response, error.status || 500, { error: error.message || 'Cloud editor error.' });
    else response.destroy();
  }
});

server.on('upgrade', (request, socket, head) => {
  const match = new URL(request.url, 'http://localhost').pathname.match(/^\/s\/([a-f0-9]{64})(?:\/|$)/);
  const session = match && sessions.get(match[1]);
  if (!session) return socket.destroy();
  proxyWebSocket(request, socket, head, session);
});

setInterval(async () => {
  for (const session of sessions.values()) {
    if (Date.now() - session.lastSeen < idleMilliseconds || pending.has(session.id)) continue;
    if (await containerState(session.name) === 'true') {
      try { await docker('stop', '--time', '20', session.name); }
      catch { /* Retry on the next sweep. */ }
    }
  }
}, 60_000).unref();

server.listen(8080, '0.0.0.0', () => console.log('Godot cloud controller listening on port 8080.'));

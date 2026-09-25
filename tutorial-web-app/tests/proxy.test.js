import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('chat requests use the server-configured proxy and keep its URL off creation pages', { timeout: 30000 }, async () => {
  const received = [];
  const upstream = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());
    received.push({ path: request.url, authorization: request.headers.authorization, body });
    const failure = body.messages[0].content === 'fail';
    response.writeHead(failure ? 503 : 200, { 'content-type': 'application/json' });
    response.end(JSON.stringify(failure ? { error: { message: 'Proxy unavailable.' } } : { message: { content: 'Ready.' } }));
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const storage = await mkdtemp(join(tmpdir(), 'godot-forge-proxy-test-'));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: {
      ...process.env,
      PORT: '0',
      APP_STORAGE_DIR: storage,
      OPENAI_API_KEY: '',
      OLLAMA_PROXY_URL: `http://127.0.0.1:${upstream.address().port}`,
      OLLAMA_PROXY_API_KEY: 'private-test-key',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  try {
    const baseUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Tutorial server did not start: ${stderr}`)), 15000);
      child.once('error', reject);
      child.once('exit', code => reject(new Error(`Tutorial server exited ${code}: ${stderr}`)));
      child.stdout.on('data', chunk => {
        const match = String(chunk).match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
      });
    });
    for (const [message, expectedStatus] of [['hello', 200], ['fail', 503]]) {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-5.6-luna', stream: false, messages: [{ role: 'user', content: message }] }),
      });
      assert.equal(response.status, expectedStatus);
      const payload = await response.json();
      assert.equal(expectedStatus === 200 ? payload.message.content : payload.error.message, expectedStatus === 200 ? 'Ready.' : 'Proxy unavailable.');
    }
    assert.deepEqual(received.map(request => request.path), ['/api/chat', '/api/chat']);
    assert.deepEqual(received.map(request => request.authorization), ['Bearer private-test-key', 'Bearer private-test-key']);
    assert.deepEqual(received.map(request => request.body.messages[0].content), ['hello', 'fail']);
    for (const path of ['/character-creation/', '/boss-creation/', '/game-assets-creation/']) {
      const html = await (await fetch(`${baseUrl}${path}`)).text();
      assert.doesNotMatch(html, /id="proxy-url"|Ollama proxy URL|127\.0\.0\.1:8788/);
    }
  } finally {
    child.kill('SIGTERM');
    await once(child, 'exit').catch(() => {});
    upstream.close();
  }
});

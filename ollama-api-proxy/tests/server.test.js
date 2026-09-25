import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:net';
import { mkdtemp, writeFile, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

async function openPort() {
  const probe = createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const port = probe.address().port;
  probe.close();
  await once(probe, 'close');
  return port;
}

test('a failed Codex response returns 502 and does not stop the proxy', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'codex-proxy-test-'));
  const fakeCodex = join(directory, 'fake-codex');
  await writeFile(fakeCodex, '#!/bin/sh\nexit 0\n');
  await chmod(fakeCodex, 0o755);
  const port = await openPort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: String(port), CODEX_BIN: fakeCodex, CODEX_CWD: directory, CODEX_TIMEOUT_MS: '5000' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  try {
    for (let attempt = 0; attempt < 50; attempt++) {
      if (output.includes('listening on')) break;
      if (child.exitCode !== null) throw new Error(`Proxy exited before startup: ${output}`);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    assert.match(output, /listening on/);
    const body = { model: 'test', stream: false, messages: [{ role: 'user', content: 'hello' }] };
    const failed = await fetch(`${baseUrl}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal(failed.status, 502);
    assert.match((await failed.json()).error.message, /without an assistant message/);
    assert.equal((await (await fetch(`${baseUrl}/health`)).json()).ok, true);

    await writeFile(fakeCodex, '#!/bin/sh\nprintf \'%s\\n\' \'{"type":"item.completed","item":{"type":"agent_message","text":"proxy ready"}}\'\n');
    const recovered = await fetch(`${baseUrl}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal(recovered.status, 200);
    assert.equal((await recovered.json()).message.content, 'proxy ready');
    assert.equal(child.exitCode, null);
  } finally {
    if (child.exitCode === null) { const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited; }
    await rm(directory, { recursive: true, force: true });
  }
});

import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdtemp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import test from 'node:test';

test('OpenAI storyline voice uses character voices and caches each generated line', async () => {
  const storage = await mkdtemp(join(tmpdir(), 'godot-forge-voice-test-'));
  const requests = [];
  const upstream = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    requests.push({ path: request.url, body: JSON.parse(Buffer.concat(chunks).toString()) });
    response.writeHead(200, { 'content-type': 'audio/mpeg' });
    response.end(Buffer.from('ID3mock-audio'));
  });
  upstream.listen(0, '127.0.0.1');
  await once(upstream, 'listening');
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: 'test-key', OPENAI_API_BASE: `http://127.0.0.1:${upstream.address().port}` },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '', errors = '';
  child.stderr.on('data', chunk => { errors += chunk; });
  try {
    const baseUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Storyline voice test server timeout: ${errors}`)), 10000);
      child.on('exit', code => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${errors}`)); });
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
      });
    });
    const config = await (await fetch(`${baseUrl}/api/storyline/voice/config`)).json();
    assert.equal(config.configured, true);
    assert.equal(config.model, 'gpt-4o-mini-tts');
    const voiceUrl = (locale, speaker, text) => `${baseUrl}/api/storyline/voice?${new URLSearchParams({ locale, speaker, text })}`;
    const english = voiceUrl('en', 'hero', 'I will find my friend before the last spring runs dry.');
    const published = await (await fetch(`${baseUrl}/api/storyline/voice/url?${new URLSearchParams({ locale: 'en', speaker: 'hero', text: 'I will find my friend before the last spring runs dry.' })}`)).json();
    assert.match(published.url, /^https:\/\/godot-forge\.sgp1\.digitaloceanspaces\.com\/2d-game-development\/tutorial-web-app\/storage\/story-voices\/[a-f0-9]{64}\.mp3$/);
    const uncached = await (await fetch(`${baseUrl}/api/storyline/voice/url?${new URLSearchParams({ locale: 'en', speaker: 'hero', text: 'A newly generated voice line.' })}`)).json();
    assert.match(uncached.url, /^\/api\/storyline\/voice\?/);
    assert.equal((await fetch(english)).status, 200);
    assert.equal((await fetch(english)).status, 200);
    assert.equal(requests.length, 1);
    assert.equal(requests[0].path, '/audio/speech');
    assert.equal(requests[0].body.model, 'gpt-4o-mini-tts');
    assert.equal(requests[0].body.voice, 'marin');
    assert.equal(requests[0].body.response_format, 'mp3');
    assert.equal((await fetch(voiceUrl('zh', 'guardian', '通往泉水的道路被封锁，是有原因的。'))).status, 200);
    assert.equal(requests[1].body.voice, 'cedar');
    assert.match(requests[1].body.instructions, /Mandarin Chinese/);
    assert.equal((await fetch(voiceUrl('ms', 'hero', 'Aku mesti mencari rakanku sebelum mata air terakhir kering.'))).status, 200);
    assert.match(requests[2].body.instructions, /Malay/);
    assert.equal((await fetch(voiceUrl('ms', 'other', 'Invalid'))).status, 400);
    assert.equal((await readdir(join(storage, 'story-voices'))).length, 3);
  } finally {
    const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited;
    upstream.close(); await once(upstream, 'close');
  }
});

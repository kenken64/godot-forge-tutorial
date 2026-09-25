import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { readFile, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { animationRows, gaitPrompt, normalizeGrid, validateGait, packSpriteSheet } from '../../character-creation/locomotion.mjs';

const asset = name => readFile(new URL(`../../character-creation/data/${name}`, import.meta.url));

test('all three sample sheets have valid eight-frame walk/run rows and transparent gutters', async () => {
  for (const name of ['storm-warden', 'moon-scout', 'ember-sage']) {
    const gait = await asset(`${name}-gait-v2.png`);
    await validateGait(sharp, gait);
    const sheet = await asset(`${name}-sprite-sheet-v2.png`);
    const metadata = await sharp(sheet).metadata();
    assert.equal(metadata.width, 2048);
    assert.equal(metadata.height, 1792);
    assert.equal(metadata.hasAlpha, true);
    for (const row of [1, 2]) {
      for (let frame = 0; frame < 8; frame++) {
        const { data } = await sharp(sheet).extract({ left: frame * 256, top: row * 256, width: 256, height: 256 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        for (let x = 0; x < 256; x++) {
          assert.equal(data[x * 4 + 3], 0);
          assert.equal(data[(255 * 256 + x) * 4 + 3], 0);
        }
      }
    }
  }
});

test('static legs, blank cells and opaque backgrounds are rejected', async () => {
  const frame = await sharp(await asset('storm-warden-gait-v2.png')).extract({ left: 0, top: 0, width: 256, height: 256 }).png().toBuffer();
  const repeated = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#00000000' } }).composite(Array.from({ length: 16 }, (_, i) => ({ input: frame, left: i % 4 * 256, top: Math.floor(i / 4) * 256 }))).png().toBuffer();
  await assert.rejects(validateGait(sharp, repeated), /static/);
  for (const background of ['#00000000', '#ffffffff']) {
    const blank = await sharp({ create: { width: 1024, height: 1024, channels: 4, background } }).png().toBuffer();
    await assert.rejects(validateGait(sharp, blank), /empty, opaque/);
  }
});

test('packer maps consecutive gait rows to frames 0–7 without swapping actions', async () => {
  const base = await asset('storm-warden-sprite-sheet-fixed.png');
  const gait = await asset('storm-warden-gait-v2.png');
  const packed = await packSpriteSheet(sharp, base, gait);
  for (let row = 1; row <= 2; row++) for (let frame = 0; frame < 8; frame++) {
    const source = await sharp(gait).extract({ left: frame % 4 * 256, top: ((row - 1) * 2 + Math.floor(frame / 4)) * 256, width: 256, height: 256 }).raw().toBuffer();
    const actual = await sharp(packed).extract({ left: frame * 256, top: row * 256, width: 256, height: 256 }).raw().toBuffer();
    // libvips alpha compositing can round RGB by one; alpha and placement must
    // remain exact. Avoid dumping large raw buffers on assertion failure.
    let maxColorError = 0, alphaErrors = 0;
    for (let pixel = 0; pixel < source.length; pixel += 4) {
      if (actual[pixel + 3] !== source[pixel + 3]) alphaErrors++;
      for (let c = 0; c < 3; c++) maxColorError = Math.max(maxColorError, Math.abs(actual[pixel + c] - source[pixel + c]));
    }
    assert.equal(alphaErrors, 0, `alpha mismatch in row ${row}, frame ${frame}`);
    assert.ok(maxColorError <= 1, `RGB error ${maxColorError} in row ${row}, frame ${frame}`);
  }
  assert.deepEqual(animationRows.map(row => row.frames), [1, 8, 8, 4, 4, 4, 4]);
});

test('packer removes a detached next-row fragment from the idle frame', async () => {
  const base = await sharp(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1792"><rect x="80" y="20" width="90" height="170" fill="blue"/><rect x="105" y="246" width="30" height="10" fill="cyan"/></svg>')).png().toBuffer();
  const packed = await packSpriteSheet(sharp, base, await asset('storm-warden-gait-v2.png'));
  const { data, info } = await sharp(packed).extract({ left: 0, top: 0, width: 256, height: 256 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(data[(100 * info.width + 100) * 4 + 3], 255, 'idle character remains');
  assert.equal(data[(250 * info.width + 110) * 4 + 3], 0, 'detached head is removed');
});

test('misaligned grid is normalized to exact cells', async () => {
  const gait = await asset('storm-warden-gait-v2.png');
  const oddSized = await sharp(gait).resize(1254, 1254).png().toBuffer();
  const fixed = await normalizeGrid(sharp, oddSized, 4, 4);
  await validateGait(sharp, fixed);
  assert.equal((await sharp(fixed).metadata()).width, 1024);
});

test('API applies identical pose-guided pass to templates AND custom briefs; retries bad output', { timeout: 30000 }, async () => {
  const base = (await asset('storm-warden-sprite-sheet-fixed.png')).toString('base64');
  const gait = (await asset('storm-warden-gait-v2.png')).toString('base64');
  const blank = (await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#00000000' } }).png().toBuffer()).toString('base64');
  const calls = [];
  let failGait = false;
  const provider = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    calls.push({ path: req.url, body: Buffer.concat(chunks).toString() });
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ data: [{ b64_json: req.url.endsWith('/generations') ? base : failGait ? blank : gait }] }));
  });
  provider.listen(0, '127.0.0.1');
  await once(provider, 'listening');
  const storage = await mkdtemp(join(tmpdir(), 'godot-forge-gait-test-'));
  const child = spawn(process.execPath, ['server.js'], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, PORT: '0', OPENAI_API_KEY: 'test-key-not-real', OPENAI_API_BASE: `http://127.0.0.1:${provider.address().port}`, APP_STORAGE_DIR: storage },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  // Server accepts port 0 and reports its actual bound port for isolated tests.
  try {
    let output = '';
    const url = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Test server startup timed out')), 10000);
      child.stdout.on('data', chunk => {
        output += chunk;
        const match = output.match(/http:\/\/localhost:(\d+)/);
        if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
      });
      child.once('exit', code => { clearTimeout(timeout); reject(new Error(`Test server exited: ${code}`)); });
    });
    for (const name of ['Volt', 'Luma', 'Cinder', 'Student custom clockwork healer']) {
      const response = await fetch(`${url}/api/sprites/generate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ character: { name } }) });
      const result = await response.json();
      assert.equal(response.status, 201, JSON.stringify(result));
      assert.equal(result.spriteSheet.columns, 8);
      assert.deepEqual(result.spriteSheet.rows, animationRows);
      assert.equal((await fetch(url + result.assetUrl)).status, 200);
    }
    const edits = calls.filter(call => call.path.endsWith('/edits'));
    assert.equal(edits.length, 4);
    for (const edit of edits) {
      assert.ok(edit.body.replaceAll('\r\n', '\n').includes(gaitPrompt));
      assert.ok(edit.body.includes('character-reference.png'));
      assert.ok(edit.body.includes('gait-pose-guide.png'));
    }
    failGait = true;
    const failed = await fetch(`${url}/api/sprites/generate`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ character: { name: 'Bad gait' } }) });
    assert.equal(failed.status, 502);
    assert.equal(calls.filter(call => call.path.endsWith('/edits')).length, 6);
  } finally {
    child.kill('SIGTERM');
    await once(child, 'exit');
    provider.closeAllConnections();
    provider.close();
    // Isolated DB retained in this test-specific temporary directory for debugging.
  }
});

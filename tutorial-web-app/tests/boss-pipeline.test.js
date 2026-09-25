import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { repairBossSheet, bossAnimationRows, packedBossLayout, actionPrompt } from '../../boss-creation/animation-pipeline.mjs';
import { bossManifest } from '../sprite-manifest.mjs';

const gait = () => readFile(new URL('../../character-creation/data/storm-warden-gait-v2.png', import.meta.url));
async function sheet(columns, rows) {
  const cells = Array.from({ length: rows * columns }, (_, i) => `<rect x="${i % columns * 256 + 40}" y="${Math.floor(i / columns) * 256 + 24}" width="${90 + i % columns * 15}" height="200" fill="rgb(${30 + i * 3},100,200)"/>`);
  return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${columns * 256}" height="${rows * 256}">${cells.join('')}</svg>`)).png().toBuffer();
}

test('boss pack contains every action, eight movement frames and isolated cells', async () => {
  const source = await sheet(4, 7), action = await sheet(2, 2), movement = await gait();
  const cache = new Map(), calls = [];
  const hooks = {
    load: async key => cache.get(key), save: async (key, bytes) => cache.set(key, bytes),
    edit: async ({ key, prompt, reference, guide }) => {
      calls.push(key);
      assert.ok(reference.length && guide.length);
      assert.match(prompt, key === 'gait' ? /cross the lower legs/ : /pose/);
      return key === 'gait' ? movement : action;
    },
  };
  const result = await repairBossSheet(sharp, source, { name: 'Test boss' }, hooks);
  assert.deepEqual(calls, ['gait', 'attack', 'enrage']);
  assert.deepEqual(result.layout.animations.map(a => a.frames.length), [1, 8, 8, 4, 4, 4, 4]);
  assert.deepEqual(result.layout.unavailable, []);
  for (const animation of result.layout.animations) for (const frame of animation.frames) {
    const data = await sharp(result.bytes).extract({ left: frame.x, top: frame.y, width: 256, height: 256 }).raw().toBuffer();
    let occupied = 0;
    for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
      const alpha = data[(y * 256 + x) * 4 + 3];
      occupied += alpha > 32;
      if (x === 0 || y === 0 || x === 255 || y === 255) assert.equal(alpha, 0, `${animation.key} has a transparent gutter`);
    }
    assert.ok(occupied > 500, `${animation.key} is not blank`);
  }
  await repairBossSheet(sharp, source, {}, hooks);
  assert.equal(calls.length, 3, 'resume must reuse all completed passes');
});

test('a failed combat pass preserves movement and resumes without another gait request', async () => {
  const source = await sheet(4, 7), movement = await gait(), action = await sheet(2, 2);
  const blank = await sharp({ create: { width: 512, height: 512, channels: 4, background: '#00000000' } }).png().toBuffer();
  let fail = true;
  const cache = new Map(), calls = [];
  const hooks = {
    load: async key => cache.get(key), save: async (key, bytes) => cache.set(key, bytes),
    edit: async ({ key }) => { calls.push(key); return key === 'gait' ? movement : fail ? blank : action; },
  };
  await assert.rejects(repairBossSheet(sharp, source, {}, hooks), /attack.*Completed passes are saved/);
  assert.ok(cache.has('gait'));
  assert.ok(!cache.has('attack'));
  fail = false;
  await repairBossSheet(sharp, source, {}, hooks);
  assert.deepEqual(calls, ['gait', 'attack', 'attack', 'enrage']);
});

test('combat directions require readable pose changes; combat does not loop back to life', () => {
  assert.match(actionPrompt('attack'), /wind-up.*strike.*recovery/);
  assert.match(actionPrompt('enrage'), /energy gathering.*tension.*release.*fully enraged/);
  assert.equal(bossAnimationRows.find(a => a.key === 'enrage').loop, false);
  assert.equal(bossAnimationRows.find(a => a.key === 'attack').loop, false);
});

test('repaired boss manifest retains all 33 explicit atlas rectangles', () => {
  const image = { originalName: 'iron-saint-boss.png', assetUrl: '/api/assets/example.png' };
  const manifest = bossManifest(image, 2048, 1792, { ...packedBossLayout(), spriteSheetVersion: 3 });
  assert.equal(manifest.animations.reduce((sum, row) => sum + row.frames.length, 0), 33);
  assert.deepEqual(manifest.animations.find(row => row.name === 'enrage').frames[3], { x: 768, y: 1536, width: 256, height: 256 });
  assert.deepEqual(manifest.anchor, { x: 128, y: 240 });
});

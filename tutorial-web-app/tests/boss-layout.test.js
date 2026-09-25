import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectBossLayout } from '../../boss-creation/sprite-layout.mjs';

function fixture() {
  const width = 400, height = 700, data = new Uint8Array(width * height * 4);
  const ys = [0, 100, 200, 278, 396, 490, 598, 700];
  const fill = (left, top, right, bottom, value) => {
    for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
      const p = (y * width + x) * 4;
      data[p] = value; data[p + 3] = 255;
    }
  };
  for (let row = 0; row < 7; row++) for (let col = 0; col < 4; col++) {
    fill(col * 100 + 12 + col, ys[row] + 8, col * 100 + 84 + col, ys[row + 1] - 8, row * 4 + col + 1);
  }
  return { width, height, data, fill };
}

test('uneven rows crop exactly one pose; idle uses one fixed frame', () => {
  const { data, width, height } = fixture();
  const layout = inspectBossLayout(data, width, height);
  assert.deepEqual(layout.unavailable, []);
  assert.equal(layout.animations[0].frames.length, 1);
  layout.animations.forEach((animation, row) => {
    animation.frames.forEach((frame, col) => {
      const colors = new Set();
      for (let y = frame.y; y < frame.y + frame.height; y++) for (let x = frame.x; x < frame.x + frame.width; x++) {
        const p = (y * width + x) * 4;
        if (data[p + 3]) colors.add(data[p]);
      }
      assert.deepEqual([...colors], [row * 4 + col + 1]);
    });
  });
  assert.equal(layout.animations.find(row => row.key === 'death').loop, false);
});

test('overlapping cells cannot enter playback; valid rows remain usable', () => {
  const { data, width, height, fill } = fixture();
  fill(20, 320, 380, 330, 255);
  const layout = inspectBossLayout(data, width, height);
  assert.ok(layout.unavailable.includes('attack'));
  assert.ok(!layout.animations.some(row => row.key === 'attack'));
  assert.ok(layout.animations.some(row => row.key === 'idle'));
});

test('single opaque concept is never treated as seven animations', () => {
  const data = new Uint8Array(400 * 700 * 4).fill(255);
  assert.equal(inspectBossLayout(data, 400, 700).animations.length, 0);
});

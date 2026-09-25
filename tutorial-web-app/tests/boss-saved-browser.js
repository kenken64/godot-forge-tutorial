import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const source = '/api/assets/ea1aa6bc-0ee0-455f-abe8-4fc86646cc8c.png';
const layout = await (await fetch(`${base}/api/bosses/layout?assetUrl=${encodeURIComponent(source)}`)).json();
assert.equal(layout.spriteSheetVersion, 3);
assert.deepEqual(layout.animations.map(row => row.frames.length), [1, 8, 8, 4, 4, 4, 4]);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage();
  let imageRequests = 0;
  await page.route('**/api/bosses/repair', route => { imageRequests++; return route.abort(); });
  await page.route('**/api/bosses/generate', route => { imageRequests++; return route.abort(); });
  await page.route('**/api/modules/boss-creation/checkpoint*', route => route.fulfill({ json: { state: {
    currentStep: 6, generatedBoss: { assetUrl: source, originalName: 'the-iron-saint-boss-sprite-sheet.png' },
    direction: { name: 'The Iron Saint', archetype: 'War machine', weapon: 'A storm of molten iron', silhouette: 'A cathedral-sized hammer', palette: [], phases: 'Awakened weapon', artDirection: 'Armoured forge guardian' },
  } } }));
  await page.goto(`${base}/boss-creation/`);
  await page.waitForFunction(() => !document.querySelector('#boss-animation-preview').hidden);
  assert.equal(await page.locator('#boss-animation-select option:disabled').count(), 0);
  const canvas = page.locator('#boss-animation-preview');
  const snapshot = () => canvas.evaluate(c => c.toDataURL());
  await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '0');
  const idle = await snapshot();
  await page.waitForTimeout(650);
  assert.equal(await snapshot(), idle);
  for (const action of ['walk', 'run', 'attack', 'enrage']) {
    await page.selectOption('#boss-animation-select', action);
    await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '0');
    const first = await snapshot();
    const last = ['walk', 'run'].includes(action) ? '7' : '3';
    await page.waitForFunction(last => document.querySelector('#boss-animation-preview').dataset.frame === last, last);
    assert.notEqual(await snapshot(), first, `${action} moves`);
    await canvas.screenshot({ path: `/tmp/godot-forge-boss-${action}.png` });
  }
  assert.equal(imageRequests, 0, 'existing boss upgrades on resume without generation');
  console.log('PASS: saved Iron Saint resumes repaired atlas, steady idle, eight-frame movement, attack/enrage playback, zero generation requests.');
} finally { await browser.close(); }

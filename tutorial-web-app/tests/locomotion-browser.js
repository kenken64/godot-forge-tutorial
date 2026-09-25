import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const evidence = new URL('../test-results/', import.meta.url);
await mkdir(evidence, { recursive: true });
try {
  let exportedIdle = null;
  await page.route('**/api/assets?module=character-creation', async route => {
    if (route.request().method() !== 'POST') return route.continue();
    const image = route.request().postDataBuffer();
    const { data, info } = await sharp(image).extract({ left: 0, top: 0, width: 256, height: 256 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    exportedIdle = { body: data[(100 * info.width + 100) * 4 + 3], tail: Array.from({ length: 256 * 16 }, (_, i) => data[((240 + Math.floor(i / 256)) * info.width + i % 256) * 4 + 3]).some(alpha => alpha > 32) };
    await route.fulfill({ status: 201, json: { assetUrl: '/character-creation/data/storm-warden-sprite-sheet-v2.png', originalName: 'clean-sprite-sheet.png' } });
  });
  await page.goto(`${baseUrl}/character-creation/`);
  for (const template of ['stormWarden', 'moonScout', 'emberSage']) {
    await page.selectOption('#character-template', template);
    await page.click('#preview-template');
    await page.waitForFunction(() => !generationInProgress && spriteImage !== null);
    const result = await page.evaluate(() => {
      const recorded = [];
      const original = drawSpriteFrame;
      drawSpriteFrame = (...args) => { recorded.push([args[5], args[6]]); original(...args); };
      const cycles = {};
      for (const action of ['walk', 'run']) {
        selectedAnimation = action;
        const row = spriteSheet.rows.find(r => r.key === action);
        const offset = recorded.length;
        for (let frame = 0; frame < 8; frame++) drawSpritePreview((frame + .25) * 1000 / row.fps);
        cycles[action] = recorded.slice(offset).map(entry => entry[1]);
      }
      drawSpriteFrame = original;
      selectedAnimation = 'walk';
      // Verify real pixel mirroring, not only facingDirection state.
      const a = document.createElement('canvas'), b = document.createElement('canvas');
      a.width = b.width = a.height = b.height = 256;
      const ac = a.getContext('2d'), bc = b.getContext('2d');
      drawSpriteFrame(ac, 0, 0, 256, 256, 1, 2, false);
      drawSpriteFrame(bc, 0, 0, 256, 256, 1, 2, true);
      const ap = ac.getImageData(0, 0, 256, 256).data;
      const bp = bc.getImageData(0, 0, 256, 256).data;
      let mismatches = 0;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) for (let c = 0; c < 4; c++) {
        if (ap[(y * 256 + x) * 4 + c] !== bp[(y * 256 + 255 - x) * 4 + c]) mismatches++;
      }
      return { cycles, mismatches, columns: spriteSheet.columns, idle: animationFrameCount(spriteSheet.rows[0]) };
    });
    assert.deepEqual(result.cycles.walk, [0, 1, 2, 3, 4, 5, 6, 7]);
    assert.deepEqual(result.cycles.run, [0, 1, 2, 3, 4, 5, 6, 7]);
    assert.equal(result.mismatches, 0);
    assert.equal(result.idle, 1);
    assert.equal(result.columns, 8);
    await page.waitForFunction(() => document.querySelector('#movement-canvas').dataset.animation === 'idle');
    if (template === 'stormWarden') {
      const idle = await page.evaluate(() => {
        const source = document.createElement('canvas');
        source.width = source.height = 256;
        source.getContext('2d').drawImage(spriteImage, 0, 0, 256, 256, 0, 0, 256, 256);
        const original = source.getContext('2d').getImageData(0, 240, 256, 16).data;
        const clean = spriteImageForDisplay().getContext('2d').getImageData(0, 240, 256, 16).data;
        const pixels = data => Array.from({ length: data.length / 4 }, (_, i) => data[i * 4 + 3] > 32).filter(Boolean).length;
        return { original: pixels(original), clean: pixels(clean), sheetWidth: document.querySelector('#sprite-sheet-canvas').getBoundingClientRect().width };
      });
      assert.ok(idle.original > 0, 'sample source contains the detached idle fragment');
      assert.equal(idle.clean, 0, 'idle display removes the detached fragment');
      assert.ok(idle.sheetWidth >= 400, 'the full sprite sheet is readable in the desktop card');
      await page.click('#save-sprite');
      await page.waitForFunction(() => spriteAsset !== null);
      assert.equal(exportedIdle.tail, false, 'Save PNG exports the cleaned transparent sheet');
    }
    await page.locator('#movement-canvas').screenshot({ path: new URL(`${template}-movement.png`, evidence).pathname });
    console.log(`PASS ${template}: 8-frame walk/run, idle hold, pixel-exact left/right mirroring`);
  }
  await page.evaluate(() => document.activeElement.blur());
  assert.match(await page.locator('#movement-keymap').textContent(), /NO MOVE KEY/);
  await page.keyboard.down('A');
  await page.waitForFunction(() => facingDirection === -1 && movementCanvas.dataset.animation === 'walk');
  await page.keyboard.down('Shift');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'run');
  assert.equal(await page.evaluate(() => keys.has('a') && keys.has('Shift')), true);
  await page.keyboard.up('A');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'idle');
  await page.keyboard.up('Shift');
  await page.keyboard.down('D');
  await page.waitForFunction(() => facingDirection === 1 && movementCanvas.dataset.animation === 'walk');
  assert.equal(await page.evaluate(() => keys.has('d') && !keys.has('a')), true);
  await page.keyboard.up('D');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'idle');
  await page.keyboard.down('Space');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'jump');
  await page.keyboard.up('Space');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'idle');
  await page.keyboard.press('j');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'attack');
  await page.keyboard.press('i');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'idle');
  await page.keyboard.press('x');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'death');
  await page.keyboard.press('i');
  await page.waitForFunction(() => movementCanvas.dataset.animation === 'idle');
  console.log('PASS keyboard map: idle, left/right walk, Shift run, Space jump, J attack, X defeat, I reset');

  let failGeneration = false;
  let generationCalls = 0;
  const sheet = JSON.parse(await readFile(new URL('../../character-creation/data/storm-warden-sprite-sheet-v2.json', import.meta.url), 'utf8'));
  await page.route('**/api/chat', async route => {
    const plan = route.request().postDataJSON().messages[1].content.includes('movement plan');
    await route.fulfill({ json: { message: { content: JSON.stringify(plan ? { spriteSheet: sheet, movement: { speed: 160 } } : { character: { name: 'Test character' } }) } } });
  });
  await page.route('**/api/sprites/generate', async route => {
    generationCalls++;
    const disabled = await page.evaluate(() => [...document.querySelectorAll('button, input, select, textarea')].every(el => el.disabled));
    assert.equal(disabled, true, 'controls must remain locked through the second generation stage');
    const request = route.request().postDataJSON();
    assert.equal(request.spriteSheet.columns, 8);
    assert.equal(request.spriteSheet.rows.find(row => row.key === 'walk').frames, 8);
    assert.equal('template' in request, false, 'custom and template briefs use the same request');
    await route.fulfill(failGeneration ? { status: 502, json: { error: 'Test: invalid leg poses' } } : { status: 201, json: { assetUrl: sheet.assetUrl, spriteSheet: sheet } });
  });
  for (const template of ['stormWarden', 'moonScout', 'emberSage', null]) {
    if (template) {
      await page.selectOption('#character-template', template);
      await page.click('#load-template');
    } else {
      await page.evaluate(() => {
        templateSelect.value = '';
        creativePromptInput.value = 'My original clockwork healer';
        Object.assign(answers, { name: 'Tick', role: 'Healer', weapon: 'Clock staff' });
        isComplete = true;
        aiDesign = null;
        spriteSheet = null;
        spriteAsset = null;
        spriteImage = null;
        movementSpec = null;
        renderProfile();
      });
    }
    await page.click('#build-character');
    await page.waitForFunction(() => !generationInProgress && spriteImage !== null);
    assert.equal(await page.locator('#save-status').textContent(), '');
    assert.equal(await page.locator('#build-character').isEnabled(), true);
    console.log(`PASS ${template || 'custom brief'} build: shared eight-frame contract and generation lock`);
  }
  failGeneration = true;
  await page.evaluate(() => {
    spriteSheet = null;
    spriteAsset = null;
    spriteImage = null;
  });
  await page.click('#create-sprite');
  await page.waitForFunction(() => !generationInProgress && saveStatus.textContent.includes('invalid leg poses'));
  assert.equal(await page.locator('#create-sprite').isEnabled(), true);
  assert.equal(await page.locator('#generation-progress').isHidden(), true);
  assert.equal(generationCalls, 5);
  assert.deepEqual(errors, []);
  console.log('PASS generation failure restores controls and reports error; no browser exceptions');
} finally {
  await browser.close();
}

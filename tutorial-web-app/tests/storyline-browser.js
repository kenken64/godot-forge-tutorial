import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-storyline-test-'));
const child = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '', errors = '';
child.stderr.on('data', chunk => { errors += chunk; });
const baseUrl = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`Storyline test server timeout: ${errors}`)), 10000);
  child.on('exit', code => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${errors}`)); });
  child.stdout.on('data', chunk => {
    output += chunk;
    const match = output.match(/http:\/\/localhost:(\d+)/);
    if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
  });
});
let browser;
try {
  for (const kind of ['character', 'boss']) {
    const png = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="64"><rect x="12" y="6" width="40" height="52" fill="${kind === 'boss' ? '#f37951' : '#9c9cff'}"/><rect x="76" y="6" width="40" height="52" fill="${kind === 'boss' ? '#ffbb65' : '#b6c2ff'}"/></svg>`)).png().toBuffer();
    const imageResponse = await fetch(`${baseUrl}/api/assets?module=final-game`, {
      method: 'POST', headers: { 'content-type': 'image/png', 'x-file-name': `${kind}-preview.png` }, body: png,
    });
    assert.equal(imageResponse.status, 201);
    const image = await imageResponse.json();
    const manifest = { version: 1, kind, image: { file: `${kind}-preview.png`, assetUrl: image.assetUrl, width: 128, height: 64 },
      animations: [{ name: 'idle', fps: 4, loop: true, frames: [{ x: 0, y: 0, width: 64, height: 64 }, { x: 64, y: 0, width: 64, height: 64 }] },
        { name: kind === 'boss' ? 'enrage' : 'walk', fps: 4, loop: true, frames: [{ x: 0, y: 0, width: 64, height: 64 }, { x: 64, y: 0, width: 64, height: 64 }] }] };
    const metadataResponse = await fetch(`${baseUrl}/api/assets?module=final-game`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-file-name': `${kind}-preview.json` }, body: JSON.stringify(manifest),
    });
    assert.equal(metadataResponse.status, 201);
  }
  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(baseUrl);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 16);
  assert.equal(await page.locator('#module-nav a[href="/storyline-engine/"]').count(), 1);
  await page.goto(`${baseUrl}/storyline-engine/`);
  await page.waitForFunction(() => window.storyPreview?.usesHeroSprite && window.storyPreview?.usesBossSprite);
  await page.waitForFunction(() => document.querySelectorAll('.prompt-card').length === 6);
  assert.equal(await page.locator('.attribute-card').count(), 5);
  assert.match(await page.locator('.attribute-card').first().textContent(), /Player fantasy/);
  assert.match(await page.locator('.prompt-card').first().locator('pre').textContent(), /Use case: stylized-concept/);
  assert.match(await page.locator('.prompt-card').last().locator('pre').textContent(), /speech bubble panel texture/);
  assert.match(await page.locator('#prompt-model').textContent(), /gpt-image-2\.5-sunburst/);
  assert.equal(await page.locator('#phaser-stage canvas').count(), 1);
  assert.equal(await page.locator('#hero-picker option').count(), 2);
  assert.equal(await page.locator('#boss-picker option').count(), 2);
  assert.equal(await page.evaluate(() => window.storyPreview.mood), 'drought');
  assert.equal(await page.evaluate(() => window.storyPreview.hasBubbleTexture), true);
  assert.equal(await page.locator('#dialogue-speaker').textContent(), 'Explorer');
  assert.match(await page.locator('#dialogue-line').textContent(), /find my friend/);
  await page.evaluate(() => {
    window.__voiceRequests = [];
    window.Audio = class {
      constructor(src) { this.src = src; window.__voiceRequests.push(src); }
      play() { return Promise.resolve(); }
      pause() {}
      removeAttribute() {}
      load() {}
    };
    voiceConfigured = true;
    updateVoiceControls();
  });
  await page.click('#play-line');
  assert.match((await page.evaluate(() => new URL(window.__voiceRequests.at(-1), location.href).searchParams.get('text'))), /find my friend/);
  assert.equal(await page.evaluate(() => new URL(window.__voiceRequests.at(-1), location.href).searchParams.get('locale')), 'en');
  assert.equal(await page.locator('#play-line').getAttribute('aria-pressed'), 'true');
  await page.click('#next-line');
  assert.equal(await page.locator('#dialogue-speaker').textContent(), 'Guardian');
  assert.match(await page.locator('#dialogue-line').textContent(), /spring is sealed/);
  await page.check('#auto-voice');
  assert.match((await page.evaluate(() => new URL(window.__voiceRequests.at(-1), location.href).searchParams.get('text'))), /spring is sealed/);
  assert.equal(await page.evaluate(() => new URL(window.__voiceRequests.at(-1), location.href).searchParams.get('speaker')), 'guardian');
  assert.equal(await page.evaluate(() => window.storyPreview.dialogue.speaker), 'guardian');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: '/private/tmp/godot-forge-storyline-preview.png', fullPage: true });
  await page.selectOption('#hero-picker', '');
  await page.selectOption('#boss-picker', '');
  await page.waitForFunction(() => window.storyPreview?.generatedFallbacks && !window.storyPreview?.usesHeroSprite && !window.storyPreview?.usesBossSprite);
  await page.screenshot({ path: '/private/tmp/godot-forge-storyline-generated-fallbacks.png', fullPage: true });
  await page.locator('#choices button').nth(1).click();
  await page.waitForFunction(() => document.querySelector('#trust-value').textContent === '3');
  assert.match(await page.locator('#dialogue-line').textContent(), /market was almost empty/);
  assert.equal(await page.locator('#supplies-value').textContent(), '1');
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#beat-label').textContent.startsWith('02 /'));
  assert.equal(await page.locator('#trust-value').textContent(), '3');
  await page.click('#next-line');
  await page.waitForFunction(async () => {
    const learnerId = localStorage.getItem('godot-forge-learner-id');
    const response = await fetch(`/api/modules/storyline-engine/checkpoint?learnerId=${learnerId}`);
    const checkpoint = await response.json();
    return checkpoint.state?.choices?.length === 1 && checkpoint.state?.dialogueIndex === 1;
  });
  await page.reload();
  await page.waitForFunction(() => document.querySelector('#dialogue-speaker').textContent === 'Guardian');
  assert.equal(await page.locator('#dialogue-count').textContent(), '2 / 2');
  await page.click('#languages [data-locale="zh"]');
  assert.match(await page.locator('.attribute-card').first().textContent(), /玩家幻想/);
  assert.match(await page.locator('.prompt-card').first().locator('pre').first().textContent(), /用途：风格化概念图/);
  assert.match(await page.locator('.prompt-original').first().locator('pre').textContent(), /Use case: stylized-concept/);
  assert.equal(await page.locator('#dialogue-speaker').textContent(), '守护者');
  await page.locator('#choices button').nth(1).click();
  await page.waitForFunction(() => document.querySelector('#water-value').textContent === '1');
  await page.click('#next-line');
  assert.match(await page.locator('#dialogue-line').textContent(), /攻击削弱了封印/);
  await page.click('#languages [data-locale="ms"]');
  assert.match(await page.locator('.attribute-card').first().textContent(), /Fantasi pemain/);
  assert.match(await page.locator('.prompt-card').first().locator('pre').first().textContent(), /Kegunaan: konsep bergaya/);
  assert.match(await page.locator('#dialogue-line').textContent(), /Seranganmu melemahkan meterai/);
  await page.locator('#choices button').first().click();
  await page.locator('#choices button').first().click();
  await page.locator('#choices button').first().click();
  await page.waitForFunction(() => document.querySelector('#beat-label').textContent.startsWith('06 /'));
  assert.match(await page.locator('#beat-body').textContent(), /Pasar dibuka semula/);
  assert.equal(await page.evaluate(() => window.storyPreview.mood), 'restored');
  await page.click('#complete-story');
  await page.waitForFunction(() => document.querySelector('#complete-story').textContent.includes('✓'));
  const learnerId = await page.evaluate(() => localStorage.getItem('godot-forge-learner-id'));
  const modules = await (await fetch(`${baseUrl}/api/modules?learnerId=${learnerId}`)).json();
  assert.equal(modules.find(module => module.slug === 'storyline-engine').completed, true);
  await page.click('#replay-story');
  for (let beat = 0; beat < 5; beat++) await page.locator('#choices button').nth(beat === 4 ? 1 : 0).click();
  assert.equal(await page.evaluate(() => window.storyPreview.mood), 'flood');
  assert.deepEqual(pageErrors, []);
  console.log('PASS Phaser storyline preview, five attributes, saved sprites, choices and resume');
} finally {
  await browser?.close();
  const exited = once(child, 'exit'); child.kill('SIGTERM'); await exited;
}

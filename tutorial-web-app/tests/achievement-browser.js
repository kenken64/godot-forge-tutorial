import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-achievement-test-'));
const server = spawn(process.execPath, ['server.js'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
let browser;
try {
  const baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Achievement test server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Achievement test server exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const original = CanvasRenderingContext2D.prototype.drawImage;
    window.walkFrames = new Set();
    CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
      if (image instanceof HTMLImageElement && image.src.includes('forest-sword-explorer.png') && args.length === 8 && args[1] === 256) window.walkFrames.add(args[0]);
      return original.call(this, image, ...args);
    };
  });
  await page.goto(`${baseUrl}/game-achievement/`);
  await page.locator('#achievement-stage').waitFor();
  for (const name of ['forest-arena', 'gold-coin', 'heart-pickup', 'gold-badge', 'heart-badge']) {
    assert.equal((await page.request.get(`${baseUrl}/game-achievement/images/${name}.webp`)).status(), 200);
  }
  assert.equal((await page.request.get(`${baseUrl}/items-spawning/images/forest-sword-explorer.png`)).status(), 200);
  assert.equal(await page.locator('.prompt-card').count(), 5);
  await page.locator('.prompt-card summary').first().click();
  assert.match(await page.locator('.prompt-card pre').first().textContent(), /enchanted woodland clearing/);
  assert.equal(await page.locator('a[href$=".txt"]').count(), 0);
  assert.equal(await page.locator('#gold-count').textContent(), '0 / 10');
  assert.equal(await page.locator('#hp-count').textContent(), '2 / 3');
  assert.equal(await page.locator('#complete-module').isDisabled(), true);
  await page.click('#tab-badges');
  assert.equal(await page.locator('.badge-card.is-locked').count(), 2);
  assert.match(await page.locator('[data-badge="gold"] img').evaluate(node => getComputedStyle(node).filter), /grayscale/);
  await page.click('#tab-play');
  await page.locator('#achievement-stage').click();
  await page.keyboard.down('ArrowRight');
  await page.waitForFunction(() => document.querySelector('#hp-count')?.textContent === '3 / 3');
  await page.keyboard.up('ArrowRight');
  assert.ok(await page.evaluate(() => window.walkFrames.size >= 4), 'the explorer should display multiple walking frames');
  assert.equal(await page.locator('#reveal-title').textContent(), 'Heart Restored');
  assert.equal(await page.locator('#unlock-reveal').isVisible(), true);
  await page.click('#view-badges');
  assert.equal(await page.locator('[data-badge="heart"].is-earned').count(), 1);
  assert.equal(await page.locator('[data-badge="gold"].is-locked').count(), 1);
  assert.equal(await page.locator('[data-badge="heart"] img').evaluate(node => getComputedStyle(node).filter), 'none');
  await page.click('#back-to-play');
  await page.locator('#achievement-stage').click();
  await page.keyboard.down('ArrowRight');
  await page.waitForFunction(() => document.querySelector('#gold-count')?.textContent === '10 / 10');
  await page.keyboard.up('ArrowRight');
  assert.equal(await page.locator('#reveal-title').textContent(), 'Gold Collector');
  assert.equal(await page.locator('#complete-module').isEnabled(), true);
  const learnerId = await page.evaluate(() => localStorage.getItem('godot-forge-learner-id'));
  await page.waitForFunction(async id => {
    const response = await fetch(`/api/modules/game-achievement/checkpoint?learnerId=${encodeURIComponent(id)}`);
    const state = (await response.json()).state;
    return state?.collected?.length === 10 && state.heartCollected === true;
  }, learnerId);
  await page.reload();
  await page.click('#tab-badges');
  assert.equal(await page.locator('.badge-card.is-earned').count(), 2);
  assert.equal(await page.locator('.badge-card.is-locked').count(), 0);
  assert.equal(await page.locator('[data-badge="gold"] img').evaluate(node => getComputedStyle(node).filter), 'none');
  assert.equal(await page.locator('#collection-count').textContent(), '2 / 2');
  await page.click('#tab-play');
  assert.equal(await page.locator('#gold-count').textContent(), '10 / 10');
  assert.equal(await page.locator('#hp-count').textContent(), '3 / 3');
  await page.click('#complete-module');
  await page.waitForFunction(async id => (await (await fetch(`/api/modules?learnerId=${encodeURIComponent(id)}`)).json()).find(module => module.slug === 'game-achievement')?.completed === true, learnerId);
  await page.click('[data-locale="zh"]');
  assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
  assert.match(await page.locator('#page-title').textContent(), /徽章/);
  await page.click('[data-locale="ms"]');
  assert.equal(await page.locator('html').getAttribute('lang'), 'ms');
  assert.match(await page.locator('#page-title').textContent(), /lencana/i);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  console.log('PASS ten gold, heart HP, animated unlocks, grey-to-color badges, saved progress, localization, and mobile layout');
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}

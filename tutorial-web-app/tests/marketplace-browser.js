import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-marketplace-test-'));
const server = spawn(process.execPath, ['server.js'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
let baseUrl;
try {
  baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Marketplace test server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Marketplace test server exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => { const match = `${output}${chunk}`.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${baseUrl}/marketplace-system/`);
    await page.locator('.gear-card').first().waitFor();
    await page.locator('#reset-module').waitFor();
    assert.match(await page.locator('.module-header #chapter').textContent(), /CHAPTER 14 \/ MARKETPLACE SYSTEM/);
    assert.match(await page.locator('.module-header .back-link').textContent(), /GODOT FORGE \/ LEARNING PATH/);
    assert.equal(await page.locator('.module-header #languages').count(), 1);
    for (const name of ['mossweave-armor', 'leafsteel-sword', 'emerald-ring', 'heartseed-necklace']) {
      assert.equal((await page.request.get(`${baseUrl}/marketplace-system/images/${name}.webp`)).status(), 200);
    }
    assert.equal(await page.locator('.gear-card').count(), 12);
    assert.equal(await page.locator('#gold-count').textContent(), '300');
    await page.click('[data-category="necklace"]');
    assert.equal(await page.locator('.gear-card').count(), 3);
    await page.click('[data-category="all"]');
    await page.click('[data-grade="epic"]');
    assert.equal(await page.locator('.gear-card').count(), 4);
    assert.deepEqual(await page.locator('.gear-card .rarity-badge').allTextContents(), ['Epic', 'Epic', 'Epic', 'Epic']);
    await page.click('[data-grade="all"]');
    await page.click('[data-action="sell"][data-item="starter-coat"]');
    assert.equal(await page.locator('#gold-count').textContent(), '355');
    await page.click('[data-action="buy"][data-item="leafsteel-sword"]');
    assert.equal(await page.locator('#gold-count').textContent(), '190');
    await page.click('[data-action="salvage"][data-item="leafsteel-sword"]');
    assert.equal(await page.locator('#gold-count').textContent(), '168');
    assert.equal(await page.locator('#dust-count').textContent(), '6');
    await page.reload();
    assert.equal(await page.locator('#gold-count').textContent(), '168');
    await page.click('[data-locale="zh"]');
    assert.equal(await page.locator('[data-grade="rare"]').textContent(), '稀有');
    assert.match(await page.locator('.prompt-card textarea').first().inputValue(), /为奇幻林地冒险创作一枚精致护甲图标/);
    await page.click('[data-locale="ms"]');
    assert.equal(await page.locator('[data-grade="epic"]').textContent(), 'Epik');
    assert.match(await page.locator('.prompt-card textarea').first().inputValue(), /Cipta satu ikon perisai premium/);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS marketplace gear art, category filters, buy, sell, gold-fee salvage, persistent wallet, localized prompts, and mobile layout');
  } finally { await browser.close(); }
} finally { if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; } }

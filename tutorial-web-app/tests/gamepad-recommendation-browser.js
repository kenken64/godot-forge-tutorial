import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-gamepad-link-test-'));
const server = spawn(process.execPath, ['server.js'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
let baseUrl;
try {
  baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Gamepad-link test server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Gamepad-link test server exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => { const match = `${output}${chunk}`.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); } });
  });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${baseUrl}/game-controls/`);
    await page.locator('#gamepad-buy-link').waitFor();
    assert.equal(await page.locator('#gamepad-buy-link').getAttribute('href'), 'https://www.amazon.com/dp/B081HML6MP?th=1');
    assert.equal(await page.locator('#gamepad-buy-link').getAttribute('target'), '_blank');
    assert.equal(await page.locator('#gamepad-buy-link').getAttribute('rel'), 'noopener noreferrer');
    assert.match(await page.locator('#gamepad-recommendation-title').textContent(), /Recommended mini gamepad/);
    await page.locator('#playtest-stage canvas').waitFor();
    await page.waitForFunction(() => performance.getEntriesByType('resource').some(entry => entry.name.includes('/game-controls/images/training-dummy.webp')));
    assert.equal((await page.request.get(`${baseUrl}/game-controls/images/training-dummy.webp`)).status(), 200);
    assert.match(await page.locator('#dummy-prompt').textContent(), /wooden sparring dummy/);
    assert.match(await page.locator('#dummy-art-credit').textContent(), /GPT Image 2\.5 Sunburst/);
    await page.click('[data-locale="zh"]');
    assert.match(await page.locator('#gamepad-recommendation-title').textContent(), /推荐迷你游戏手柄/);
    assert.match(await page.locator('#gamepad-buy-link').textContent(), /前往 Amazon/);
    await page.click('[data-locale="ms"]');
    assert.match(await page.locator('#gamepad-recommendation-title').textContent(), /Cadangan pad permainan mini/);
    assert.match(await page.locator('#gamepad-buy-link').textContent(), /LIHAT DI AMAZON/);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS recommended gamepad link, safe new-tab attributes, English/Chinese/Malay copy, and mobile layout');
  } finally { await browser.close(); }
} finally { if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; } }

import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-credits-test-'));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverOutput = '';
server.stdout.on('data', chunk => { serverOutput += chunk; });
let baseUrl;
try {
  baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Credits test server timed out: ${serverOutput}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Credits test server exited ${code}: ${serverOutput}`)); });
    server.stdout.on('data', chunk => {
      const match = `${serverOutput}${chunk}`.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${baseUrl}/credits/`);
    await page.waitForFunction(() => document.querySelectorAll('.credit-entry').length === 7);
    assert.equal(await page.locator('.credits-window').count(), 1);
    assert.match(await page.locator('#credits-prompt').textContent(), /fictional contributor names/);
    assert.match(await page.locator('#image-prompt').textContent(), /six separate widescreen/);
    assert.match(await page.locator('#gallery-index').textContent(), /\/ 06/);
    for (const scene of ['grove-bridge', 'canopy-leap', 'heart-tree', 'boar-charge', 'guardian-encounter', 'crystal-spring']) {
      assert.equal((await page.request.get(`${baseUrl}/credits/images/${scene}.webp`)).status(), 200);
    }
    assert.equal(await page.locator('#complete-module').isDisabled(), true);
    await page.locator('#game-screenshot').evaluate(image => image.decode());
    const firstScene = await page.locator('#game-screenshot').getAttribute('src');
    await page.click('#next-screenshot');
    await page.waitForFunction(previous => document.querySelector('#game-screenshot').getAttribute('src') !== previous, firstScene);
    const learnerId = await page.evaluate(() => localStorage.getItem('godot-forge-learner-id'));
    await page.click('#skip-roll');
    await page.waitForFunction(async id => {
      const modules = await (await fetch(`/api/modules?learnerId=${encodeURIComponent(id)}`)).json();
      return modules.find(module => module.slug === 'credits')?.completed === true;
    }, learnerId);
    await page.click('[data-locale="zh"]');
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
    assert.equal(await page.locator('.credit-entry').count(), 7);
    assert.match(await page.locator('#credits-prompt').textContent(), /虚构贡献者姓名/);
    assert.match(await page.locator('#image-prompt').textContent(), /六张独立/);
    await page.click('[data-locale="ms"]');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ms');
    assert.match(await page.locator('#credits-prompt').textContent(), /nama penyumbang rekaan/);
    assert.match(await page.locator('#image-prompt').textContent(), /enam tangkap layar/);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS credits roll, fictional role list, generated screenshot gallery, prompts, localization, completion and mobile layout');
  } finally {
    await browser.close();
  }
} finally {
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}

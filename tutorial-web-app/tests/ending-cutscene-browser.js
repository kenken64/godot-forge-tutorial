import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-ending-test-'));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
try {
  const baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Ending test server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Ending test server exited ${code}: ${output}`)); });
    server.stdout.on('data', () => {
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${baseUrl}/game-ending-cutscene/`);
    await page.locator('#scene-image').evaluate(image => image.decode());
    assert.match(await page.locator('#scene-image').getAttribute('src'), /final-boss-comic\.webp$/);
    assert.equal(await page.locator('.asset-prompt').count(), 5);
    for (const asset of ['final-boss-comic', 'shrine-choice', 'ending-awaken', 'ending-dormant', 'dialogue-portraits']) {
      assert.equal((await page.request.get(`${baseUrl}/game-ending-cutscene/images/${asset}.webp`)).status(), 200);
    }
    await page.click('[data-locale="zh"]');
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
    assert.match(await page.locator('.asset-prompt pre').first().textContent(), /使用 OpenAI GPT Image 2\.5 Burst/);
    assert.match(await page.locator('.asset-prompt pre').nth(4).textContent(), /使用 OpenAI GPT Image 2\.5 Burst/);
    await page.click('[data-locale="ms"]');
    assert.equal(await page.locator('html').getAttribute('lang'), 'ms');
    assert.match(await page.locator('.asset-prompt pre').first().textContent(), /Gunakan OpenAI GPT Image 2\.5 Burst/);
    assert.match(await page.locator('.asset-prompt pre').nth(4).textContent(), /Gunakan OpenAI GPT Image 2\.5 Burst/);
    await page.click('[data-locale="en"]');
    await page.click('#continue-to-ending');
    assert.match(await page.locator('#dialogue-line').textContent(), /heartseed/);
    await page.click('#advance-dialogue');
    await page.click('#advance-dialogue');
    await page.click('#skip-dialogue');
    assert.equal(await page.locator('#choice-panel').isVisible(), true);
    await page.click('#choose-awaken');
    await page.waitForFunction(() => document.querySelector('#scene-image').getAttribute('src').endsWith('ending-awaken.webp'));
    assert.match(await page.locator('#ending-title').textContent(), /GROVE REMEMBERS/);
    const learnerId = await page.evaluate(() => localStorage.getItem('godot-forge-learner-id'));
    await page.waitForFunction(async id => {
      const modules = await (await fetch(`/api/modules?learnerId=${encodeURIComponent(id)}`)).json();
      return modules.find(module => module.slug === 'game-ending-cutscene')?.completed === true;
    }, learnerId);
    await page.click('#replay-ending');
    await page.waitForFunction(() => document.querySelector('#scene-image').getAttribute('src').endsWith('final-boss-comic.webp'));
    await page.click('#continue-to-ending');
    await page.click('#skip-dialogue');
    await page.click('#choose-dormant');
    await page.waitForFunction(() => document.querySelector('#scene-image').getAttribute('src').endsWith('ending-dormant.webp'));
    assert.match(await page.locator('#ending-title').textContent(), /QUIET PROMISE/);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS final-boss comic, translated image prompts, dialogue, both consequential endings, progress and mobile layout');
  } finally {
    await browser.close();
  }
} finally {
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}

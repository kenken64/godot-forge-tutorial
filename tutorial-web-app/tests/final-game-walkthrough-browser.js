import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-walkthrough-test-'));
const server = spawn(process.execPath, ['server.js'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
let baseUrl;
try {
  baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Walkthrough server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Walkthrough server exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => {
      const match = `${output}${chunk}`.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.stack));
    await page.goto(`${baseUrl}/final-game/#player`);
    await page.locator('#player .logic-panel').first().waitFor();
    assert.equal(await page.locator('.logic-panel').count(), 12);
    assert.equal(await page.locator('.logic-flow li').count(), 33);
    const detailAudit = await page.evaluate(() => {
      const missing = [];
      const invalid = [];
      for (const section of window.finalGameGuide) for (const file of section.files || []) {
        const functions = [...file.code.matchAll(/^func\s+(\w+)\s*\(|^static func\s+(\w+)\s*\(/gm)];
        for (let index = 0; index < functions.length; index++) {
          const name = functions[index][1] || functions[index][2];
          const body = file.code.slice(functions[index].index, functions[index + 1]?.index || file.code.length);
          const steps = window.finalGameFunctionDetails[file.name]?.[name];
          if (!steps?.length) { missing.push(`${file.name}:${name}`); continue; }
          for (const [snippet, explanation] of steps) {
            if (!body.includes(snippet) || !explanation) invalid.push(`${file.name}:${name}: ${snippet}`);
          }
        }
      }
      return { missing, invalid };
    });
    assert.deepEqual(detailAudit, { missing: [], invalid: [] });

    const playerCode = page.locator('#player .gdscript code').last();
    const rawCode = await playerCode.textContent();
    await page.locator('#player .gdscript [data-symbol="_physics_process"]').last().click();
    assert.match(await page.locator('#player .symbol-detail').last().textContent(), /Runs every physics frame/);
    assert.ok(await page.locator('#player .symbol-detail .function-steps li').last().count());
    assert.match(await page.locator('#player .symbol-detail').last().textContent(), /host-received movement/);
    assert.match(await page.locator('#player .symbol-detail').last().textContent(), /collisions/);
    assert.ok(await page.locator('#player .gdscript .gd-symbol.is-selected').count() >= 1);

    await page.evaluate(() => {
      const token = document.querySelector('#player .gdscript:last-of-type [data-symbol="remote_roll"]')
        || [...document.querySelectorAll('#player .gdscript [data-symbol="remote_roll"]')].at(-1);
      const range = document.createRange();
      range.selectNodeContents(token);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      token.closest('pre').dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    assert.match(await page.locator('#player .symbol-detail').last().textContent(), /pending online roll press/);
    assert.equal(await page.locator('#player .symbol-detail .function-steps li').last().count(), 0);

    await page.locator('#player .symbol-picker').last().selectOption('health');
    assert.match(await page.locator('#player .symbol-detail').last().textContent(), /Current hearts/);
    await page.locator('#player .copy-code').last().click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), rawCode);

    await page.click('[data-locale="zh"]');
    assert.equal(await page.locator('#player .logic-panel h4').last().textContent(), '逻辑流程');
    assert.equal(await page.locator('#player .gdscript code').last().textContent(), rawCode);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS all script walkthroughs, symbol click and selection, exact copy, localization, and mobile layout');
  } finally { await browser.close(); }
} finally { if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; } }

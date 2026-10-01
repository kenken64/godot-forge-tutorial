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
    await page.locator('#player .writing-stepper').waitFor();
    assert.equal(await page.locator('.writing-stepper').count(), 9);
    assert.equal(await page.locator('.copy-code').count(), 0);
    assert.ok(await page.locator('.file-reference').count() > 0);
    const initialHint = page.locator('#player .file-reference').first();
    assert.match(await initialHint.locator('summary').textContent(), /GDScript hint/);
    assert.equal(await initialHint.locator('.gdscript').isVisible(), false);
    await initialHint.locator('summary').click();
    assert.equal(await initialHint.locator('.gdscript').isVisible(), true);
    assert.match(await initialHint.locator('.gdscript code').textContent(), /func _physics_process/);
    await initialHint.locator('summary').click();

    const audit = await page.evaluate(() => {
      const normalize = value => value.split('\n').map(line => line.trim()).filter(Boolean).join('\n');
      const missing = [];
      const invalid = [];
      const incomplete = [];
      for (const section of window.finalGameGuide) {
        const tasks = window.finalGameWriting.makeTasks(section, window.finalGameWalkthrough, window.finalGameFunctionDetails);
        for (const file of section.files || []) {
          const actual = tasks.filter(task => task.kind === 'code' && task.fileName === file.name).map(task => task.code).join('\n');
          if (normalize(actual) !== normalize(window.finalGameWriting.codeToAdd(file))) incomplete.push(file.name);
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
      }
      const online = window.finalGameGuide.flatMap(section => section.files || []).find(file => file.name === 'scripts/Online.gd');
      return { missing, invalid, incomplete, relayResolved: !window.finalGameWriting.codeToAdd(online).includes('__RELAY_URL__') };
    });
    assert.deepEqual(audit, { missing: [], invalid: [], incomplete: [], relayResolved: true });

    await page.locator('#plan .writing-done').click();
    assert.match(await page.locator('#plan .writing-count').textContent(), /2 OF 5/);
    await page.reload();
    assert.match(await page.locator('#plan .writing-count').textContent(), /2 OF 5/);
    await page.locator('#plan .writing-done').click();
    await page.locator('#plan .writing-done').click();
    assert.match(await page.locator('#plan .step-code').textContent(), /var attack_bonus := 0/);
    assert.ok((await page.locator('#plan .step-code').textContent()).length < 70);

    for (let index = 0; index < 3; index++) await page.locator('#combat .writing-done').click();
    assert.equal(await page.locator('#combat .step-code').count(), 0);
    assert.match(await page.locator('#combat .step-outline').textContent(), /____/);
    await page.locator('#combat .writing-help').click();
    assert.ok((await page.locator('#combat .writing-hint').textContent()).length > 20);
    await page.locator('#combat .writing-reveal').click();
    assert.ok((await page.locator('#combat .step-code').textContent()).length < 300);

    const playerCount = await page.evaluate(() => window.finalGameWriting.makeTasks(
      window.finalGameGuide.find(section => section.id === 'player'),
      window.finalGameWalkthrough, window.finalGameFunctionDetails).length);
    for (let index = 0; index < playerCount; index++) await page.locator('#player .writing-done').click();
    assert.equal(await page.locator('#player .file-reference').count(), 2);
    assert.equal(await page.locator('.copy-code').count(), 0);
    await page.locator('#player .file-reference').first().locator('summary').click();
    const playerCode = page.locator('#player .file-reference').first().locator('.gdscript code');
    const rawCode = await playerCode.textContent();
    await page.locator('#player .file-reference').first().locator('[data-symbol="_physics_process"]').first().click();
    assert.match(await page.locator('#player .file-reference').first().locator('.symbol-detail').textContent(), /Runs every physics frame/);
    assert.match(await page.locator('#player .file-reference').first().locator('.symbol-detail').textContent(), /host-received movement/);
    assert.ok(await page.locator('#player .file-reference').first().locator('.function-steps li').count() > 4);

    await page.click('[data-locale="zh"]');
    await page.locator('#player .file-reference').first().locator('summary').click();
    assert.equal(await page.locator('#player .logic-panel h4').first().textContent(), '逻辑流程');
    assert.equal(await page.locator('#player .gdscript code').first().textContent(), rawCode);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    console.log('PASS small writing steps, full code coverage, optional complete-script hints, saved progress, walkthrough, localization, and mobile layout');
  } finally { await browser.close(); }
} finally { if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; } }

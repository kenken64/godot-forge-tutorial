import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from 'playwright-core';

const storage = await mkdtemp(join(tmpdir(), 'godot-forge-multiplayer-test-'));
const server = spawn(process.execPath, ['server.js'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: '0', APP_STORAGE_DIR: storage, OPENAI_API_KEY: '' }, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
let browser;
const errors = [];

async function waitForCode(page, slot) {
  try {
    await page.waitForFunction(slot => /^[A-F0-9]{6}$/.test(document.querySelector(`#seat-${slot} .room-code`)?.textContent || ''), slot, { timeout: 8000 });
  } catch (error) {
    const diagnostic = await page.locator(`#seat-${slot}`).evaluate(element => ({ code: element.querySelector('.room-code')?.textContent, status: element.querySelector('.phase-label')?.textContent, connection: element.querySelector('.seat-connection')?.textContent }));
    throw new Error(`Room code did not arrive: ${JSON.stringify({ diagnostic, errors })}`, { cause: error });
  }
  return page.locator(`#seat-${slot} .room-code`).textContent();
}

async function hostAndJoin(page, hostSlot, guestSlot) {
  await page.locator(`#seat-${hostSlot} .host-button`).click();
  const code = await waitForCode(page, hostSlot);
  assert.equal(await page.locator(`#seat-${guestSlot} .code-input`).inputValue(), code);
  await page.locator(`#seat-${guestSlot} .join-button`).click();
  await page.waitForFunction(code => [...document.querySelectorAll('.room-code')].every(element => element.textContent === code), code);
  for (const slot of [1, 2]) {
    assert.match(await page.locator(`#seat-${slot} .member--one`).textContent(), /P1 · Player 1/);
    assert.match(await page.locator(`#seat-${slot} .member--two`).textContent(), /P2 · Player 2/);
  }
  return code;
}

try {
  const baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Multiplayer test server timed out: ${output}`)), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Multiplayer test server exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => { output += chunk; const match = output.match(/http:\/\/localhost:(\d+)/); if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); } });
    server.stderr.on('data', chunk => { output += chunk; });
  });
  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${baseUrl}/multiplayer-game/`);
  assert.equal(await page.locator('.seat-card').count(), 2);
  assert.equal(await page.locator('.game-canvas').count(), 2);
  assert.equal(await page.locator('#complete-module').isDisabled(), true);

  // Player 2 hosts; Player 1 joins on the same page.
  await hostAndJoin(page, 2, 1);
  await page.locator('#seat-2 .chat-input').fill('Ready for a forest run?');
  await page.locator('#seat-2 .chat-form button').click();
  await page.waitForFunction(() => [...document.querySelectorAll('.chat-messages')].every(element => element.textContent.includes('Ready for a forest run?')));
  await page.locator('#seat-2 .ready-button').click();
  await page.waitForFunction(() => [...document.querySelectorAll('.member--two')].every(element => element.dataset.ready === 'true'));
  assert.equal(await page.locator('#seat-1 .game-overlay').isVisible(), true);
  await page.locator('#seat-1 .ready-button').click();
  await page.locator('#seat-1 .game-overlay').waitFor({ state: 'hidden' });
  await page.locator('#seat-2 .game-overlay').waitFor({ state: 'hidden' });
  await page.locator('#seat-1 .game-canvas').click();
  await page.keyboard.down('d');
  await page.waitForFunction(() => /P1 [1-9]/.test(document.querySelector('#seat-1 .score-label')?.textContent || ''));
  await page.keyboard.up('d');
  await page.waitForFunction(() => document.querySelector('#seat-1 .score-label')?.textContent === document.querySelector('#seat-2 .score-label')?.textContent);
  await page.keyboard.down('ArrowLeft');
  await page.waitForFunction(() => /P2 [1-9]/.test(document.querySelector('#seat-2 .score-label')?.textContent || ''));
  await page.keyboard.up('ArrowLeft');
  assert.equal(await page.locator('#seat-1 .score-label').textContent(), await page.locator('#seat-2 .score-label').textContent());
  await page.locator('#seat-1 .leave-button').click();
  await page.waitForFunction(() => document.querySelector('#seat-1 .room-code')?.textContent === '—' && document.querySelector('#seat-2 .member--one')?.textContent.includes('WAITING'));
  assert.equal(await page.locator('#seat-2 .game-overlay').isVisible(), true);
  await page.locator('#seat-2 .leave-button').click();
  await page.waitForFunction(() => document.querySelector('#seat-2 .room-code')?.textContent === '—');

  // Reverse the roles, then verify a player in a separate browser can join.
  await hostAndJoin(page, 1, 2);
  await page.locator('#seat-2 .leave-button').click();
  await page.waitForFunction(() => document.querySelector('#seat-2 .room-code')?.textContent === '—');
  const code = await page.locator('#seat-1 .room-code').textContent();
  const remote = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  remote.on('pageerror', error => errors.push(error.message));
  await remote.goto(`${baseUrl}/multiplayer-game/`);
  await remote.locator('#seat-2 .code-input').fill(code);
  await remote.locator('#seat-2 .join-button').click();
  await waitForCode(remote, 2);
  await page.waitForFunction(() => document.querySelector('#seat-1 .member--two')?.textContent.includes('Player 2'));
  await remote.locator('#seat-2 .chat-input').fill('Joining from another browser');
  await remote.locator('#seat-2 .chat-form button').click();
  await page.locator('#seat-1 .chat-messages').getByText('Joining from another browser').waitFor();
  await page.locator('#seat-1 .ready-button').click();
  assert.equal(await remote.locator('#seat-2 .game-overlay').isVisible(), true);
  await remote.locator('#seat-2 .ready-button').click();
  await remote.locator('#seat-2 .game-overlay').waitFor({ state: 'hidden' });
  await page.locator('#seat-1 .game-overlay').waitFor({ state: 'hidden' });

  await page.locator('[data-locale="zh"]').click();
  assert.match(await page.locator('#page-title').textContent(), /房间/);
  await page.locator('[data-locale="ms"]').click();
  assert.match(await page.locator('#page-title').textContent(), /bilik/i);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  console.log('PASS reciprocal host/join, same-page and remote play, chat, readiness, synchronized scores, leave, localization, and mobile layout');
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) { const exited = once(server, 'exit'); server.kill('SIGTERM'); await exited; }
}

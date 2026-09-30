// Manual test of an already provisioned student's live editor.
import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
const learnerId = process.env.TEST_LEARNER_ID || 'lightsail-test-student-0001';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(value => localStorage.setItem('godot-forge-learner-id', value), learnerId);
  await page.route('https://docs.godotengine.org/**', route => route.abort());
  await page.goto(`${origin}/setup-godot-with-ai/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !document.querySelector('#start-cloud').disabled);
  await page.locator('#start-cloud').click();
  await page.locator('#cloud-frame').waitFor({ state: 'visible', timeout: 180_000 });
  const editorUrl = await page.locator('#cloud-frame').getAttribute('src');
  await page.waitForTimeout(5000);
  await page.locator('#cloud-frame').screenshot({ path: '/tmp/godot-editor-test.png' });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ editorUrl, embeddedEditorVisible: true, screenshot: '/tmp/godot-editor-test.png' }));
} finally { await browser.close(); }

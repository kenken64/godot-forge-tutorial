import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem('pixel-forge-learner-id', 'retained-learner-123');
    localStorage.setItem('pixel-forge-locale', 'en');
  });
  await page.goto(base);
  await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 16);
  assert.match(await page.title(), /Godot Forge/);
  assert.doesNotMatch(await page.locator('body').innerText(), /pixel\s*forge/i);
  assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-learner-id')), 'retained-learner-123');
  for (const card of await page.locator('.module-card').all()) {
    await card.scrollIntoViewIfNeeded();
    await card.locator('.module-icon img').evaluate(img => img.decode());
    assert.equal(await card.locator('.module-icon.has-artwork').count(), 1);
  }
  for (const locale of ['zh', 'ms', 'en']) {
    await page.click(`[data-locale="${locale}"]`);
    assert.match(await page.title(), /Godot Forge/);
    assert.doesNotMatch(await page.locator('body').innerText(), /pixel\s*forge/i);
  }
  await page.locator('.module-card').first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: '/tmp/godot-forge-landing-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => document.querySelector('.sidebar').getBoundingClientRect().right <= 0);
  await page.locator('.module-card').first().scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no mobile horizontal overflow');
  await page.screenshot({ path: '/tmp/godot-forge-landing-mobile.png' });
  assert.deepEqual(errors, []);
  console.log('PASS: 16 generated icons load, Godot Forge in three locales, legacy learner retained, mobile layout fits.');
} finally { await browser.close(); }

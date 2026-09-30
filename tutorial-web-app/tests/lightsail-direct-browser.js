import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text().slice(0,500)); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${new URL(response.url()).pathname}`); });
  await page.goto('https://godot-7551e129fef382e065269fb1.kere.ceo/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(10000);
  await page.screenshot({ path: '/tmp/godot-direct-test.png' });
  console.log(JSON.stringify({ url: page.url(), title: await page.title(), text: (await page.locator('body').innerText()).slice(0, 1500), canvasCount: (await Promise.all(page.frames().map(frame => frame.locator('canvas').count()))).reduce((sum, value) => sum + value, 0), errors }));
} finally { await browser.close(); }

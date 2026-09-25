import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';
const dialogs = [], errors = [];
page.on('dialog', dialog => { dialogs.push(dialog.message()); dialog.dismiss(); });
page.on('pageerror', error => errors.push(error.message));

try {
  let progressCalls = 0;
  await page.route('**/api/modules/character-creation/progress', route => {
    progressCalls++;
    return route.fulfill(progressCalls === 1
      ? { status: 200, json: { completed: true } }
      : { status: 503, json: { error: 'Progress could not be saved.' } });
  });
  await page.goto(baseUrl);
  await page.waitForFunction(() => document.querySelector('#module-character-creation .complete-button'));
  await page.click('#theme-toggle');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent.startsWith('Display theme changed to ')));
  await page.click('#module-character-creation .complete-button');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === 'Module progress saved.'));
  await page.click('#module-character-creation .complete-button');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast--error')].some(el => el.textContent.includes('could not be saved')));
  assert.equal(progressCalls, 2);

  await page.goto(`${baseUrl}/game-assets-creation/`);
  const choice = page.locator('#choice-list .choice-button').first();
  const choiceLabel = (await choice.textContent()).trim();
  await choice.click();
  await page.waitForFunction(label => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === `${label} selected.`), choiceLabel);
  await page.selectOption('#asset-template', 'forest');
  await page.click('#load-template');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === 'Asset template ready.'));
  await page.click('#build-direction');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === 'Using saved asset direction.'));
  assert.equal(await page.locator('.action-toast').allTextContents().then(messages => messages.includes('Building your direction…')), false);
  await page.goto(`${baseUrl}/boss-creation/`);
  await page.selectOption('#boss-template', 'storm');
  await page.click('#load-template');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === 'Boss template ready.'));
  await page.click('#build-direction');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === 'Using saved boss direction.'));
  assert.equal(await page.locator('.action-toast').allTextContents().then(messages => messages.includes('Building your direction…')), false);
  await page.goto(`${baseUrl}/character-creation/`);
  await page.selectOption('#character-template', 'stormWarden');
  await page.click('#preview-template');
  await page.waitForFunction(() => document.querySelector('#sprite-status').textContent === 'READY');
  await page.click('#build-character');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === 'Using saved character sprite sheet.'));
  for (const [module, expected, direction] of [
    ['game-assets-creation', 'Building asset direction…', { packName: 'Fresh Forest', theme: 'Forest', style: 'Pixel art', palette: [], scale: '32 px', gameplay: 'Explore', signature: 'Glowing plants', artDirection: 'Readable side-view art.' }],
    ['boss-creation', 'Forging boss direction…', { name: 'Forest Guardian', archetype: 'Guardian', arena: 'Grove', weapon: 'Roots', silhouette: 'Tall antlers', phases: 'Roots spread', palette: [], artDirection: 'A tall forest guardian.' }],
  ]) {
    const fresh = await browser.newPage();
    await fresh.route('**/api/chat', route => route.fulfill({ json: { message: { content: JSON.stringify(direction) } } }));
    await fresh.goto(`${baseUrl}/${module}/`);
    for (let step = 0; step < 6; step++) await fresh.locator('#choice-list .choice-button').first().click();
    await fresh.click('#build-direction');
    await fresh.waitForFunction(message => [...document.querySelectorAll('.action-toast')].some(el => el.textContent === message), expected);
    await fresh.close();
  }
  await page.goto(baseUrl);
  await page.click('[data-locale="zh"]');
  await page.waitForFunction(() => [...document.querySelectorAll('.action-toast')].some(el => el.textContent.includes('Language changed')));
  assert.deepEqual(dialogs, []);
  assert.deepEqual(errors, []);
  console.log('PASS action toasts for buttons, save success and failure, no JavaScript dialogs.');
} finally {
  await browser.close();
}

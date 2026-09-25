import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import sharp from 'sharp';
import { packedBossLayout } from '../../boss-creation/animation-pipeline.mjs';

const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));

try {
  const cells = [];
  for (let row = 0; row < 7; row++) for (let col = 0; col < 8; col++) {
    cells.push(`<rect x="${col * 256 + 40 + col * 6}" y="${row * 256 + 24}" width="120" height="200" fill="rgb(${30 + row * 30},${60 + col * 40},100)"/>`);
  }
  const sprite = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="1792">${cells.join('')}</svg>`)).png().toBuffer();
  const repaired = { originalName: 'boss-sprite-sheet-v3.png', assetUrl: '/api/assets/test-boss.png', spriteSheetVersion: 3 };
  let checkpoint = null, repairs = 0, generations = 0;
  await page.route('**/api/modules/boss-creation/checkpoint*', route => {
    if (route.request().method() === 'PUT') checkpoint = route.request().postDataJSON().state;
    return route.fulfill({ json: { state: checkpoint } });
  });
  await page.route('**/api/assets/test-boss.png', route => route.fulfill({ contentType: 'image/png', body: sprite }));
  await page.route('**/api/bosses/layout?*', route => route.fulfill({ json: { ...packedBossLayout(), ...(repairs ? { asset: repaired, spriteSheetVersion: 3 } : {}) } }));
  await page.route('**/api/bosses/repair', route => { repairs++; return route.fulfill({ json: repaired }); });
  await page.route("**/api/chat", async route => {
    const prompt = route.request().postDataJSON().messages[0].content;
    assert.match(prompt, /badass/);
    await route.fulfill({ json: { message: { content: JSON.stringify({
      name: "The Storm King", archetype: "Fallen monarch", arena: "A lightning-split throne room",
      weapon: "A thunder bell", silhouette: "A broken crown and enormous cloak",
      phases: "Armour shatters and lightning escapes", palette: ["#101a34", "#d5a63e", "#6bc9ff", "#ece9d8"],
      artDirection: "A towering storm monarch with a regal stance, gold armour and contained lightning under fractured plates.",
    }) } } });
  });
  let generationRequest;
  await page.route("**/api/bosses/generate", async route => {
    generations++;
    generationRequest = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: { originalName: "storm-king-boss-sprite-sheet.png", assetUrl: "/api/assets/test-boss.png", needsAnimationRepair: true } });
  });
  await page.route("**/api/assets/publish", async route => {
    assert.equal(route.request().postDataJSON().sourceModule, "boss-creation");
    await route.fulfill({ status: 201, json: { moduleSlug: "final-game", assetUrl: "/api/assets/saved-boss-sheet.png", metadataAsset: { assetUrl: '/api/assets/saved-boss-sheet.json', originalName: 'saved-boss-sheet.json' } } });
  });
  await page.goto(`${baseUrl}/boss-creation/`);
  await page.selectOption("#boss-template", "storm");
  await page.click("#load-template");
  assert.equal(await page.locator("#build-direction").isEnabled(), true);
  assert.equal(await page.locator("#direction-status").textContent(), "READY");
  assert.equal(await page.locator("#production-workspace").isHidden(), false);
  await page.click("#build-direction");
  await page.waitForFunction(() => document.querySelector("#direction-status").textContent === "READY");
  assert.match(await page.locator("#generated-prompt").textContent(), /undeniably badass/);
  assert.match(await page.locator("#generated-prompt").textContent(), /8 × 7/);
  assert.match(await page.locator("#generated-prompt").textContent(), /run, attack, hurt, death, enrage/);
  await page.click("#generate-boss");
  await page.waitForFunction(() => document.querySelector("#boss-animation-preview").hidden === false);
  await page.waitForFunction(() => document.querySelector('#generation-status').textContent.includes('All seven animations saved'));
  assert.equal(repairs, 1, 'new boss automatically receives animation passes');
  assert.equal(generationRequest.boss.name, "The Storm King");
  assert.match(generationRequest.boss.artDirection, /towering storm monarch/);
  assert.equal(await page.locator("#download-boss").isHidden(), false);
  assert.equal(await page.locator("#boss-animation-select option").count(), 7);
  await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '0');
  const snapshot = () => page.locator('#boss-animation-preview').evaluate(canvas => canvas.toDataURL());
  const idleImage = await snapshot();
  await page.waitForTimeout(650);
  assert.equal(await snapshot(), idleImage, 'Idle must remain pixel-identical without lateral shake');
  await page.selectOption('#boss-animation-select', 'walk');
  await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '7');
  await page.click('#play-boss-animation');
  const pausedImage = await snapshot();
  await page.waitForTimeout(450);
  assert.equal(await snapshot(), pausedImage, 'Pause holds the current frame');
  await page.selectOption('#boss-animation-select', 'death');
  await page.click('#play-boss-animation');
  await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '3');
  const deathImage = await snapshot();
  await page.waitForTimeout(650);
  assert.equal(await snapshot(), deathImage, 'Death holds its final pose');
  for (const action of ['attack', 'enrage']) {
    await page.selectOption('#boss-animation-select', action);
    await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '0');
    const first = await snapshot();
    await page.waitForFunction(() => document.querySelector('#boss-animation-preview').dataset.frame === '3');
    assert.notEqual(await snapshot(), first, `${action} has changing frames`);
  }
  assert.equal(await page.locator("#save-boss-to-final-game").isHidden(), false);
  await page.click("#save-boss-to-final-game");
  await page.waitForFunction(() => document.querySelector("#generation-status").textContent.includes("coordinates JSON"));
  assert.equal(await page.locator('a[download="saved-boss-sheet.json"]').isVisible(), true);
  await page.reload();
  await page.waitForFunction(() => !document.querySelector('#boss-animation-preview').hidden);
  assert.equal(repairs, 1, 'resume does not regenerate artwork');
  assert.equal(generations, 1);
  assert.equal(await page.locator('#boss-animation-select option:disabled').count(), 0);
  assert.equal(await page.locator('a[download="saved-boss-sheet.json"]').isVisible(), true);
  await page.selectOption('#boss-template', 'void');
  await page.click('#load-template');
  assert.equal(await page.locator('#boss-animation-preview').isHidden(), true, 'a different template must clear the prior boss');
  assert.equal(await page.locator('#generate-boss').textContent(), 'GENERATE BOSS SPRITE SHEET');
  assert.equal(generations, 1);
  assert.deepEqual(errors, []);
  console.log("PASS boss guide, badass art direction, and concept generation flow");
} finally {
  await browser.close();
}

import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));

try {
  let directionCalls = 0;
  await page.route("**/api/chat", async route => {
    directionCalls++;
    assert.match(route.request().postDataJSON().messages[0].content, /asset-pack direction/);
    await route.fulfill({ json: { message: { content: JSON.stringify({
      packName: "Grove Light", theme: "Forest adventure", style: "Clean pixel art",
      palette: ["#244d32", "#a7d95b", "#e5b96d", "#f5f0cf"], scale: "32 px classic",
      gameplay: "Explore", signature: "Glowing plants", artDirection: "Clear woodland pixel art with mossy edges and warm light.",
    }) } } });
  });
  let generationRequest, generationCalls = 0;
  await page.route("**/api/assets/generate", async route => {
    generationCalls++;
    generationRequest = route.request().postDataJSON();
    await route.fulfill({ status: 201, json: {
      originalName: "grove-light-props-sheet.png", category: generationRequest.category,
      assetUrl: "/character-creation/data/storm-warden-reference.png",
    } });
  });
  await page.route('**/api/assets/publish', route => {
    assert.equal(route.request().postDataJSON().category, 'props');
    return route.fulfill({ status: 201, json: { assetUrl: '/api/assets/grove-props.png', metadataAsset: { assetUrl: '/api/assets/grove-props.json', originalName: 'grove-props.json' } } });
  });
  await page.goto(`${baseUrl}/game-assets-creation/`);
  await page.selectOption("#asset-template", "forest");
  await page.click("#load-template");
  assert.equal(await page.locator("#build-direction").isEnabled(), true);
  assert.equal(await page.locator("#direction-status").textContent(), "READY");
  assert.equal(await page.locator("#production-workspace").isHidden(), false);
  await page.click("#build-direction");
  await page.waitForFunction(() => document.querySelector("#direction-status").textContent === "READY");
  assert.equal(await page.locator("#production-workspace").isHidden(), false);
  assert.match(await page.locator("#generated-prompt").textContent(), /Grove Light/);
  const directionCard = await page.locator(".asset-direction-card").boundingBox();
  const directionButton = await page.locator("#build-direction").boundingBox();
  assert.ok(directionButton.x > directionCard.x && directionButton.x + directionButton.width < directionCard.x + directionCard.width, "direction action must remain inside its card");
  await page.click('[data-category="props"]');
  await page.click("#generate-asset");
  await page.waitForFunction(() => document.querySelector("#asset-preview").hidden === false);
  assert.equal(generationRequest.category, "props");
  assert.equal(generationRequest.brief.packName, "Grove Light");
  assert.equal(generationRequest.brief.style, "Clean pixel art");
  assert.equal(await page.locator("#download-asset").isHidden(), false);
  await page.click('#save-to-final-game');
  await page.waitForFunction(() => document.querySelector('#generation-status').textContent.includes('coordinates JSON'));
  assert.equal(await page.locator('a[download="grove-props.json"]').isVisible(), true);
  await page.reload();
  await page.waitForFunction(() => document.querySelector("#direction-status").textContent === "RESUMED");
  await page.click("#build-direction");
  await page.click("#generate-asset");
  assert.equal(directionCalls, 0, "starter templates should be usable without a Codex request");
  assert.equal(generationCalls, 1, "a resumed asset sheet must not call image generation again");
  assert.equal(await page.locator('a[download="grove-props.json"]').isVisible(), true);
  await page.selectOption('#asset-template', 'station');
  await page.click('#load-template');
  assert.equal(await page.locator('#asset-preview').isHidden(), true, 'a different template must clear the prior sheet');
  assert.equal(await page.locator('#generate-asset').textContent(), 'GENERATE ASSET SHEET');
  assert.deepEqual(errors, []);
  console.log("PASS asset-pack guide, direction, category generation, and saved-preview flow");
} finally {
  await browser.close();
}

import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const baseUrl = process.env.GODOT_FORGE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const modules = await (await page.request.get(`${baseUrl}/api/modules`)).json();
  assert.equal(modules.length, 21);

  await page.goto(baseUrl);
  const landingToggle = page.locator("#theme-toggle");
  await landingToggle.waitFor();
  await landingToggle.click();
  assert.equal(await page.locator("body").getAttribute("data-theme"), "light");
  assert.equal(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue("--paper").trim()), "#f4f3ed");
  await page.reload();
  assert.equal(await page.locator("body").getAttribute("data-theme"), "light");

  const checkedModules = [];
  for (const module of modules.filter(item => item.slug !== "final-game")) {
    await page.goto(`${baseUrl}/${module.slug}/`);
    const themeToggle = page.locator("#theme-toggle");
    await themeToggle.waitFor({ timeout: 5000 });
    assert.equal(await page.locator("body").getAttribute("data-theme"), "light", `${module.slug} should inherit the saved theme`);
    await themeToggle.click();
    assert.equal(await page.locator("body").getAttribute("data-theme"), "dark", `${module.slug} toggle should switch to dark`);
    assert.equal(await page.evaluate(() => localStorage.getItem("godot-forge-theme")), "dark");
    await themeToggle.click();
    assert.equal(await page.locator("body").getAttribute("data-theme"), "light");
    await page.reload();
    assert.equal(await page.locator("body").getAttribute("data-theme"), "light", `${module.slug} should preserve the selection on reload`);
    checkedModules.push(module.slug);
  }

  await page.goto(`${baseUrl}/marketplace-system/`);
  await page.locator('[data-locale="zh"]').click();
  await page.waitForTimeout(30);
  assert.equal(await page.locator("#theme-toggle").getAttribute("aria-label"), "切换到深色模式");
  await page.locator('[data-locale="ms"]').click();
  await page.waitForTimeout(30);
  assert.equal(await page.locator("#theme-toggle").getAttribute("aria-label"), "Tukar kepada mod gelap");

  console.log(`PASS shared dark/light preference and toggle across ${checkedModules.length} module pages, persisted on reload, with Chinese and Malay labels`);
} finally {
  await browser.close();
}

import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright-core";

const storage = await mkdtemp(join(tmpdir(), "godot-forge-physics-test-"));
const server = spawn(process.execPath, ["server.js"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, PORT: "0", APP_STORAGE_DIR: storage, OPENAI_API_KEY: "" },
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
let browser;

try {
  const baseUrl = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`Physics test server timed out: ${output}`)), 10000);
    server.on("error", error => { clearTimeout(timeout); reject(error); });
    server.on("exit", code => { clearTimeout(timeout); reject(new Error(`Physics test server exited ${code}: ${output}`)); });
    server.stdout.on("data", chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`${baseUrl}/game-physics/`);
  await page.waitForFunction(() => document.querySelector("#splash-prompt")?.textContent.includes("Use case:") && document.querySelector("#swimmer-prompt")?.textContent.includes("Use case:"));
  assert.equal((await page.request.get(`${baseUrl}/game-physics/images/forest-pool.webp`)).status(), 200);
  assert.equal((await page.request.get(`${baseUrl}/game-physics/images/boulder.webp`)).status(), 200);
  assert.equal((await page.request.get(`${baseUrl}/game-physics/images/water-splash.webp`)).status(), 200);
  assert.equal((await page.request.get(`${baseUrl}/game-physics/images/swimmer.webp`)).status(), 200);
  assert.match(await page.locator("#splash-prompt").textContent(), /genuinely transparent alpha background/);
  assert.match(await page.locator("#swimmer-prompt").textContent(), /same young woodland explorer/);
  assert.equal(await page.locator("#complete-module").isDisabled(), true);
  assert.equal(await page.locator("#time-value").textContent(), "1.11 s");
  assert.equal(await page.locator("#energy-value").textContent(), "3,528 J");
  const stage = page.locator("#physics-stage");
  await page.waitForFunction(() => Number(document.querySelector("#physics-stage")?.dataset.swimmerX) > 0);
  assert.ok(Number(await stage.getAttribute("data-swimmer-x")) < 480, "swimmer starts left of the boulder");
  await stage.click();
  await page.keyboard.down("ArrowRight");
  await page.waitForFunction(() => Number(document.querySelector("#physics-stage").dataset.swimmerX) > 650);
  await page.keyboard.up("ArrowRight");
  assert.equal(await stage.getAttribute("data-swimmer-facing"), "right");
  await page.keyboard.down("ArrowDown");
  await page.waitForFunction(() => Number(document.querySelector("#physics-stage").dataset.swimmerDepth) > 90);
  await page.keyboard.up("ArrowDown");
  assert.notEqual(await page.locator("#swimmer-depth").textContent(), "0.0 m");
  await page.keyboard.down("ArrowLeft");
  await page.waitForFunction(() => Number(document.querySelector("#physics-stage").dataset.swimmerX) < 300);
  await page.keyboard.up("ArrowLeft");
  assert.equal(await stage.getAttribute("data-swimmer-facing"), "left");
  await page.keyboard.down("ArrowUp");
  await page.waitForFunction(() => document.querySelector("#physics-stage").dataset.swimmerDepth === "0.0");
  await page.keyboard.up("ArrowUp");
  assert.equal(await page.locator("#swimmer-depth").textContent(), "0.0 m");

  await page.locator("#mass-input").evaluate(node => { node.value = "120"; node.dispatchEvent(new Event("input", { bubbles: true })); });
  assert.equal(await page.locator("#time-value").textContent(), "1.11 s");
  assert.equal(await page.locator("#energy-value").textContent(), "7,056 J");
  await page.click("#slow-button");
  assert.equal(await page.locator("#slow-button").getAttribute("aria-pressed"), "true");
  await page.click("#slow-button");
  await page.click("#drop-button");
  await page.waitForFunction(() => document.querySelector("#stage-status")?.textContent.startsWith("Splash!"));
  assert.equal(await page.locator("#speed-value").textContent(), "10.8 m/s");
  assert.equal(await page.locator("#complete-module").isEnabled(), true);

  await page.waitForFunction(() => !document.querySelector("#drop-button").disabled);
  await page.locator("#mass-input").evaluate(node => { node.value = "20"; node.dispatchEvent(new Event("input", { bubbles: true })); });
  assert.equal(await page.locator("#time-value").textContent(), "1.11 s");
  assert.equal(await page.locator("#energy-value").textContent(), "1,176 J");
  await page.click("#drop-button");
  await page.waitForFunction(() => document.querySelector("#stage-status")?.textContent.startsWith("Splash!"));
  assert.equal(await page.locator("#speed-value").textContent(), "10.8 m/s");

  const learnerId = await page.evaluate(() => localStorage.getItem("godot-forge-learner-id"));
  await page.click("#complete-module");
  await page.waitForFunction(async id => {
    const modules = await (await fetch(`/api/modules?learnerId=${encodeURIComponent(id)}`)).json();
    return modules.find(module => module.slug === "game-physics")?.completed === true;
  }, learnerId);
  await page.reload();
  await page.waitForFunction(() => document.querySelector("#complete-module")?.textContent === "MODULE COMPLETED");
  await page.click('[data-locale="zh"]');
  assert.equal(await page.locator("html").getAttribute("lang"), "zh-CN");
  assert.match(await page.locator("#page-title").textContent(), /巨石/);
  await page.click('[data-locale="ms"]');
  assert.equal(await page.locator("html").getAttribute("lang"), "ms");
  assert.match(await page.locator("#page-title").textContent(), /batu/i);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  console.log("PASS full-width arrow-key swimming, diving, boulder physics, generated art, completion, localization, and mobile layout");
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) { const exited = once(server, "exit"); server.kill("SIGTERM"); await exited; }
}

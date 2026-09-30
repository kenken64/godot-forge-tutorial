import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright-core";
import sharp from 'sharp';
import { animationRows } from '../../character-creation/locomotion.mjs';
import { quizQuestionBank } from '../quiz-question-bank.mjs';

const newSlugs = ["game-loop-engine", "game-controls", "game-settings", "game-physics", "game-ending-cutscene", "credits", "marketplace-system", "game-achievement", "game-leaderboard", "local-coop", "multiplayer-game", "setup-godot-with-ai", "enemies-ai"];
const moduleSequence = ["character-creation", "game-assets-creation", "boss-creation", "storyline-engine", "parallax-tiling-map", "items-spawning", "enemies-ai", "game-loop-engine", "game-controls", "game-settings", "game-physics", "game-ending-cutscene", "credits", "marketplace-system", "game-achievement", "game-leaderboard", "local-coop", "multiplayer-game", "math-stem-physics-quiz", "setup-godot-with-ai", "final-game"];
async function startServer(storage) {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, PORT: "0", APP_STORAGE_DIR: storage, OPENAI_API_KEY: "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "", errors = "";
  child.stderr.on("data", chunk => { errors += chunk; });
  const url = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { child.kill(); reject(new Error(`Server startup timed out: ${errors}`)); }, 10000);
    child.on("error", error => { clearTimeout(timeout); reject(error); });
    child.on("exit", code => { clearTimeout(timeout); reject(new Error(`Server exited ${code}: ${errors}`)); });
    child.stdout.on("data", chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timeout); resolve(`http://127.0.0.1:${match[1]}`); }
    });
  });
  return { url, stop: async () => { const exited = once(child, "exit"); child.kill("SIGTERM"); await exited; } };
}

test("21 modules: localized navigation, overview pages, search and persistent progress", { timeout: 60000 }, async () => {
  const storage = await mkdtemp(join(tmpdir(), "godot-forge-modules-test-"));
  let server = await startServer(storage);
  let browser;
  try {
    const modules = await (await fetch(`${server.url}/api/modules`)).json();
    assert.equal(modules.length, 21);
    const quizQuestions = await (await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz`)).json();
    assert.equal(quizQuestions.length, 40);
    assert.deepEqual([...new Set(quizQuestions.map(question => question.category))], ['Math & Vectors', 'Physics & Motion', 'Game Systems', 'Game History']);
    const chineseQuestions = await (await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz?locale=zh`)).json();
    const malayQuestions = await (await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz?locale=ms`)).json();
    assert.equal(chineseQuestions.length, 40);
    assert.equal(malayQuestions.length, 40);
    assert.match(chineseQuestions[0].question, /角色/);
    assert.match(malayQuestions[0].question, /Watak/);
    assert.equal('correctOption' in chineseQuestions[0], false);
    const quizLearnerId = 'quiz-grading-learner-0001';
    const quizProgress = completed => fetch(`${server.url}/api/modules/math-stem-physics-quiz/progress`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId: quizLearnerId, completed }),
    });
    assert.equal((await quizProgress(true)).status, 403);
    assert.equal((await fetch(`${server.url}/api/modules/math-stem-physics-quiz/progress`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ completed: true }),
    })).status, 400);
    await fetch(`${server.url}/api/modules/math-stem-physics-quiz/checkpoint`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId: quizLearnerId, state: { answers: Object.fromEntries(quizQuestionBank.map(question => [question.id, { correct: true, option: question.correctOption }])) } }),
    });
    assert.equal((await quizProgress(true)).status, 403);
    const chineseAnswer = await (await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz/answer`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId: quizLearnerId, questionId: quizQuestions[0].id, option: quizQuestionBank[0].correctOption, locale: 'zh' }),
    })).json();
    assert.match(chineseAnswer.explanation, /距离/);
    const malayReview = await (await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz/review`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId: quizLearnerId, locale: 'ms' }),
    })).json();
    assert.match(malayReview.answers[0].explanation, /Jarak/);
    const answerQuiz = async correctCount => {
      for (const [index, question] of quizQuestionBank.entries()) {
        if (index === 0 && correctCount === 29) continue;
        const option = index < correctCount ? question.correctOption : (question.correctOption + 1) % question.options.length;
        const response = await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz/answer`, {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ learnerId: quizLearnerId, questionId: question.id, option }),
        });
        assert.equal(response.status, 200);
      }
    };
    await answerQuiz(29);
    const failedPass = await quizProgress(true);
    assert.equal(failedPass.status, 403);
    assert.equal((await failedPass.json()).score, 29);
    assert.equal((await (await fetch(`${server.url}/api/modules?learnerId=${quizLearnerId}`)).json()).find(module => module.slug === 'math-stem-physics-quiz').completed, false);
    assert.equal((await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz/retry`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId: quizLearnerId }),
    })).status, 200);
    await answerQuiz(30);
    assert.equal((await quizProgress(true)).status, 200);
    assert.equal((await (await fetch(`${server.url}/api/modules?learnerId=${quizLearnerId}`)).json()).find(module => module.slug === 'math-stem-physics-quiz').completed, true);
    assert.equal((await fetch(`${server.url}/api/quizzes/math-stem-physics-quiz/retry`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId: quizLearnerId }),
    })).status, 200);
    assert.equal((await (await fetch(`${server.url}/api/modules?learnerId=${quizLearnerId}`)).json()).find(module => module.slug === 'math-stem-physics-quiz').completed, false);
    assert.deepEqual(modules.map(module => module.level), Array.from({ length: 21 }, (_, i) => i + 1));
    assert.deepEqual(modules.map(module => module.slug), moduleSequence);
    assert.equal(modules[9].title, "Game HUD and Settings");
    assert.match(modules[9].description, /HUD/);
    assert.equal(modules.at(-2).title, "Learn Godot Web Editor");
    assert.equal(modules.at(-1).title, "Final Game");
    const learnerId = "checkpoint-learner-0001";
    const checkpointSave = await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint`, {
      method: "PUT", headers: { "content-type": "application/json" },
      body: JSON.stringify({ learnerId, state: { currentStep: 3, direction: { packName: "Saved Grove" } } }),
    });
    assert.equal(checkpointSave.status, 200);
    const checkpoint = await (await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint?learnerId=${learnerId}`)).json();
    assert.equal(checkpoint.state.direction.packName, "Saved Grove");
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.route('https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/**', async route => {
      const relativePath = new URL(route.request().url()).pathname.replace(/^\/2d-game-development\//, '');
      const body = await readFile(new URL(`../../${relativePath}`, import.meta.url));
      const contentType = relativePath.endsWith('.webp') ? 'image/webp' : 'image/png';
      await route.fulfill({ status: 200, body, contentType, headers: { 'access-control-allow-origin': '*' } });
    });
    await page.addInitScript(id => localStorage.setItem('godot-forge-learner-id', id), learnerId);
    const errors = [];
    page.on("pageerror", error => errors.push({ url: page.url(), message: error.message, stack: error.stack?.split("\n").slice(0, 3).join("\n") }));
    const sourcePng = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLseAAAAABJRU5ErkJggg==", "base64");
    const characterPng = await sharp({ create: { width: 2048, height: 1792, channels: 4, background: '#00000000' } }).png().toBuffer();
    const uploaded = await fetch(`${server.url}/api/assets?module=character-creation`, {
      method: "POST",
      headers: { "content-type": "image/png", "x-file-name": "journey-hero.png" },
      body: characterPng,
    });
    assert.equal(uploaded.status, 201);
    const sourceAsset = await uploaded.json();
    const characterSave = await fetch(`${server.url}/api/characters`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        moduleSlug: "character-creation", locale: "en",
        profile: { name: "Journey Hero", role: "Ranger", focusAttribute: "Agility", weapon: "Bow", combatStyle: "Quick shots", weakness: "Low defense" },
        spriteSheet: { assetUrl: sourceAsset.assetUrl, frameWidth: 256, frameHeight: 256, columns: 8, rows: animationRows },
      }),
    });
    assert.equal(characterSave.status, 201);
    const savedCharacter = await characterSave.json();
    assert.equal(savedCharacter.finalGameAsset.moduleSlug, "final-game");
    assert.match(savedCharacter.finalGameAsset.relativePath, /^assets\/final-game\//);
    assert.equal((await fetch(`${server.url}${savedCharacter.finalGameAsset.assetUrl}`)).status, 200);
    const characterMetadata = savedCharacter.finalGameAsset.metadataAsset;
    assert.equal((await fetch(`${server.url}${characterMetadata.assetUrl}`)).headers.get('content-type'), 'application/json');
    const characterManifest = await (await fetch(`${server.url}${characterMetadata.assetUrl}`)).json();
    assert.equal(characterManifest.kind, 'character');
    assert.equal(characterManifest.image.assetUrl, savedCharacter.finalGameAsset.assetUrl);
    assert.deepEqual(characterManifest.animations.map(row => row.frames.length), [1, 8, 8, 4, 4, 4, 4]);
    assert.deepEqual(characterManifest.animations[2].frames[7], { x: 1792, y: 512, width: 256, height: 256 });
    const finalGameAssetResponse = await fetch(`${server.url}/api/assets?module=final-game`);
    const finalGameAssetPayload = await finalGameAssetResponse.json();
    assert.equal(finalGameAssetResponse.status, 200, JSON.stringify(finalGameAssetPayload));
    const finalGameAssets = finalGameAssetPayload;
    assert.equal(finalGameAssets.length, 2);
    assert.ok(finalGameAssets.some(asset => asset.storedName === savedCharacter.finalGameAsset.storedName));
    assert.ok(finalGameAssets.some(asset => asset.storedName === characterMetadata.storedName));
    const assetPackPng = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#00000000' } }).png().toBuffer();
    const assetPackUpload = await fetch(`${server.url}/api/assets?module=game-assets-creation`, {
      method: "POST",
      headers: { "content-type": "image/png", "x-file-name": "grove-platform-tiles.png" },
      body: assetPackPng,
    });
    assert.equal(assetPackUpload.status, 201);
    const assetPackSource = await assetPackUpload.json();
    const assetPackPublish = await fetch(`${server.url}/api/assets/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sourceModule: "game-assets-creation", assetUrl: assetPackSource.assetUrl, name: "grove-platform-tiles.png", category: "tileset" }),
    });
    assert.equal(assetPackPublish.status, 201);
    const publishedAssetPack = await assetPackPublish.json();
    assert.equal(publishedAssetPack.moduleSlug, "final-game");
    assert.match(publishedAssetPack.relativePath, /^assets\/final-game\//);
    assert.equal((await fetch(`${server.url}${publishedAssetPack.assetUrl}`)).status, 200);
    const packManifest = await (await fetch(`${server.url}${publishedAssetPack.metadataAsset.assetUrl}`)).json();
    assert.equal(packManifest.kind, 'asset-pack');
    assert.equal(packManifest.category, 'tileset');
    assert.equal(packManifest.cells.length, 16);
    assert.deepEqual(packManifest.cells[15], { index: 15, column: 3, row: 3, x: 768, y: 768, width: 256, height: 256 });
    const bossCells = Array.from({ length: 28 }, (_, index) => `<rect x="${index % 4 * 256 + 40}" y="${Math.floor(index / 4) * 256 + 20}" width="120" height="210" fill="red"/>`);
    const bossPng = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1792">${bossCells.join('')}</svg>`)).png().toBuffer();
    const bossUpload = await fetch(`${server.url}/api/assets?module=boss-creation`, {
      method: 'POST', headers: { 'content-type': 'image/png', 'x-file-name': 'test-boss-sprite-sheet.png' }, body: bossPng,
    });
    assert.equal(bossUpload.status, 201);
    const bossSource = await bossUpload.json();
    const bossPublish = await fetch(`${server.url}/api/assets/publish`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sourceModule: 'boss-creation', assetUrl: bossSource.assetUrl, name: 'test-boss-sprite-sheet.png' }),
    });
    assert.equal(bossPublish.status, 201);
    const bossSaved = await bossPublish.json();
    const bossManifest = await (await fetch(`${server.url}${bossSaved.metadataAsset.assetUrl}`)).json();
    assert.equal(bossManifest.kind, 'boss');
    assert.deepEqual(bossManifest.animations.map(row => row.frames.length), [1, 4, 4, 4, 4, 4, 4]);
    assert.deepEqual(bossManifest.unavailable, []);
    for (const locale of ["en", "zh", "ms"]) {
      await page.goto(server.url);
      await page.waitForFunction(() => document.querySelectorAll(".module-card").length === 21);
      await page.click(`#language-toggle [data-locale="${locale}"]`);
      assert.equal(await page.locator('#module-math-stem-physics-quiz .complete-button').count(), 0);
      assert.equal(await page.locator('#module-math-stem-physics-quiz .quiz-requirement').count(), 1);
      assert.equal(await page.locator("#module-nav .nav-item").count(), 21);
      assert.equal(await page.locator(".module-card .module-icon").count(), 21);
      for (const slug of newSlugs) {
        const module = modules.find(item => item.slug === slug);
        const translation = module.translations[locale];
        assert.ok(translation.title && translation.description);
        await page.fill("#module-search", translation.title);
        assert.equal(await page.locator(`#module-${slug} h3`).textContent(), translation.title);
        await page.click(`#module-nav a[href="/${slug}/"]`);
        if (slug === "setup-godot-with-ai") {
          await page.locator('.lesson-intro h1').waitFor();
          await page.waitForFunction(expected => document.documentElement.lang === expected, locale === 'zh' ? 'zh-CN' : locale);
          assert.match(await page.locator('.lesson-intro h1').textContent(), /Godot|编辑器/);
          assert.equal(await page.locator('html').getAttribute('lang'), locale === 'zh' ? 'zh-CN' : locale);
          await page.goto(server.url);
          await page.waitForFunction(() => document.querySelectorAll('.module-card').length === 21);
          continue;
        }
        if (["game-loop-engine", "game-controls", "game-settings", "game-physics", "game-ending-cutscene", "game-achievement", "game-leaderboard", "local-coop", "multiplayer-game", "enemies-ai", "credits"].includes(slug)) {
          await page.locator("#page-title").waitFor();
          await page.waitForFunction(expected => document.documentElement.lang === expected, locale === "zh" ? "zh-CN" : locale);
          if (slug === "game-loop-engine") {
            assert.equal(await page.locator("#coin-progress").textContent(), "0 / 20");
            assert.equal(await page.locator("#continue-button").count(), 1);
            assert.match(await page.locator("#game-prompt").textContent(), /20 coins|20 枚金币|20 syiling/);
          } else if (slug === "game-controls") {
            assert.equal(await page.locator("#gamepad-buy-link").getAttribute("href"), "https://www.amazon.com/dp/B081HML6MP?th=1");
            assert.equal(await page.locator("#gamepad-buy-link").getAttribute("target"), "_blank");
            assert.equal(await page.locator("#gamepad-buy-link").getAttribute("rel"), "noopener noreferrer");
            assert.match(await page.locator("#gamepad-recommendation-title").textContent(), { en: /Recommended mini gamepad/, zh: /推荐迷你游戏手柄/, ms: /Cadangan pad permainan mini/ }[locale]);
            assert.equal(await page.locator(".pad-control[data-index]").count(), 17);
            await page.locator("#playtest-stage canvas").waitFor();
            assert.match(await page.locator("#controls-prompt").textContent(), /move left, move right, jump, crouch\/roll, and attack|向左移动|gerak ke kiri/);
            assert.match(await page.locator("#game-prompt").textContent(), /four collectible crystals|四枚可收集水晶|empat kristal/);
            assert.equal(await page.locator("#complete-module").isDisabled(), true);
            await page.click('.pad-control[data-index="0"]');
            await page.click("#open-settings");
            assert.equal(await page.locator("#mapping-list .mapping-row").count(), 5);
            await page.locator("#mapping-attack").selectOption("3");
            await page.click("#done-settings");
            assert.equal(await page.locator("#complete-module").isDisabled(), false);
          } else if (slug === "game-settings") {
            assert.equal(await page.locator("#complete-module").count(), 1);
            await page.locator("#game-stage canvas").waitFor();
            await page.keyboard.press("Escape");
            await page.locator("#settings-overlay").waitFor({ state: "visible" });
            await page.click("#music-toggle");
            await page.click("#sound-toggle");
            await page.keyboard.press("Escape");
            await page.locator("#settings-overlay").waitFor({ state: "hidden" });
            assert.equal(await page.locator("#health-fill").count(), 1);
            assert.equal(await page.locator("#coin-count").textContent(), "0");
          } else if (slug === "game-physics") {
            assert.equal(await page.locator("#physics-stage").count(), 1);
            assert.equal(await page.locator("#complete-module").isDisabled(), true);
            assert.equal(await page.locator("#height-input").inputValue(), "6");
            assert.match(await page.locator("#experiment-title").textContent(), /Boulder|巨石|Batu/);
          } else if (slug === "game-achievement") {
            assert.equal(await page.locator("#achievement-stage").count(), 1);
            assert.equal(await page.locator("#complete-module").isDisabled(), true);
            await page.click("#tab-badges");
            assert.equal(await page.locator(".badge-card.is-locked").count(), 2);
            await page.click("#tab-play");
          } else if (slug === "game-leaderboard") {
            assert.equal(await page.locator("#leaderboard-stage").count(), 1);
            assert.equal(await page.locator("#score-count").textContent(), "0");
            assert.equal(await page.locator("#complete-module").isDisabled(), true);
            await page.click("#tab-board");
            assert.equal(await page.locator("#leaderboard-card.is-locked").count(), 1);
            await page.click("#tab-play");
          } else if (slug === "local-coop") {
            assert.equal(await page.locator('#coop-stage').count(), 1);
            assert.equal(await page.locator('#p1-coins').textContent(), '0');
            assert.equal(await page.locator('#p2-coins').textContent(), '0');
            assert.equal(await page.locator('#complete-module').isDisabled(), true);
          } else if (slug === "multiplayer-game") {
            assert.equal(await page.locator('.seat-card').count(), 2);
            assert.equal(await page.locator('.game-canvas').count(), 2);
            assert.equal(await page.locator('.host-button').count(), 2);
            assert.equal(await page.locator('.join-button').count(), 2);
            assert.equal(await page.locator('#complete-module').isDisabled(), true);
          } else if (slug === "game-ending-cutscene") {
            assert.equal(await page.locator("#scene-image").getAttribute("src"), "https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-ending-cutscene/images/final-boss-comic.webp");
            assert.equal(await page.locator(".asset-prompt").count(), 5);
            await page.click("#continue-to-ending");
            await page.locator("#advance-dialogue").click();
            await page.locator("#advance-dialogue").click();
            await page.locator("#advance-dialogue").click();
            assert.equal(await page.locator("#choice-panel").isVisible(), true);
            await page.click("#choose-awaken");
            await page.waitForFunction(() => document.querySelector("#scene-image").getAttribute("src").endsWith("ending-awaken.webp"));
            assert.equal(await page.locator("#complete-module").isDisabled(), false);
            assert.match(await page.locator("#asset-prompts").textContent(), /OpenAI GPT Image 2\.5 Burst/);
          } else if (slug === "credits") {
            assert.equal(await page.locator(".credit-entry").count(), 7);
            assert.match(await page.locator("#credits-prompt").textContent(), /fictional contributor names|虚构贡献者姓名|nama penyumbang rekaan/);
            assert.match(await page.locator("#image-prompt").textContent(), /OpenAI GPT Image 2\.5|OpenAI GPT Image 2\.5/);
            if (await page.locator("#complete-module").isEnabled()) {
              await page.click("#restart-roll");
              await page.waitForFunction(() => document.querySelector("#complete-module").disabled);
            }
            const initialScene = await page.locator("#game-screenshot").getAttribute("src");
            await page.click("#next-screenshot");
            await page.waitForFunction(previous => document.querySelector("#game-screenshot").getAttribute("src") !== previous, initialScene);
            assert.equal(await page.locator("#complete-module").isDisabled(), true);
            await page.click("#skip-roll");
            await page.waitForFunction(() => document.querySelector("#sequence-status").textContent !== "CREDITS ROLLING");
            await page.waitForFunction(() => !document.querySelector("#complete-module").disabled);
          } else {
            assert.equal(await page.locator("#complete-module").count(), 1);
            assert.equal(await page.locator("#boar-state").count(), 1);
            assert.equal(await page.locator("#thornling-state").count(), 1);
            assert.equal(await page.locator("#pickup-counter").count(), 0);
          }
          assert.equal(await page.locator("html").getAttribute("lang"), locale === "zh" ? "zh-CN" : locale);
          await page.setViewportSize({ width: 390, height: 844 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.setViewportSize({ width: 1440, height: 1000 });
          await page.goto(server.url);
          await page.waitForFunction(() => document.querySelectorAll(".module-card").length === 21);
          continue;
        }
        await page.waitForFunction(() => document.querySelector("#complete")?.disabled === false, null, { timeout: 5000 }).catch(error => { throw new Error(`${slug}/${locale} at ${page.url()}: ${error.message}`); });
        assert.equal(await page.locator("#title").textContent(), translation.title);
        assert.equal(await page.locator("#description").textContent(), translation.description);
        assert.equal(await page.locator("#topics li").count(), 3);
        if (slug === "game-settings") assert.match(await page.locator("#topics li").first().textContent(), /HUD/);
        assert.equal(await page.locator('#reset-module').isVisible(), true);
        if (slug === 'marketplace-system' && locale === 'en') {
          assert.equal(await page.locator('.gear-card').count(), 12);
          assert.equal(await page.locator('#gold-count').textContent(), '300');
          assert.equal(await page.locator('#inventory-count').textContent(), '1');
          await page.click('[data-action="sell"][data-item="starter-coat"]');
          assert.equal(await page.locator('#gold-count').textContent(), '355');
          await page.click('[data-action="buy"][data-item="leafsteel-sword"]');
          assert.equal(await page.locator('#gold-count').textContent(), '190');
          await page.click('[data-action="salvage"][data-item="leafsteel-sword"]');
          assert.equal(await page.locator('#gold-count').textContent(), '168');
          assert.equal(await page.locator('#dust-count').textContent(), '6');
          await page.click('[data-action="buy"][data-item="emerald-ring"]');
          await page.click('[data-action="sell"][data-item="emerald-ring"]');
          assert.equal(await page.locator('#gold-count').textContent(), '128');
          await page.reload();
          assert.equal(await page.locator('#gold-count').textContent(), '128');
          await page.click('[data-locale="zh"]');
          assert.match(await page.locator('.prompt-card textarea').first().inputValue(), /为奇幻林地冒险创作一枚精致护甲图标/);
          await page.click('[data-locale="ms"]');
          assert.match(await page.locator('.prompt-card textarea').first().inputValue(), /Cipta satu ikon perisai premium/);
          await page.click('[data-locale="en"]');
          await page.click('#reset-module');
          const resetRequest = page.waitForResponse(response => response.url().includes('/api/modules/marketplace-system/reset') && response.ok());
          const resetNavigation = page.waitForNavigation({ waitUntil: 'load' });
          await page.click('#reset-module');
          await Promise.all([resetRequest, resetNavigation]);
          assert.equal(await page.locator('#gold-count').textContent(), '300');
          assert.equal(await page.locator('#dust-count').textContent(), '0');
          assert.equal(await page.locator('#inventory-count').textContent(), '1');
        }
        assert.equal(await page.locator("html").getAttribute("lang"), locale === "zh" ? "zh-CN" : locale);
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.goto(server.url);
        await page.waitForFunction(() => document.querySelectorAll(".module-card").length === 21);
      }
    }
    await page.goto(`${server.url}/game-controls/`);
    await page.click('.pad-control[data-index="0"]');
    await page.click("#open-settings");
    await page.locator("#mapping-attack").selectOption("3");
    await page.click("#done-settings");
    await page.waitForFunction(() => !document.querySelector("#complete-module").disabled);
    await page.click("#complete-module");
    const completed = await (await fetch(`${server.url}/api/modules?learnerId=${learnerId}`)).json();
    assert.equal(completed.find(module => module.slug === "game-controls").completed, true);
    await server.stop();
    server = await startServer(storage);
    const reloaded = await (await fetch(`${server.url}/api/modules?learnerId=${learnerId}`)).json();
    assert.equal(reloaded.length, 21);
    assert.equal(reloaded.find(module => module.slug === "game-controls").completed, true);
    await page.goto(server.url);
    await page.waitForFunction(() => document.querySelectorAll(".module-card").length === 21);
    assert.equal(await page.locator("#progress-value").textContent(), `${Math.round(reloaded.filter(module => module.completed).length / reloaded.length * 100)}%`);
    assert.ok((await page.locator("#progress-text").textContent()).includes("21"));
    assert.equal(await page.locator('#module-game-assets-creation .reset-module-button').isVisible(), true);
    const otherLearnerId = 'checkpoint-learner-0002';
    assert.equal((await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId: otherLearnerId, state: { currentStep: 2 } }),
    })).status, 200);
    assert.equal((await fetch(`${server.url}/api/modules/game-assets-creation/progress`, {
      method: 'PATCH', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId: otherLearnerId, completed: true }),
    })).status, 200);
    const assetsBeforeReset = (await (await fetch(`${server.url}/api/assets?module=final-game`)).json()).length;
    assert.equal((await fetch(`${server.url}/api/modules/boss-creation/checkpoint`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, state: { creativePrompt: 'Keep this boss brief' } }),
    })).status, 200);
    const completedBeforeAssets = reloaded.filter(module => module.completed).length;
    await page.click('#module-game-assets-creation .complete-button');
    await page.waitForFunction(expected => document.querySelector('#progress-value').textContent === expected,
      `${Math.round((completedBeforeAssets + 1) / reloaded.length * 100)}%`);
    await page.click('#module-game-assets-creation .reset-module-button');
    assert.equal(await page.locator('#module-game-assets-creation .reset-module-button').getAttribute('data-confirming'), 'true');
    assert.ok((await (await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint?learnerId=${learnerId}`)).json()).state);
    await page.click('#module-game-assets-creation .reset-module-button');
    await page.waitForFunction(expected => document.querySelector('#progress-value').textContent === expected,
      `${Math.round(completedBeforeAssets / reloaded.length * 100)}%`);
    assert.equal((await (await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint?learnerId=${learnerId}`)).json()).state, null);
    assert.equal((await (await fetch(`${server.url}/api/modules/boss-creation/checkpoint?learnerId=${learnerId}`)).json()).state.creativePrompt, 'Keep this boss brief');
    assert.equal((await (await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint?learnerId=${otherLearnerId}`)).json()).state.currentStep, 2);
    assert.equal((await (await fetch(`${server.url}/api/modules?learnerId=${otherLearnerId}`)).json()).find(module => module.slug === 'game-assets-creation').completed, true);
    assert.equal((await (await fetch(`${server.url}/api/modules?learnerId=${learnerId}`)).json()).find(module => module.slug === 'game-assets-creation').completed, false);
    assert.equal((await (await fetch(`${server.url}/api/assets?module=final-game`)).json()).length, assetsBeforeReset);
    for (const slug of ['character-creation', 'game-assets-creation', 'boss-creation', 'math-stem-physics-quiz']) {
      await page.goto(`${server.url}/${slug}/`);
      assert.equal(await page.locator('#reset-module').isVisible(), true);
    }
    assert.equal((await (await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint?learnerId=${learnerId}`)).json()).state, null);
    await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, state: { creativePrompt: 'Reset this guide', answers: { theme: 'Forest adventure' }, currentStep: 1 } }),
    });
    await page.goto(`${server.url}/game-assets-creation/`);
    await page.waitForFunction(() => document.querySelector('#creative-prompt').value === 'Reset this guide');
    await page.route('**/api/modules/game-assets-creation/checkpoint', async route => {
      if (route.request().method() === 'PUT' && route.request().postData()?.includes('Late checkpoint')) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      await route.continue();
    });
    const lateSave = page.waitForRequest(request => request.method() === 'PUT' && request.url().includes('/api/modules/game-assets-creation/checkpoint') && request.postData()?.includes('Late checkpoint'));
    await page.evaluate(id => {
      void fetch('/api/modules/game-assets-creation/checkpoint', {
        method: 'PUT', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ learnerId: id, state: { creativePrompt: 'Late checkpoint' } }),
      });
    }, learnerId);
    await lateSave;
    await page.click('#reset-module');
    assert.equal(await page.locator('#reset-module').getAttribute('data-confirming'), 'true');
    await page.click('#reset-module');
    await page.waitForFunction(() => document.querySelector('#creative-prompt').value === '');
    assert.equal((await (await fetch(`${server.url}/api/modules/game-assets-creation/checkpoint?learnerId=${learnerId}`)).json()).state, null);
    await fetch(`${server.url}/api/modules/math-stem-physics-quiz/checkpoint`, {
      method: 'PUT', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ learnerId, state: { currentPage: 2, answers: { [quizQuestions[0].id]: { option: 0, correct: true, correctOption: 0, explanation: 'Saved answer' } } } }),
    });
    await page.evaluate(() => localStorage.setItem('godot-forge-locale', 'en'));
    await page.goto(`${server.url}/math-stem-physics-quiz/`);
    await page.waitForFunction(() => document.querySelector('#quiz-page-label').textContent.includes('PAGE 3 OF 4'));
    assert.equal(await page.locator('#answered-count').textContent(), '0 / 40 answered');
    assert.equal(await page.locator('#complete').isHidden(), true);
    await page.click('#reset-module');
    await page.click('#reset-module');
    await page.waitForFunction(() => document.querySelector('#quiz-page-label').textContent.includes('PAGE 1 OF 4') && document.querySelector('#answered-count').textContent === '0 / 40 answered');
    assert.equal((await (await fetch(`${server.url}/api/modules/math-stem-physics-quiz/checkpoint?learnerId=${learnerId}`)).json()).state, null);
    await page.goto(server.url);
    const localState = [
      ['game-settings', ['godot-forge-music', 'godot-forge-sound']],
      ['game-ending-cutscene', ['godot-forge-ending-cutscene-choice']],
      ['marketplace-system', [`godot-forge-marketplace:${learnerId}`]],
      ['game-controls', ['godot-forge-gamepad-mapping']],
    ];
    await page.evaluate(entries => {
      for (const [, keys] of entries) for (const key of keys) localStorage.setItem(key, 'test-saved-state');
    }, localState);
    for (const [slug, keys] of localState) {
      await page.click(`#module-${slug} .reset-module-button`);
      const response = page.waitForResponse(item => item.url().includes(`/api/modules/${slug}/reset`) && item.ok());
      await page.click(`#module-${slug} .reset-module-button`);
      await response;
      await page.waitForFunction(names => names.every(key => localStorage.getItem(key) === null), keys);
      assert.equal(await page.evaluate(() => localStorage.getItem('godot-forge-learner-id')), learnerId);
      for (const [otherSlug, otherKeys] of localState) {
        if (otherSlug === slug || localState.findIndex(([name]) => name === otherSlug) < localState.findIndex(([name]) => name === slug)) continue;
        assert.equal(await page.evaluate(key => localStorage.getItem(key), otherKeys[0]), 'test-saved-state');
      }
    }
    await page.route('**/api/modules/game-leaderboard/progress', async route => {
      if (route.request().method() === 'PATCH') await new Promise(resolve => setTimeout(resolve, 350));
      await route.continue();
    });
    const delayedCompletion = page.waitForRequest(request => request.method() === 'PATCH' && request.url().endsWith('/api/modules/game-leaderboard/progress'));
    await page.evaluate(id => {
      void fetch('/api/modules/game-leaderboard/progress', {
        method: 'PATCH', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ learnerId: id, completed: true }),
      });
    }, learnerId);
    await delayedCompletion;
    await page.click('#module-game-leaderboard .reset-module-button');
    const leaderboardReset = page.waitForResponse(response => response.url().endsWith('/api/modules/game-leaderboard/reset') && response.ok());
    await page.click('#module-game-leaderboard .reset-module-button');
    await leaderboardReset;
    assert.equal((await (await fetch(`${server.url}/api/modules?learnerId=${learnerId}`)).json()).find(module => module.slug === 'game-leaderboard').completed, false);
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    await server.stop();
  }
});

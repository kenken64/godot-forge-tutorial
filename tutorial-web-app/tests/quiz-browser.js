import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { quizQuestionBank } from '../quiz-question-bank.mjs';

const baseUrl = process.env.TEST_BASE_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: process.env.CHROME_CHANNEL || "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const correctAnswers = new Map(quizQuestionBank.map(question => [question.id, question.correctOption]));
const errors = [];
page.on("pageerror", error => errors.push(error.message));

try {
  await page.goto(`${baseUrl}/math-stem-physics-quiz/`);
  await page.waitForFunction(() => document.querySelectorAll(".quiz-card").length === 10);
  assert.match(await page.locator('.chapter-label').textContent(), /CHAPTER 18/);
  assert.equal(await page.locator('#retry').isVisible(), true);
  const questionBank = await (await page.request.get(`${baseUrl}/api/quizzes/math-stem-physics-quiz`)).json();
  assert.equal(questionBank.length, 40);
  assert.equal(new Set(questionBank.map(question => question.category)).size, 4);
  assert.equal("correctOption" in questionBank[0], false);
  assert.equal(await page.locator(".quiz-card").count(), 10);
  assert.equal(await page.locator('#quiz-page-tabs button').count(), 4);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.click('[data-quiz-page="2"]');
  assert.match(await page.locator('#quiz-page-label').textContent(), /PAGE 3 OF 4/);
  await page.click('#previous-page');
  assert.match(await page.locator('#quiz-page-label').textContent(), /PAGE 2 OF 4/);
  await page.click('[data-quiz-page="0"]');
  for (const [index, question] of questionBank.entries()) {
    if (index > 0 && index % 10 === 0) {
      await page.click('#next-page');
      assert.match(await page.locator('#quiz-page-label').textContent(), new RegExp(`PAGE ${Math.floor(index / 10) + 1} OF 4`));
    }
    const correct = correctAnswers.get(question.id);
    await page.locator(".quiz-card").nth(index % 10).locator(".quiz-options button").nth(correct).click();
    await page.locator(".quiz-card").nth(index % 10).locator(".quiz-explanation").waitFor();
    if (index === 19) {
      await page.reload();
      await page.waitForFunction(() => document.querySelector('#answered-count').textContent === '20 / 40 answered');
      assert.match(await page.locator('#quiz-page-label').textContent(), /PAGE 2 OF 4/);
      assert.equal(await page.locator('.quiz-card').first().locator('.quiz-options button').first().isDisabled(), true);
      await page.click('#quiz-language-toggle [data-locale="zh"]');
      await page.waitForFunction(() => document.querySelector('.quiz-card h4')?.textContent.includes('速度在'));
      assert.equal(await page.locator('html').getAttribute('lang'), 'zh-CN');
      assert.match(await page.locator('.quiz-card .quiz-explanation').first().textContent(), /加速度/);
      await page.click('#quiz-language-toggle [data-locale="ms"]');
      await page.waitForFunction(() => document.querySelector('.quiz-card h4')?.textContent.includes('Halaju meningkat'));
      assert.equal(await page.locator('html').getAttribute('lang'), 'ms');
      assert.match(await page.locator('.quiz-card .quiz-explanation').first().textContent(), /Pecutan/);
      await page.click('#quiz-language-toggle [data-locale="en"]');
      await page.waitForFunction(() => document.querySelector('.quiz-card h4')?.textContent.includes('Velocity rises'));
      assert.equal(await page.locator('#answered-count').textContent(), '20 / 40 answered');
    }
  }
  await page.waitForFunction(() => !document.querySelector("#complete").hidden);
  assert.equal(await page.locator("#score").textContent(), "40 / 40");
  assert.equal(await page.locator('#answered-count').textContent(), '40 / 40 answered');
  assert.equal(await page.locator('.quiz-explanation a').count(), 10);
  assert.match(await page.locator("#quiz-result").textContent(), /Passed/);
  await page.click("#complete");
  await page.waitForFunction(() => document.querySelector("#complete").textContent.includes("✓"));
  const learnerId = await page.evaluate(() => localStorage.getItem('godot-forge-learner-id'));
  const modules = await (await page.request.get(`${baseUrl}/api/modules?learnerId=${encodeURIComponent(learnerId)}`)).json();
  assert.equal(modules.find(module => module.slug === "math-stem-physics-quiz").completed, true);
  await page.click('#retry');
  assert.match(await page.locator('#retry').textContent(), /CONFIRM NEW ATTEMPT/);
  await page.click('#retry');
  await page.waitForFunction(() => document.querySelector('#answered-count').textContent === '0 / 40 answered');
  assert.equal(await page.locator('#score').textContent(), '0 / 40');
  assert.equal((await (await page.request.get(`${baseUrl}/api/modules?learnerId=${encodeURIComponent(learnerId)}`)).json()).find(module => module.slug === 'math-stem-physics-quiz').completed, false);
  await page.locator('.quiz-card').first().locator('.quiz-options button').first().click();
  await page.locator('.quiz-card').first().locator('.quiz-explanation').waitFor();
  await page.click('#retry');
  await page.click('#retry');
  await page.waitForFunction(() => document.querySelector('#answered-count').textContent === '0 / 40 answered');
  assert.deepEqual(errors, []);
  console.log("PASS 40-question quiz with completion, module order and unlimited fresh attempts");
} finally {
  await browser.close();
}

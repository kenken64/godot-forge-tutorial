const moduleSlug = "math-stem-physics-quiz";
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
const copy = {
  en: { title: 'Math, STEM & Physics Quiz · Godot Forge', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 16 / FINAL CHECKPOINT', language: 'Language', eyebrow: 'MATH · STEM · PHYSICS · HISTORY', titleFirst: 'Know the rules', titleSecond: 'behind the game.', description: 'Test the calculations, systems, and computer-game history behind the adventure you built.', target: '40 QUESTIONS / 30 TO PASS', formulas: ['POSITION', 'ACCELERATION', 'FRAME TIME', 'VECTOR LENGTH'], formulaNotes: ['Move by velocity over time.', 'Measure change in velocity.', 'Keep animation and physics time-aware.', 'Find the size of a 2D direction.'], finalQuiz: 'FINAL QUIZ', quizTitle: 'Game knowledge checkpoint', score: 'SCORE', answered: 'answered', questions: 'questions', page: (n, total, category) => `PAGE ${n} OF ${total} · ${category}`, previous: '← PREVIOUS', next: 'NEXT →', retry: 'TRY AGAIN', complete: 'COMPLETE LEARNING PATH', completed: 'LEARNING PATH COMPLETE ✓', loading: 'Loading question bank…', unavailable: 'The quiz question bank is unavailable. Please refresh and try again.', checking: 'Checking your answer…', answerError: 'The answer could not be checked. Please try again.', readSource: 'Read source ↗', intro: (total, pass) => `Answer all ${total} questions across maths, physics, game systems and history. You need at least ${pass} correct to complete this module.`, passed: (score, total) => `Passed — ${score}/${total}. You understand the systems and history behind games. Complete the learning path when you are ready.`, failed: (score, total, pass) => `${score}/${total}. You need ${pass} correct to pass. Review the explanations, then try again.`, saved: (score, total) => `Learning path complete — ${score}/${total}. Great work.`, saveError: 'Your score passed, but progress could not be saved. Please try again.' },
  zh: { title: '数学、STEM 与物理测验 · Godot Forge', back: '← GODOT FORGE / 学习路径', chapter: '第 16 章 / 最终测验', language: '语言', eyebrow: '数学 · STEM · 物理 · 游戏史', titleFirst: '理解游戏', titleSecond: '背后的规则。', description: '测试你对所制作游戏中的计算、系统和电脑游戏史的了解。', target: '40 题 / 答对 30 题通过', formulas: ['位置', '加速度', '帧时间', '向量长度'], formulaNotes: ['按速度与时间计算移动。', '测量速度的变化。', '让动画和物理计算考虑时间。', '求出二维方向的长度。'], finalQuiz: '最终测验', quizTitle: '游戏知识测验', score: '得分', answered: '题已作答', questions: '题', page: (n, total, category) => `第 ${n} / ${total} 页 · ${category}`, previous: '← 上一页', next: '下一页 →', retry: '再试一次', complete: '完成学习路径', completed: '学习路径已完成 ✓', loading: '正在载入题库…', unavailable: '无法载入测验题库。请刷新页面后重试。', checking: '正在检查答案…', answerError: '无法检查答案，请重试。', readSource: '阅读资料 ↗', intro: (total, pass) => `完成数学、物理、游戏系统和历史的全部 ${total} 道题。至少答对 ${pass} 题即可通过。`, passed: (score, total) => `通过 — ${score}/${total}。你已掌握游戏背后的系统与历史。准备好后即可完成学习路径。`, failed: (score, total, pass) => `${score}/${total}。至少答对 ${pass} 题才能通过。请复习解析后再试。`, saved: (score, total) => `学习路径已完成 — ${score}/${total}。做得好！`, saveError: '你已达到及格分数，但无法保存进度。请重试。' },
  ms: { title: 'Kuiz Matematik, STEM & Fizik · Godot Forge', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 16 / KUIZ AKHIR', language: 'Bahasa', eyebrow: 'MATEMATIK · STEM · FIZIK · SEJARAH', titleFirst: 'Fahami peraturan', titleSecond: 'di sebalik permainan.', description: 'Uji pengiraan, sistem dan sejarah permainan komputer di sebalik pengembaraan yang anda bina.', target: '40 SOALAN / 30 UNTUK LULUS', formulas: ['KEDUDUKAN', 'PECUTAN', 'MASA BINGKAI', 'PANJANG VEKTOR'], formulaNotes: ['Gerak mengikut halaju dan masa.', 'Ukur perubahan halaju.', 'Ambil kira masa dalam animasi dan fizik.', 'Cari magnitud arah 2D.'], finalQuiz: 'KUIZ AKHIR', quizTitle: 'Semakan pengetahuan permainan', score: 'MARKAH', answered: 'dijawab', questions: 'soalan', page: (n, total, category) => `HALAMAN ${n} DARIPADA ${total} · ${category}`, previous: '← SEBELUMNYA', next: 'SETERUSNYA →', retry: 'CUBA LAGI', complete: 'LENGKAPKAN LALUAN PEMBELAJARAN', completed: 'LALUAN PEMBELAJARAN SELESAI ✓', loading: 'Memuatkan bank soalan…', unavailable: 'Bank soalan tidak tersedia. Sila muat semula dan cuba lagi.', checking: 'Menyemak jawapan…', answerError: 'Jawapan tidak dapat disemak. Sila cuba lagi.', readSource: 'Baca sumber ↗', intro: (total, pass) => `Jawab semua ${total} soalan tentang matematik, fizik, sistem permainan dan sejarah. Anda perlu sekurang-kurangnya ${pass} jawapan betul untuk lulus.`, passed: (score, total) => `Lulus — ${score}/${total}. Anda memahami sistem dan sejarah di sebalik permainan. Lengkapkan laluan pembelajaran apabila bersedia.`, failed: (score, total, pass) => `${score}/${total}. Anda perlu ${pass} jawapan betul untuk lulus. Semak penjelasan dan cuba lagi.`, saved: (score, total) => `Laluan pembelajaran selesai — ${score}/${total}. Syabas!`, saveError: 'Markah anda lulus, tetapi kemajuan tidak dapat disimpan. Sila cuba lagi.' },
};
// The quiz is followed by Godot setup and the final build step.
Object.assign(copy.en, {
  chapter: 'CHAPTER 18 / KNOWLEDGE CHECK', finalQuiz: 'KNOWLEDGE CHECK',
  retry: 'START NEW ATTEMPT', retryConfirm: 'CONFIRM NEW ATTEMPT',
  retryWarning: 'Click again to clear every answer and your quiz pass status.', retrySuccess: 'New quiz attempt started.',
  complete: 'COMPLETE QUIZ', completed: 'QUIZ COMPLETE ✓',
  passed: (score, total) => `Passed — ${score}/${total}. Complete this quiz, then continue to Set Up Godot with AI.`,
  saved: (score, total) => `Quiz complete — ${score}/${total}. Set Up Godot with AI is next.`,
});
Object.assign(copy.zh, {
  chapter: '第 18 章 / 知识测验', finalQuiz: '知识测验',
  retry: '开始新一轮测验', retryConfirm: '确认重新开始',
  retryWarning: '再次点击将清除所有答案和测验通过状态。', retrySuccess: '已开始新一轮测验。',
  complete: '完成测验', completed: '测验已完成 ✓',
  passed: (score, total) => `通过 — ${score}/${total}。完成本测验后，继续进入“借助 AI 设置 Godot”。`,
  saved: (score, total) => `测验已完成 — ${score}/${total}。下一站是“借助 AI 设置 Godot”。`,
});
Object.assign(copy.ms, {
  chapter: 'BAB 18 / SEMAKAN PENGETAHUAN', finalQuiz: 'SEMAKAN PENGETAHUAN',
  retry: 'MULA CUBAAN BAHARU', retryConfirm: 'SAHKAN CUBAAN BAHARU',
  retryWarning: 'Klik sekali lagi untuk padam semua jawapan dan status lulus kuiz.', retrySuccess: 'Cubaan kuiz baharu bermula.',
  complete: 'LENGKAPKAN KUIZ', completed: 'KUIZ SELESAI ✓',
  passed: (score, total) => `Lulus — ${score}/${total}. Lengkapkan kuiz ini, kemudian teruskan ke Sediakan Godot dengan AI.`,
  saved: (score, total) => `Kuiz selesai — ${score}/${total}. Sediakan Godot dengan AI ialah langkah seterusnya.`,
});
let currentLocale = copy[localStorage.getItem('godot-forge-locale')] ? localStorage.getItem('godot-forge-locale') : 'en';
const quizList = document.querySelector("#quiz-list"), pageTabs = document.querySelector('#quiz-page-tabs'), previousPage = document.querySelector('#previous-page'), nextPage = document.querySelector('#next-page'), pageLabel = document.querySelector('#quiz-page-label'), scoreElement = document.querySelector("#score"), answeredElement = document.querySelector("#answered-count"), intro = document.querySelector("#quiz-intro"), result = document.querySelector("#quiz-result"), retry = document.querySelector("#retry"), complete = document.querySelector("#complete");
const pageSize = 10;
let questions = [], selected = [], score = 0, currentPage = 0;
const checking = new Set();

function applyLocale() {
  const t = copy[currentLocale];
  document.title = t.title;
  document.documentElement.lang = currentLocale === 'zh' ? 'zh-CN' : currentLocale;
  document.querySelector('.back-link').textContent = t.back;
  document.querySelector('.chapter-label').textContent = t.chapter;
  document.querySelector('#quiz-language-toggle').setAttribute('aria-label', t.language);
  document.querySelectorAll('#quiz-language-toggle button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === currentLocale)));
  document.querySelector('.module-intro .eyebrow').textContent = t.eyebrow;
  document.querySelector('#quiz-title-first').textContent = t.titleFirst;
  document.querySelector('#quiz-title-second').textContent = t.titleSecond;
  document.querySelector('.module-intro .intro-copy').textContent = t.description;
  document.querySelector('.module-intro .intro-note span:last-child').textContent = t.target;
  document.querySelectorAll('.formula-strip article').forEach((article, index) => { article.querySelector('span').textContent = t.formulas[index]; article.querySelector('p').textContent = t.formulaNotes[index]; });
  document.querySelector('.quiz-header .eyebrow').textContent = t.finalQuiz;
  document.querySelector('.quiz-header h2').textContent = t.quizTitle;
  document.querySelector('.score-card span').textContent = t.score;
  pageTabs.setAttribute('aria-label', t.quizTitle);
  document.querySelector('.quiz-pagination').setAttribute('aria-label', t.quizTitle);
  previousPage.textContent = t.previous;
  nextPage.textContent = t.next;
  retry.textContent = retry.dataset.confirming === 'true' ? t.retryConfirm : t.retry;
  complete.textContent = complete.disabled ? t.completed : t.complete;
  if (questions.length) intro.textContent = t.intro(questions.length, Math.ceil(questions.length * .75));
}

async function saveQuizCheckpoint() {
  await fetch(`/api/modules/${moduleSlug}/checkpoint`, {
    method: 'PUT', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ learnerId, state: { currentPage } }),
  }).catch(() => {});
}

async function restoreQuizCheckpoint(questionList, locale) {
  const response = await fetch(`/api/modules/${moduleSlug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`).catch(() => null);
  const checkpoint = response?.ok ? await response.json().catch(() => ({})) : {};
  const savedPage = Number(checkpoint.state?.currentPage);
  const page = Number.isInteger(savedPage) ? Math.min(Math.ceil(questionList.length / pageSize) - 1, Math.max(0, savedPage)) : 0;
  const review = await fetch(`/api/quizzes/${moduleSlug}/review`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ learnerId, locale }),
  });
  if (!review.ok) throw new Error(copy[locale].unavailable);
  const payload = await review.json();
  const byId = new Map(payload.answers.map(answer => [answer.questionId, answer]));
  const restored = questionList.map(question => byId.get(question.id) || null);
  return { selected: restored, page };
}

function renderQuiz() {
  const t = copy[currentLocale];
  score = selected.reduce((total, answer) => total + (answer?.correct ? 1 : 0), 0);
  scoreElement.textContent = `${score} / ${questions.length || 40}`;
  answeredElement.textContent = `${selected.filter(Boolean).length} / ${questions.length || 40} ${t.answered}`;
  quizList.replaceChildren();
  pageTabs.replaceChildren();
  if (!questions.length) { const loading = document.createElement("p"); loading.className = "profile-empty"; loading.textContent = t.loading; quizList.append(loading); return; }
  const pageCount = Math.ceil(questions.length / pageSize);
  for (let page = 0; page < pageCount; page++) {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.dataset.quizPage = String(page);
    tab.textContent = `${page + 1}. ${questions[page * pageSize].category || t.quizTitle}`;
    tab.setAttribute('aria-current', String(page === currentPage));
    tab.disabled = checking.size > 0;
    tab.addEventListener('click', () => goToPage(page));
    pageTabs.append(tab);
  }
  pageLabel.textContent = t.page(currentPage + 1, pageCount, questions[currentPage * pageSize].category || t.quizTitle);
  previousPage.disabled = currentPage === 0 || checking.size > 0;
  nextPage.disabled = currentPage === pageCount - 1 || checking.size > 0;
  const firstQuestion = currentPage * pageSize;
  questions.slice(firstQuestion, firstQuestion + pageSize).forEach((item, offset) => {
    const index = firstQuestion + offset;
    const card = document.createElement("article"), heading = document.createElement("h4"), number = document.createElement("span"), options = document.createElement("div"), answer = selected[index];
    card.className = "quiz-card"; number.textContent = currentLocale === 'zh' ? `第${index + 1}题` : currentLocale === 'ms' ? `S${String(index + 1).padStart(2, '0')}` : `Q${String(index + 1).padStart(2, "0")}`; heading.append(number, item.question); options.className = "quiz-options";
    item.options.forEach((label, optionIndex) => {
      const button = document.createElement("button"); button.type = "button"; button.textContent = label;
      if (answer || checking.has(index)) button.disabled = true;
      if (answer?.correctOption === optionIndex) button.classList.add("correct");
      else if (answer && answer.option === optionIndex) button.classList.add("incorrect");
      button.addEventListener("click", () => answerQuestion(index, optionIndex)); options.append(button);
    });
    card.append(heading, options);
    if (checking.has(index)) { const feedback = document.createElement("p"); feedback.className = "quiz-explanation"; feedback.textContent = t.checking; card.append(feedback); }
    else if (answer) { const explanation = document.createElement("p"); explanation.className = "quiz-explanation"; explanation.textContent = answer.explanation; if (answer.sourceUrl) { const source = document.createElement('a'); source.href = answer.sourceUrl; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = t.readSource; explanation.append(' ', source); } card.append(explanation); }
    quizList.append(card);
  });
  if (selected.length === questions.length && selected.every(Boolean) && checking.size === 0) showResult();
}

function goToPage(page) {
  if (checking.size || page < 0 || page >= Math.ceil(questions.length / pageSize) || page === currentPage) return;
  currentPage = page;
  result.hidden = true;
  renderQuiz();
  saveQuizCheckpoint();
  document.querySelector('.quiz-shell').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadQuestions() {
  const locale = currentLocale;
  try {
    const response = await fetch(`/api/quizzes/${moduleSlug}?locale=${locale}`);
    const payload = await response.json().catch(() => []);
    if (!response.ok || !Array.isArray(payload) || !payload.length) throw new Error(copy[locale].unavailable);
    const restored = await restoreQuizCheckpoint(payload, locale);
    if (locale !== currentLocale) return;
    questions = payload; selected = restored.selected; currentPage = restored.page;
    applyLocale();
    renderQuiz();
  } catch (error) { if (locale !== currentLocale) return; quizList.replaceChildren(); const message = document.createElement("p"); message.className = "profile-empty"; message.textContent = error.message; quizList.append(message); }
}

async function answerQuestion(questionIndex, option) {
  if (selected[questionIndex] || checking.has(questionIndex)) return;
  checking.add(questionIndex); renderQuiz();
  try {
    const response = await fetch(`/api/quizzes/${moduleSlug}/answer`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, questionId: questions[questionIndex].id, option, locale: currentLocale }) });
    const evaluation = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(evaluation.error || copy[currentLocale].answerError);
    selected[questionIndex] = evaluation;
    await saveQuizCheckpoint();
  } catch (error) {
    result.hidden = false; result.classList.add("failed"); result.textContent = error.message;
  } finally { checking.delete(questionIndex); renderQuiz(); }
}

function showResult() {
  const t = copy[currentLocale];
  const passMark = Math.ceil(questions.length * .75);
  const passed = score >= passMark;
  result.hidden = false; result.classList.toggle("failed", !passed);
  result.textContent = passed ? t.passed(score, questions.length) : t.failed(score, questions.length, passMark);
  complete.hidden = !passed;
}

async function completeModule() {
  complete.disabled = true;
  const response = await fetch(`/api/modules/${moduleSlug}/progress`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, completed: true }) });
  if (response.ok) { complete.textContent = copy[currentLocale].completed; result.textContent = copy[currentLocale].saved(score, questions.length); }
  else { complete.disabled = false; result.textContent = copy[currentLocale].saveError; }
}

document.querySelector('#quiz-language-toggle').addEventListener('click', event => {
  const locale = event.target.closest('button[data-locale]')?.dataset.locale;
  if (!copy[locale] || locale === currentLocale || checking.size) return;
  currentLocale = locale;
  localStorage.setItem('godot-forge-locale', locale);
  applyLocale();
  loadQuestions();
});
previousPage.addEventListener('click', () => goToPage(currentPage - 1));
nextPage.addEventListener('click', () => goToPage(currentPage + 1));
retry.addEventListener("click", async () => {
  if (checking.size) return;
  if (retry.dataset.confirming !== 'true') {
    retry.dataset.confirming = 'true'; retry.textContent = copy[currentLocale].retryConfirm;
    window.showToast?.(copy[currentLocale].retryWarning);
    clearTimeout(retry.resetTimer);
    retry.resetTimer = setTimeout(() => { retry.dataset.confirming = 'false'; retry.textContent = copy[currentLocale].retry; }, 8000);
    return;
  }
  clearTimeout(retry.resetTimer);
  retry.disabled = true;
  try {
    const response = await fetch(`/api/quizzes/${moduleSlug}/retry`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId }) });
    if (!response.ok) throw new Error(copy[currentLocale].answerError);
    selected = Array(questions.length).fill(null); currentPage = 0; result.hidden = true; complete.hidden = true; complete.disabled = false;
    window.showToast?.(copy[currentLocale].retrySuccess, 'success');
    renderQuiz(); window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) { result.hidden = false; result.classList.add('failed'); result.textContent = error.message; window.showToast?.(error.message, 'error'); }
  finally { retry.disabled = false; retry.dataset.confirming = 'false'; retry.textContent = copy[currentLocale].retry; }
});
complete.addEventListener("click", completeModule);
applyLocale();
renderQuiz();
loadQuestions();

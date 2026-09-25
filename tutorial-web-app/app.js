let modules = [];
const completedModules = new Set();
const learnerId = (() => { const key = 'godot-forge-learner-id'; let value = localStorage.getItem(key); if (!value) { value = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(key, value); } return value; })();
const supportedLocales = ["en", "zh", "ms"];
const savedLocale = window.localStorage.getItem("godot-forge-locale");
let currentLocale = supportedLocales.includes(savedLocale) ? savedLocale : "en";
const moduleOrder = [
  "character-creation",
  "game-assets-creation",
  "boss-creation",
  "storyline-engine",
  "parallax-tiling-map",
  "items-spawning",
  "enemies-ai",
  "game-loop-engine",
  "game-controls",
  "game-settings",
  "game-physics",
  "game-ending-cutscene",
  "credits",
  "marketplace-system",
  "game-achievement",
  "game-leaderboard",
  "local-coop",
  "multiplayer-game",
  "math-stem-physics-quiz",
  "setup-godot-with-ai",
  "final-game",
];

const moduleIcons = {
  "character-creation": "♙",
  "game-assets-creation": "▦",
  "boss-creation": "♛",
  "storyline-engine": "⌁",
  "parallax-tiling-map": "▤",
  "items-spawning": "◇",
  "enemies-ai": "◆",
  "game-loop-engine": "↻",
  "game-controls": "⊞",
  "game-settings": "⚙",
  "game-physics": "∿",
  "game-ending-cutscene": "◒",
  credits: "✧",
  "marketplace-system": "¤",
  "game-achievement": "★",
  "game-leaderboard": "▥",
  "local-coop": "♧",
  "multiplayer-game": "⇄",
  "final-game": "✦",
  "math-stem-physics-quiz": "π",
  "setup-godot-with-ai": "⚒",
};

const fallbackModuleTranslations = {
  "character-creation": {
    zh: { title: "角色创建", description: "打造拥有移动、个性与目标的玩家角色。" },
    ms: { title: "Penciptaan watak", description: "Bina watak pemain dengan pergerakan, personaliti dan tujuan." },
  },
  "game-assets-creation": {
    zh: { title: "游戏资产创建", description: "创建游戏世界的视觉语言和可重用素材。" },
    ms: { title: "Penciptaan aset permainan", description: "Cipta bahasa visual dan aset boleh guna semula untuk dunia permainan." },
  },
  "parallax-tiling-map": {
    zh: { title: "视差平铺地图", description: "构建分层环境，让每一步探索都更有空间感。" },
    ms: { title: "Peta jubin paralaks", description: "Bina persekitaran berlapis yang menjadikan setiap langkah terasa luas." },
  },
  "game-loop-engine": {
    zh: { title: "游戏循环架构", description: "完成可玩的任务循环：收集 20 枚金币、抵达终点、庆祝通关，并点击继续重新开始。" },
    ms: { title: "Seni Bina Gelung Permainan", description: "Bina gelung misi yang boleh dimainkan: kutip 20 syiling, capai matlamat, raikan tamat aras dan mula semula dengan Teruskan." },
  },
  "items-spawning": {
    zh: { title: "道具生成", description: "在地图中随机生成可拾取道具，让玩家触碰收集，并在敌人被击败时掉落战利品。" },
    ms: { title: "Penjanaan item", description: "Munculkan item secara rawak di dunia, kutip dengan menyentuhnya, dan jatuhkan loot apabila musuh ditewaskan." },
  },
  "enemies-ai": {
    zh: { title: "敌人与 AI", description: "创建两种森林敌人，加入巡逻、近距离侦测、追逐、近战攻击和玩家反馈。" },
    ms: { title: "Musuh & AI", description: "Cipta dua musuh hutan dengan rondaan, pengesanan jarak dekat, kejaran, serangan jarak dekat dan maklum balas pemain." },
  },
  "boss-creation": {
    zh: { title: "Boss 创建", description: "设计具有清晰模式和精彩回报的难忘挑战。" },
    ms: { title: "Penciptaan bos", description: "Reka cabaran yang mudah difahami dengan corak dan ganjaran yang berkesan." },
  },
  "storyline-engine": {
    zh: { title: "故事线引擎", description: "用分支叙事节奏给玩家探索的理由。" },
    ms: { title: "Enjin jalan cerita", description: "Berikan sebab untuk meneroka melalui rentak naratif bercabang." },
  },
  "final-game": {
    zh: { title: "最终游戏", description: "整合所有系统，发布一场小而完整的冒险。" },
    ms: { title: "Permainan akhir", description: "Satukan semua sistem dan siapkan pengembaraan kecil yang lengkap." },
  },
  "game-ending-cutscene": {
    zh: { title: "游戏结局过场动画", description: "设计令人满意的结局，让玩家的最后行动成为难忘的收尾时刻。" },
    ms: { title: "Babak akhir permainan", description: "Rancang penutup yang memuaskan supaya aksi terakhir pemain menjadi detik penamat yang diingati." },
  },
  credits: {
    zh: { title: "制作人员名单", description: "制作精致的致谢名单，向游戏背后的创作者、工具和创作历程致敬。" },
    ms: { title: "Penghargaan", description: "Cipta urutan penghargaan yang kemas untuk meraikan orang, alatan dan perjalanan di sebalik permainan anda." },
  },
  "marketplace-system": {
    zh: { title: "游戏商店系统", description: "构建玩家友好的商店，用于浏览、购买并安全保存游戏内升级内容。" },
    ms: { title: "Sistem pasaran", description: "Bina kedai mesra pemain untuk menyemak imbas, membeli dan menyimpan naik taraf dalam permainan dengan selamat." },
  },
  "game-achievement": {
    zh: { title: "游戏成就", description: "通过清晰的解锁条件、进度追踪和持久徽章奖励重要里程碑。" },
    ms: { title: "Pencapaian Permainan", description: "Ganjar pencapaian penting dengan syarat buka kunci yang jelas, penjejakan kemajuan dan lencana kekal." },
  },
  "game-leaderboard": {
    zh: { title: "游戏排行榜", description: "通过验证分数提交、处理平分规则并保护玩家隐私，建立公平排名。" },
    ms: { title: "Papan Pendahulu Permainan", description: "Bina kedudukan markah yang adil dengan pengesahan, peraturan seri dan privasi pemain." },
  },
  "local-coop": {
    zh: { title: "本地合作游戏", description: "构建共享屏幕合作玩法，支持玩家加入与离开、独立键盘或手柄输入以及共同目标。" },
    ms: { title: "Kerjasama Setempat", description: "Bina permainan koperatif pada skrin yang sama dengan pemain boleh sertai atau keluar, input papan kekunci atau pad permainan berasingan serta objektif bersama." },
  },
  "multiplayer-game": {
    zh: { title: "多人联网游戏", description: "设计联网玩法，涵盖权威游戏状态、玩家同步、延迟处理和可靠的会话管理。" },
    ms: { title: "Permainan Berbilang Pemain", description: "Reka permainan rangkaian dengan keadaan permainan berautoriti, penyegerakan pemain, pengendalian kependaman dan sesi yang teguh." },
  },
  "math-stem-physics-quiz": {
    zh: { title: "数学、STEM 与物理测验", description: "测试你对游戏开发中的数学、运动、时间和碰撞知识的掌握。" },
    ms: { title: "Kuiz matematik, STEM & fizik", description: "Uji pengetahuan matematik, pergerakan, masa dan perlanggaran dalam pembangunan permainan anda." },
  },
  "setup-godot-with-ai": {
    zh: { title: "借助 AI 设置 Godot", description: "创建 Godot 2D 项目，导入已保存的素材，并借助 AI 组装和检查场景。" },
    ms: { title: "Sediakan Godot dengan AI", description: "Cipta projek Godot 2D, import aset yang disimpan dan gunakan AI untuk membantu membina serta menguji adegan." },
  },
};

const interfaceCopy = {
  en: {
    pageTitle: "Godot Forge — 2D Game Development",
    tutorialNavigation: "Tutorial navigation",
    brandHome: "Godot Forge home",
    tutorialProgress: "Tutorial progress",
    openNavigation: "Open navigation",
    language: "Language",
    toggleTheme: "Toggle color theme",
    localeEnglish: "EN",
    localeChinese: "中文",
    localeMalay: "BM",
    brandSubtitle: "2D GAME LAB",
    workspace: "Your workspace",
    journeyProgress: "Journey progress",
    of: "of",
    modulesComplete: "modules complete",
    modules: "Modules",
    buildMode: "Build mode",
    active: "ACTIVE",
    learningPath: "LEARNING PATH",
    version: "v0.1 / FOUNDATION",
    heroEyebrow: "A guided build from zero to playable",
    heroTitleFirst: "Make a world",
    heroTitleSecond: "worth playing.",
    heroDescription: "Follow the path from your first game asset to a complete 2D adventure. Every module is a focused building block for the final game.",
    startBuilding: "Start building",
    learningPathEyebrow: "The learning path",
    learningPathTitle: "Twenty-one steps to a living game.",
    findModule: "Find a module",
    playerLabel: "PLAYER_01",
    readyToBuild: "READY TO BUILD",
    nextModule: "next: Character Creation",
    buildPhilosophy: "Build philosophy",
    smallSystems: "Small systems.",
    bigWorlds: "Big worlds.",
    philosophyDescription: "Learn by making. Each chapter leaves you with something playable and gives the next system a reason to exist.",
    footerMessage: "BUILT ONE SYSTEM AT A TIME",
    chapter: "CH.",
    minutes: "min",
    ready: "READY",
    done: "DONE",
    markDone: "MARK DONE",
    reopen: "REOPEN",
    quizRequirement: "PASS QUIZ TO COMPLETE",
    quizPassed: "QUIZ PASSED",
    reset: "RESET MODULE",
    emptyState: "No modules match that search.",
    loadError: "Unable to load tutorial modules. Start the app with npm start.",
    progress: (complete, total) => `${complete} of ${total} modules complete`,
    tags: { PLAYER: "PLAYER", FOUNDATION: "FOUNDATION", WORLD: "WORLD", CORE: "CORE", SYSTEM: "SYSTEM", CHALLENGE: "CHALLENGE", STORY: "STORY", "SHIP IT": "SHIP IT", "CO-OP": "CO-OP", NETWORKING: "NETWORKING" },
  },
  zh: {
    pageTitle: "Godot Forge — 2D 游戏开发",
    tutorialNavigation: "教程导航",
    brandHome: "Godot Forge 首页",
    tutorialProgress: "教程进度",
    openNavigation: "打开导航",
    language: "语言",
    toggleTheme: "切换颜色主题",
    localeEnglish: "英文",
    localeChinese: "中文",
    localeMalay: "马来文",
    brandSubtitle: "2D 游戏实验室",
    workspace: "你的工作区",
    journeyProgress: "学习进度",
    of: "/",
    modulesComplete: "个模块已完成",
    modules: "模块",
    buildMode: "构建模式",
    active: "运行中",
    learningPath: "学习路径",
    version: "v0.1 / 基础篇",
    heroEyebrow: "从零开始，循序构建可玩的游戏",
    heroTitleFirst: "创造一个",
    heroTitleSecond: "值得游玩的世界。",
    heroDescription: "从第一个游戏资产开始，逐步构建一场完整的 2D 冒险。每个模块都是最终游戏的重要组成部分。",
    startBuilding: "开始构建",
    learningPathEyebrow: "学习路径",
    learningPathTitle: "让游戏世界活起来的二十一步。",
    findModule: "查找模块",
    playerLabel: "玩家_01",
    readyToBuild: "准备构建",
    nextModule: "下一步：角色创建",
    buildPhilosophy: "构建理念",
    smallSystems: "小系统。",
    bigWorlds: "大世界。",
    philosophyDescription: "通过制作来学习。每一章都会留下可玩的成果，也为下一个系统创造存在的理由。",
    footerMessage: "一次构建一个系统",
    chapter: "第",
    minutes: "分钟",
    ready: "待开始",
    done: "完成",
    markDone: "标记完成",
    reopen: "重新打开",
    quizRequirement: "通过测验后完成",
    quizPassed: "测验已通过",
    reset: "重置模块",
    emptyState: "没有匹配的模块。",
    loadError: "无法加载教程模块。请使用 npm start 启动应用。",
    progress: (complete, total) => `${complete} / ${total} 个模块已完成`,
    tags: { PLAYER: "玩家", FOUNDATION: "基础", WORLD: "世界", CORE: "核心", SYSTEM: "系统", CHALLENGE: "挑战", STORY: "故事", "SHIP IT": "发布", "CO-OP": "合作", NETWORKING: "联网" },
  },
  ms: {
    pageTitle: "Godot Forge — Pembangunan Permainan 2D",
    tutorialNavigation: "Navigasi tutorial",
    brandHome: "Laman utama Godot Forge",
    tutorialProgress: "Kemajuan tutorial",
    openNavigation: "Buka navigasi",
    language: "Bahasa",
    toggleTheme: "Tukar tema warna",
    localeEnglish: "Inggeris",
    localeChinese: "Cina",
    localeMalay: "BM",
    brandSubtitle: "MAKMAL PERMAINAN 2D",
    workspace: "Ruang kerja anda",
    journeyProgress: "Kemajuan perjalanan",
    of: "daripada",
    modulesComplete: "modul selesai",
    modules: "Modul",
    buildMode: "Mod binaan",
    active: "AKTIF",
    learningPath: "LALUAN PEMBELAJARAN",
    version: "v0.1 / ASAS",
    heroEyebrow: "Panduan membina permainan daripada kosong hingga boleh dimainkan",
    heroTitleFirst: "Bina dunia",
    heroTitleSecond: "yang berbaloi dimainkan.",
    heroDescription: "Ikuti laluan daripada aset permainan pertama hingga pengembaraan 2D yang lengkap. Setiap modul ialah blok binaan penting untuk permainan akhir.",
    startBuilding: "Mula membina",
    learningPathEyebrow: "Laluan pembelajaran",
    learningPathTitle: "Dua puluh satu langkah untuk menghidupkan permainan.",
    findModule: "Cari modul",
    playerLabel: "PEMAIN_01",
    readyToBuild: "SEDIA UNTUK MEMBINA",
    nextModule: "seterusnya: Penciptaan watak",
    buildPhilosophy: "Falsafah binaan",
    smallSystems: "Sistem kecil.",
    bigWorlds: "Dunia besar.",
    philosophyDescription: "Belajar dengan membuat. Setiap bab meninggalkan sesuatu yang boleh dimainkan dan memberi sebab untuk sistem seterusnya wujud.",
    footerMessage: "BINA SATU SISTEM PADA SATU MASA",
    chapter: "BAB",
    minutes: "min",
    ready: "SEDIA",
    done: "SELESAI",
    markDone: "TANDA SELESAI",
    reopen: "BUKA SEMULA",
    quizRequirement: "LULUS KUIZ UNTUK SELESAI",
    quizPassed: "KUIZ LULUS",
    reset: "SET SEMULA MODUL",
    emptyState: "Tiada modul yang sepadan dengan carian itu.",
    loadError: "Modul tutorial tidak dapat dimuatkan. Mulakan aplikasi dengan npm start.",
    progress: (complete, total) => `${complete} daripada ${total} modul selesai`,
    tags: { PLAYER: "PEMAIN", FOUNDATION: "ASAS", WORLD: "DUNIA", CORE: "TERAS", SYSTEM: "SISTEM", CHALLENGE: "CABARAN", STORY: "CERITA", "SHIP IT": "TERBITKAN", "CO-OP": "KOPERATIF", NETWORKING: "RANGKAIAN" },
  },
};

Object.assign(interfaceCopy.en.tags, { INPUT: "INPUT", SETTINGS: "SETTINGS", PHYSICS: "PHYSICS" });
Object.assign(interfaceCopy.en.tags, { CINEMATIC: "CINEMATIC", CREDITS: "CREDITS", ECONOMY: "ECONOMY", MULTIPLAYER: "MULTIPLAYER", STEM: "STEM" });
Object.assign(interfaceCopy.en.tags, { REWARDS: "REWARDS", RANKING: "RANKING" });
Object.assign(interfaceCopy.en.tags, { GODOT: "GODOT" });
Object.assign(interfaceCopy.en.tags, { AI: "AI" });
Object.assign(interfaceCopy.zh.tags, { INPUT: "输入", SETTINGS: "设置", PHYSICS: "物理", CINEMATIC: "过场", CREDITS: "致谢", ECONOMY: "经济", MULTIPLAYER: "多人", STEM: "STEM" });
Object.assign(interfaceCopy.zh.tags, { REWARDS: "奖励", RANKING: "排名" });
Object.assign(interfaceCopy.zh.tags, { GODOT: "GODOT" });
Object.assign(interfaceCopy.zh.tags, { AI: "AI" });
Object.assign(interfaceCopy.ms.tags, { INPUT: "INPUT", SETTINGS: "TETAPAN", PHYSICS: "FIZIK", CINEMATIC: "SINEMATIK", CREDITS: "PENGHARGAAN", ECONOMY: "EKONOMI", MULTIPLAYER: "BERBILANG PEMAIN", STEM: "STEM" });
Object.assign(interfaceCopy.ms.tags, { REWARDS: "GANJARAN", RANKING: "KEDUDUKAN" });
Object.assign(interfaceCopy.ms.tags, { GODOT: "GODOT" });
Object.assign(interfaceCopy.ms.tags, { AI: "AI" });

const moduleGrid = document.querySelector("#module-grid");
const moduleNav = document.querySelector("#module-nav");
const moduleSearch = document.querySelector("#module-search");
const emptyState = document.querySelector("#empty-state");
const progressValue = document.querySelector("#progress-value");
const progressBar = document.querySelector("#progress-bar");
const completedCount = document.querySelector("#completed-count");
const moduleCount = document.querySelector("#module-count");
const progressText = document.querySelector("#progress-text");
const languageToggle = document.querySelector("#language-toggle");

function modulePath(module) {
  return `/${module.slug}/`;
}

function moduleLevel(module) {
  const orderIndex = moduleOrder.indexOf(module.slug);
  return orderIndex === -1 ? module.level : orderIndex + 1;
}

function moduleCopy(module) {
  return module.translations?.[currentLocale] || fallbackModuleTranslations[module.slug]?.[currentLocale] || module.translations?.en || module;
}

function localizeTag(tag) {
  return interfaceCopy[currentLocale].tags[tag] || tag;
}

function applyInterfaceCopy() {
  const copy = interfaceCopy[currentLocale];
  document.title = copy.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = copy[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = copy[element.dataset.i18nAria];
    if (value) element.setAttribute("aria-label", value);
  });
  moduleSearch.placeholder = copy.findModule;
  moduleSearch.setAttribute("aria-label", copy.findModule);
  document.documentElement.lang = currentLocale === "zh" ? "zh-CN" : currentLocale === "ms" ? "ms" : "en";
  languageToggle.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.locale === currentLocale);
  });
}

function setLocale(locale) {
  if (!supportedLocales.includes(locale)) return;
  currentLocale = locale;
  window.localStorage.setItem("godot-forge-locale", locale);
  applyInterfaceCopy();
  renderNavigation();
  renderCards(moduleSearch.value);
  renderProgress();
}

function renderNavigation() {
  moduleNav.innerHTML = modules
    .map(
      (module) => {
        const copy = moduleCopy(module);
        const destination = ["character-creation", "game-assets-creation", "boss-creation", "storyline-engine", "parallax-tiling-map", "items-spawning", "game-loop-engine", "game-controls", "game-settings", "game-physics", "game-ending-cutscene", "credits", "marketplace-system", "game-achievement", "game-leaderboard", "local-coop", "multiplayer-game", "math-stem-physics-quiz", "setup-godot-with-ai", "enemies-ai"].includes(module.slug) ? modulePath(module) : `#module-${module.slug}`;
        return `
        <a class="nav-item ${completedModules.has(module.slug) ? "completed" : ""}" href="${destination}">
          <span class="nav-number">${String(moduleLevel(module)).padStart(2, "0")}</span>
          <span>${copy.title}</span>
          ${completedModules.has(module.slug) ? '<span class="nav-check">✓</span>' : ""}
        </a>
      `;
      },
    )
    .join("");
}

function renderCards(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredModules = modules.filter((module) => {
    const copy = moduleCopy(module);
    return `${copy.title} ${copy.description} ${module.title} ${module.description} ${localizeTag(module.tag)}`.toLowerCase().includes(normalizedQuery);
  });

  moduleGrid.innerHTML = filteredModules
    .map((module) => {
      const copy = moduleCopy(module);
      const complete = completedModules.has(module.slug);
      return `
        <article id="module-${module.slug}" class="module-card ${complete ? "completed" : ""}">
          <div class="module-card-top">
            <span class="module-index">${interfaceCopy[currentLocale].chapter} ${String(moduleLevel(module)).padStart(2, "0")}</span>
            <span class="module-state">${localizeTag(module.tag)}</span>
          </div>
          <span class="module-icon" aria-hidden="true"><span class="module-icon-fallback">${moduleIcons[module.slug] || "✦"}</span><img src="https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/tutorial-web-app/images/module-icons/${module.slug}.webp" alt="" width="112" height="112" loading="lazy" decoding="async" /></span>
          <h3>${copy.title}</h3>
          <p>${copy.description}</p>
          <div class="module-meta"><span>↳ ${module.durationMinutes} ${interfaceCopy[currentLocale].minutes}</span><span>● ${complete ? interfaceCopy[currentLocale].done : interfaceCopy[currentLocale].ready}</span></div>
          ${module.slug === 'math-stem-physics-quiz'
            ? `<span class="quiz-requirement">${complete ? interfaceCopy[currentLocale].quizPassed : interfaceCopy[currentLocale].quizRequirement}</span>`
            : `<button class="complete-button" type="button" data-module="${module.slug}" aria-label="${complete ? interfaceCopy[currentLocale].reopen : interfaceCopy[currentLocale].markDone}">${complete ? interfaceCopy[currentLocale].reopen : interfaceCopy[currentLocale].markDone}</button>`}
          <button class="reset-module-button" type="button" data-module="${module.slug}" aria-label="${interfaceCopy[currentLocale].reset}">${interfaceCopy[currentLocale].reset}</button>
          <a class="card-action" href="${modulePath(module)}" aria-label="${copy.title}">↗</a>
        </article>
      `;
    })
    .join("");

  emptyState.hidden = filteredModules.length > 0;
  moduleGrid.querySelectorAll('.module-icon img').forEach(image => {
    const loaded = () => image.parentElement.classList.add('has-artwork');
    image.addEventListener('load', loaded, { once: true });
    image.addEventListener('error', () => image.remove(), { once: true });
    if (image.complete && image.naturalWidth) loaded();
  });
  emptyState.textContent = interfaceCopy[currentLocale].emptyState;
  moduleGrid.querySelectorAll(".complete-button").forEach((button) => {
    button.addEventListener("click", () => toggleComplete(button.dataset.module).catch(console.error));
  });
}

function renderProgress() {
  const count = completedModules.size;
  const percentage = modules.length ? Math.round((count / modules.length) * 100) : 0;
  completedCount.textContent = count;
  progressValue.textContent = `${percentage}%`;
  progressBar.style.width = `${percentage}%`;
  progressText.textContent = interfaceCopy[currentLocale].progress(count, modules.length);
}

async function toggleComplete(slug) {
  if (slug === 'math-stem-physics-quiz') return;
  const completed = !completedModules.has(slug);
  const response = await fetch(`/api/modules/${encodeURIComponent(slug)}/progress`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ learnerId, completed }),
  });

  if (!response.ok) throw new Error("Unable to save progress.");
  if (completed) completedModules.add(slug);
  else completedModules.delete(slug);
  renderNavigation();
  renderCards(moduleSearch.value);
  renderProgress();
}

window.addEventListener('godot-forge-module-reset', event => {
  const slug = event.detail.slug;
  completedModules.delete(slug);
  const module = modules.find(item => item.slug === slug);
  if (module) module.completed = false;
  renderNavigation();
  renderCards(moduleSearch.value);
  renderProgress();
});

moduleSearch.addEventListener("input", (event) => renderCards(event.target.value));

languageToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-locale]");
  if (button) setLocale(button.dataset.locale);
});

document.querySelector("#menu-toggle").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

moduleNav.addEventListener("click", () => {
  document.querySelector(".sidebar").classList.remove("open");
});

async function initializeApp() {
  try {
    const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
    if (!response.ok) throw new Error("Unable to load tutorial modules.");
    modules = (await response.json()).sort((first, second) => moduleLevel(first) - moduleLevel(second));
    modules.filter((module) => module.completed).forEach((module) => completedModules.add(module.slug));
    moduleCount.textContent = modules.length;
    renderNavigation();
    renderCards();
    renderProgress();
  } catch (error) {
    moduleGrid.innerHTML = `<p class="empty-state">${interfaceCopy[currentLocale].loadError}</p>`;
    emptyState.hidden = true;
  }
}

applyInterfaceCopy();
initializeApp();

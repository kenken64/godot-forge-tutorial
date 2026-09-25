(() => {
  const $ = selector => document.querySelector(selector);
  const canvas = $("#physics-stage");
  const ctx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const WATER_Y = 316;
  const PIXELS_PER_METRE = 25;
  const SWIMMER_START_X = 174;
  const SWIMMER_MIN_X = 122;
  const SWIMMER_MAX_X = WIDTH - 122;
  const SWIMMER_MAX_DEPTH = 195;
  const ROCK_WIDTH = 120;
  const ROCK_HEIGHT = 103;
  const IMPACT_CENTRE_Y = WATER_Y - ROCK_HEIGHT / 2;
  const slug = "game-physics";
  const storageKey = "godot-forge-learner-id";
  const copy = {
    en: {
      pageTitle: "Game Physics · Godot Forge", back: "← GODOT FORGE / LEARNING PATH", chapter: "CHAPTER 11 / GAME PHYSICS", language: "Language",
      eyebrow: "A PHYSICS EXPERIMENT / WATER IMPACT", title: "Drop a boulder. Read the physics.", intro: "Change the height, mass, and gravity. Watch the boulder splash into a forest pool while an explorer swims beside it.",
      ideasLabel: "Physics ideas", gravityTag: "GRAVITY", gravityTitle: "Speed grows during the fall", gravityCopy: "With air resistance ignored, acceleration is constant: v = g × t.", energyTag: "ENERGY", energyTitle: "Height and mass store energy", energyCopy: "The impact energy is E = m × g × h. Mass changes energy, but not ideal fall time.", impactTag: "IMPACT", impactTitle: "Motion meets the water", impactCopy: "The measured fall drives the timing. The splash is a stylized visual response, not a fluid simulation.",
      experimentEyebrow: "INTERACTIVE EXPERIMENT", experimentTitle: "Boulder into water", modelBadge: "ART: GPT IMAGE 2.5 SUNBURST", controlsTitle: "Set up the drop", controlsCopy: "Change one value at a time to see what affects speed and what affects splash energy.", heightLabel: "Drop height", massLabel: "Boulder mass", gravityLabel: "Gravity", drop: "DROP BOULDER ↓", dropAgain: "DROP AGAIN ↓", slowOff: "SLOW MOTION: OFF", slowOn: "SLOW MOTION: ON", controlNote: "The boulder keeps the same visible size so you can compare how mass changes energy without changing the path.", canvasLabel: "Interactive forest pool: swim across the pool with left and right arrows, rise with up, and dive with down", stageCredit: "FOREST POOL / GENERATED ART", swimmerNote: "← → swim across the pool · ↑ surface · ↓ dive · Click the pool after using sliders", depthLabel: "DIVE DEPTH", readoutsLabel: "Physics readouts", timeLabel: "PREDICTED FALL TIME", timeFormula: "t = √(2h / g)", speedLabel: "BOULDER SPEED", speedFormula: "v = g × t; impact: √(2gh)", energyLabel: "IMPACT ENERGY", energyFormula: "E = m × g × h", completionHint: "Make a drop to unlock module completion.", completionReady: "You made a splash. Complete the module when ready.", complete: "COMPLETE MODULE", completed: "MODULE COMPLETED", saved: "Module progress saved.", saveError: "The splash worked, but progress could not be saved. Try again.", ready: "Ready. Press Drop Boulder to start.", falling: "Falling. Watch the live speed rise.", splash: "Splash! Impact speed: {speed} m/s · energy: {energy} J.",
      researchEyebrow: "HOW THE DEMO WORKS", researchTitle: "Physics first, art on top", researchCopy: "The falling position uses constant acceleration. The live speed and energy are calculated from the controls. Water spray and ripples are a visual interpretation of impact energy; real water entry also depends on shape, drag, and fluid flow.", freeFallSource: "OpenStax: Free Fall ↗", energySource: "OpenStax: Gravitational Energy ↗", modelSource: "OpenAI Docs: Sunburst ↗", promptsSummary: "See the exact image prompts", poolPromptTitle: "Forest pool background", boulderPromptTitle: "Transparent boulder sprite", splashPromptTitle: "Transparent splash effect", swimmerPromptTitle: "Swimming explorer sprite", promptError: "Could not load the prompt file."
    },
    zh: {
      pageTitle: "游戏物理 · Godot Forge", back: "← GODOT FORGE / 学习路径", chapter: "第 11 章 / 游戏物理", language: "语言",
      eyebrow: "物理实验 / 水面撞击", title: "让巨石坠落，读懂物理。", intro: "调整高度、质量和重力。观察巨石落入森林水池，探险者在旁边游泳。",
      ideasLabel: "物理概念", gravityTag: "重力", gravityTitle: "下落时速度增加", gravityCopy: "忽略空气阻力时，加速度恒定：v = g × t。", energyTag: "能量", energyTitle: "高度和质量决定能量", energyCopy: "撞击能量为 E = m × g × h。质量改变能量，但不改变理想下落时间。", impactTag: "撞击", impactTitle: "运动与水面相遇", impactCopy: "下落计算决定撞击时刻。水花是示意性的视觉效果，并非流体模拟。",
      experimentEyebrow: "互动实验", experimentTitle: "巨石落水", modelBadge: "图像：GPT IMAGE 2.5 SUNBURST", controlsTitle: "设置下落条件", controlsCopy: "每次改变一个数值，观察什么影响速度，什么影响水花的能量。", heightLabel: "下落高度", massLabel: "巨石质量", gravityLabel: "重力加速度", drop: "让巨石落下 ↓", dropAgain: "再次落下 ↓", slowOff: "慢动作：关", slowOn: "慢动作：开", controlNote: "巨石的显示大小保持不变，便于比较质量如何改变能量而不改变下落轨迹。", canvasLabel: "互动森林水池：按左右方向键游过水池、上键上浮、下键潜水", stageCredit: "森林水池 / 生成图像", swimmerNote: "← → 游过整个水池 · ↑ 上浮 · ↓ 潜水 · 调整滑块后点击水池", depthLabel: "潜水深度", readoutsLabel: "物理读数", timeLabel: "预测下落时间", timeFormula: "t = √(2h / g)", speedLabel: "巨石速度", speedFormula: "v = g × t；撞击时：√(2gh)", energyLabel: "撞击能量", energyFormula: "E = m × g × h", completionHint: "完成一次下落后即可完成本模块。", completionReady: "水花已出现。准备好后可完成本模块。", complete: "完成模块", completed: "模块已完成", saved: "模块进度已保存。", saveError: "水花已出现，但无法保存进度，请重试。", ready: "已准备好。按下按钮让巨石落下。", falling: "正在下落。观察实时速度上升。", splash: "水花！撞击速度：{speed} m/s · 能量：{energy} J。",
      researchEyebrow: "演示原理", researchTitle: "先有物理，再加画面", researchCopy: "巨石的位置按恒定加速度计算。实时速度和能量由控制值计算。水滴与涟漪只是撞击能量的视觉表现；真实入水过程还受形状、阻力和流体流动影响。", freeFallSource: "OpenStax：自由落体 ↗", energySource: "OpenStax：重力势能 ↗", modelSource: "OpenAI 文档：Sunburst ↗", promptsSummary: "查看原始图像提示词", poolPromptTitle: "森林水池背景", boulderPromptTitle: "透明巨石精灵图", splashPromptTitle: "透明水花特效", swimmerPromptTitle: "游泳的探险者精灵图", promptError: "无法加载提示词文件。"
    },
    ms: {
      pageTitle: "Fizik Permainan · Godot Forge", back: "← GODOT FORGE / LALUAN PEMBELAJARAN", chapter: "BAB 11 / FIZIK PERMAINAN", language: "Bahasa",
      eyebrow: "EKSPERIMEN FIZIK / HENTAMAN AIR", title: "Jatuhkan batu. Lihat fizik beraksi.", intro: "Ubah ketinggian, jisim dan graviti. Lihat batu terpercik ke kolam hutan ketika seorang penjelajah berenang di sebelahnya.",
      ideasLabel: "Idea fizik", gravityTag: "GRAVITI", gravityTitle: "Laju meningkat ketika jatuh", gravityCopy: "Jika rintangan udara diabaikan, pecutan adalah malar: v = g × t.", energyTag: "TENAGA", energyTitle: "Ketinggian dan jisim menyimpan tenaga", energyCopy: "Tenaga hentaman ialah E = m × g × h. Jisim mengubah tenaga, tetapi bukan masa jatuh ideal.", impactTag: "HENTAMAN", impactTitle: "Gerakan bertemu air", impactCopy: "Pengiraan jatuhan menentukan masa hentaman. Percikan ialah kesan visual bergaya, bukan simulasi bendalir.",
      experimentEyebrow: "EKSPERIMEN INTERAKTIF", experimentTitle: "Batu jatuh ke dalam air", modelBadge: "SENI: GPT IMAGE 2.5 SUNBURST", controlsTitle: "Tetapkan jatuhan", controlsCopy: "Ubah satu nilai setiap kali untuk melihat apa yang mempengaruhi laju dan tenaga percikan.", heightLabel: "Ketinggian jatuhan", massLabel: "Jisim batu", gravityLabel: "Graviti", drop: "JATUHKAN BATU ↓", dropAgain: "JATUHKAN LAGI ↓", slowOff: "GERAK PERLAHAN: MATI", slowOn: "GERAK PERLAHAN: HIDUP", controlNote: "Saiz batu pada skrin kekal sama supaya anda boleh membandingkan kesan jisim dan tenaga tanpa mengubah laluannya.", canvasLabel: "Kolam hutan interaktif: berenang merentasi kolam dengan anak panah kiri dan kanan, naik dengan atas, dan menyelam dengan bawah", stageCredit: "KOLAM HUTAN / SENI DIJANA", swimmerNote: "← → berenang merentasi kolam · ↑ naik · ↓ menyelam · Klik kolam selepas melaras gelangsar", depthLabel: "KEDALAMAN", readoutsLabel: "Bacaan fizik", timeLabel: "MASA JATUH RAMALAN", timeFormula: "t = √(2h / g)", speedLabel: "LAJU BATU", speedFormula: "v = g × t; hentaman: √(2gh)", energyLabel: "TENAGA HENTAMAN", energyFormula: "E = m × g × h", completionHint: "Jatuhkan batu sekali untuk membuka penyiapan modul.", completionReady: "Percikan berjaya. Selesaikan modul apabila sedia.", complete: "SELESAIKAN MODUL", completed: "MODUL SELESAI", saved: "Kemajuan modul disimpan.", saveError: "Percikan berlaku, tetapi kemajuan tidak dapat disimpan. Cuba lagi.", ready: "Sedia. Tekan Jatuhkan Batu untuk mula.", falling: "Sedang jatuh. Perhatikan laju semasa meningkat.", splash: "Percikan! Laju hentaman: {speed} m/s · tenaga: {energy} J.",
      researchEyebrow: "CARA DEMO BERFUNGSI", researchTitle: "Fizik dahulu, seni di atas", researchCopy: "Kedudukan jatuhan menggunakan pecutan malar. Laju semasa dan tenaga dikira daripada kawalan. Semburan air dan riak ialah gambaran visual tenaga hentaman; kemasukan sebenar ke dalam air turut bergantung pada bentuk, seretan dan aliran bendalir.", freeFallSource: "OpenStax: Jatuh Bebas ↗", energySource: "OpenStax: Tenaga Graviti ↗", modelSource: "Dokumen OpenAI: Sunburst ↗", promptsSummary: "Lihat prompt imej asal", poolPromptTitle: "Latar kolam hutan", boulderPromptTitle: "Sprite batu berlatar lutsinar", splashPromptTitle: "Kesan percikan berlatar lutsinar", swimmerPromptTitle: "Sprite penjelajah berenang", promptError: "Fail prompt tidak dapat dimuatkan."
    }
  };

  const fallbackLocale = "en";
  let locale = localStorage.getItem("godot-forge-locale") || fallbackLocale;
  if (!copy[locale]) locale = fallbackLocale;
  let learnerId = localStorage.getItem(storageKey);
  if (!learnerId) {
    learnerId = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(storageKey, learnerId);
  }

  const controls = [$("#height-input"), $("#mass-input"), $("#gravity-input")];
  const sceneImage = new Image();
  const rockImage = new Image();
  const splashImage = new Image();
  const swimmerImage = new Image();
  for (const image of [sceneImage, rockImage, splashImage, swimmerImage]) image.crossOrigin = "anonymous";
  let swimmerParts = null;
  sceneImage.src = "https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-physics/images/forest-pool.webp";
  rockImage.src = "https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-physics/images/boulder.webp";
  splashImage.src = "https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-physics/images/water-splash.webp";
  swimmerImage.src = "https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-physics/images/swimmer.webp";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let state = "ready";
  let completed = false;
  let hasSplashed = false;
  let slowMotion = false;
  let elapsed = 0;
  let impactElapsed = 0;
  let particles = [];
  let lastFrame = performance.now();
  let renderClock = 0;
  const swimmer = { x: SWIMMER_START_X, depth: 0, facing: 1, phase: 0, strokePhase: 0, strokePower: 0, pitch: 0, moving: false };
  const swimKeys = new Set();

  const values = () => ({ height: Number(controls[0].value), mass: Number(controls[1].value), gravity: Number(controls[2].value) });
  const results = ({ height, mass, gravity }) => ({ time: Math.sqrt(2 * height / gravity), impactSpeed: Math.sqrt(2 * gravity * height), energy: mass * gravity * height });
  const message = key => copy[locale][key] || copy.en[key];
  const number = value => new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale === "ms" ? "ms-MY" : "en-US", { maximumFractionDigits: 0 }).format(value);
  const speedText = speed => `${speed.toFixed(1)} m/s`;

  function setStatus() {
    const { impactSpeed, energy } = results(values());
    $("#stage-status").textContent = state === "ready" ? message("ready") : state === "falling" ? message("falling") : message("splash").replace("{speed}", impactSpeed.toFixed(1)).replace("{energy}", number(Math.round(energy)));
  }

  function updateControls() {
    const { height, mass, gravity } = values();
    const { time, energy } = results(values());
    $("#height-value").textContent = `${height.toFixed(1)} m`;
    $("#mass-value").textContent = `${mass} kg`;
    $("#gravity-value").textContent = `${gravity.toFixed(1)} m/s²`;
    $("#time-value").textContent = `${time.toFixed(2)} s`;
    $("#energy-value").textContent = `${number(Math.round(energy))} J`;
    if (state === "ready") $("#speed-value").textContent = speedText(0);
  }

  function updateButtons() {
    const busy = state === "falling" || state === "splash";
    controls.forEach(control => { control.disabled = busy; });
    $("#drop-button").disabled = busy;
    $("#drop-button").textContent = message(state === "settled" ? "dropAgain" : "drop");
    $("#slow-button").textContent = message(slowMotion ? "slowOn" : "slowOff");
    $("#slow-button").setAttribute("aria-pressed", String(slowMotion));
    $("#complete-module").disabled = !hasSplashed || completed;
    $("#complete-module").textContent = message(completed ? "completed" : "complete");
    $("#completion-status").textContent = completed ? message("saved") : hasSplashed ? message("completionReady") : message("completionHint");
  }

  function applyLocale() {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
    document.title = message("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = message(node.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach(node => { node.setAttribute("aria-label", message(node.dataset.i18nAria)); });
    document.querySelectorAll("[data-locale]").forEach(button => { button.setAttribute("aria-pressed", String(button.dataset.locale === locale)); });
    updateControls();
    updateButtons();
    setStatus();
  }

  function resetScene() {
    state = "ready";
    elapsed = 0;
    impactElapsed = 0;
    particles = [];
    $("#speed-value").textContent = speedText(0);
    updateControls();
    updateButtons();
    setStatus();
  }

  function makeParticles() {
    const { energy } = results(values());
    const strength = Math.min(1.55, Math.max(.65, Math.sqrt(energy / 3500)));
    let seed = Math.round(energy * 10) || 1;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; };
    const count = reducedMotion ? 12 : Math.round(26 * strength);
    particles = Array.from({ length: count }, (_, index) => {
      const side = index % 2 ? 1 : -1;
      return { x: WIDTH / 2 + side * random() * 22, vx: side * (35 + random() * 170) * strength, vy: -(90 + random() * 175) * strength, size: 2 + random() * 4, delay: random() * .13, blue: random() > .42 };
    });
  }

  function startDrop() {
    state = "falling";
    elapsed = 0;
    impactElapsed = 0;
    particles = [];
    $("#speed-value").textContent = speedText(0);
    updateButtons();
    setStatus();
  }

  function impact() {
    state = "splash";
    hasSplashed = true;
    impactElapsed = 0;
    makeParticles();
    $("#speed-value").textContent = speedText(results(values()).impactSpeed);
    updateButtons();
    setStatus();
  }

  function drawBackdrop() {
    if (sceneImage.complete && sceneImage.naturalWidth) ctx.drawImage(sceneImage, 0, 0, WIDTH, HEIGHT);
    else {
      const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      gradient.addColorStop(0, "#32634f"); gradient.addColorStop(.53, "#5b9b7e"); gradient.addColorStop(.54, "#1b7680"); gradient.addColorStop(1, "#0c323e");
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }

  function drawRockSprite(x, y) {
    if (rockImage.complete && rockImage.naturalWidth) ctx.drawImage(rockImage, x - ROCK_WIDTH / 2, y - ROCK_HEIGHT / 2, ROCK_WIDTH, ROCK_HEIGHT);
    else {
      ctx.fillStyle = "#9ba6a1";
      ctx.beginPath(); ctx.ellipse(x, y, ROCK_WIDTH / 2, ROCK_HEIGHT / 2, -.12, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawBoulder(y) {
    const x = WIDTH / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, WIDTH, WATER_Y); ctx.clip(); drawRockSprite(x, y); ctx.restore();
    if (y + ROCK_HEIGHT / 2 > WATER_Y) {
      ctx.save(); ctx.beginPath(); ctx.rect(0, WATER_Y, WIDTH, HEIGHT - WATER_Y); ctx.clip(); ctx.globalAlpha = .62; drawRockSprite(x, y); ctx.restore();
    }
  }

  function updateSwimmer(delta) {
    const horizontal = Number(swimKeys.has("ArrowRight")) - Number(swimKeys.has("ArrowLeft"));
    const vertical = Number(swimKeys.has("ArrowDown")) - Number(swimKeys.has("ArrowUp"));
    swimmer.moving = horizontal !== 0 || vertical !== 0;
    if (horizontal) swimmer.facing = horizontal;
    swimmer.x = Math.max(SWIMMER_MIN_X, Math.min(SWIMMER_MAX_X, swimmer.x + horizontal * 175 * delta));
    swimmer.depth = Math.max(0, Math.min(SWIMMER_MAX_DEPTH, swimmer.depth + vertical * 125 * delta));
    swimmer.pitch += (vertical * .12 - swimmer.pitch) * Math.min(1, delta * 9);
    swimmer.phase += delta * (swimmer.moving ? 11 : reducedMotion ? 0 : 3);
    if (swimmer.moving) swimmer.strokePhase += delta * 7;
    swimmer.strokePower += (Number(swimmer.moving) - swimmer.strokePower) * Math.min(1, delta * 12);
    $("#swimmer-depth").textContent = `${(swimmer.depth / PIXELS_PER_METRE).toFixed(1)} m`;
    canvas.dataset.swimmerX = swimmer.x.toFixed(1);
    canvas.dataset.swimmerDepth = swimmer.depth.toFixed(1);
    canvas.dataset.swimmerFacing = swimmer.facing === 1 ? "right" : "left";
    canvas.dataset.swimmerStroke = (swimmer.strokePhase % (Math.PI * 2)).toFixed(2);
  }

  function setupSwimmerParts() {
    if (swimmerParts || !swimmerImage.naturalWidth) return;
    const width = swimmerImage.naturalWidth;
    const height = swimmerImage.naturalHeight;
    const regions = {
      upperLeg: [[0, 126], [168, 132], [235, 157], [257, 192], [265, 218], [165, 236], [0, 230]],
      lowerLeg: [[0, 219], [135, 204], [248, 209], [270, 233], [272, 275], [226, 291], [0, 330]],
      backArm: [[220, 132], [274, 129], [320, 143], [372, 136], [425, 147], [430, 180], [390, 204], [312, 202], [242, 188], [220, 165]],
      frontArm: [[575, 153], [625, 150], [652, 130], [708, 119], [768, 116], [768, 188], [706, 185], [639, 192], [575, 194]]
    };
    const makeCanvas = () => {
      const layer = document.createElement("canvas");
      layer.width = width;
      layer.height = height;
      layer.getContext("2d").drawImage(swimmerImage, 0, 0);
      return layer;
    };
    const fillRegion = (partContext, points) => {
      partContext.beginPath();
      points.forEach(([x, y], index) => { if (index) partContext.lineTo(x, y); else partContext.moveTo(x, y); });
      partContext.closePath();
      partContext.fill();
    };
    const body = makeCanvas();
    const bodyContext = body.getContext("2d");
    bodyContext.globalCompositeOperation = "destination-out";
    Object.values(regions).forEach(points => fillRegion(bodyContext, points));
    swimmerParts = { body };
    for (const [name, points] of Object.entries(regions)) {
      const layer = makeCanvas();
      const layerContext = layer.getContext("2d");
      layerContext.globalCompositeOperation = "destination-in";
      fillRegion(layerContext, points);
      swimmerParts[name] = layer;
    }
  }

  function drawSwimmerImage(width, height) {
    if (!swimmerParts) { ctx.drawImage(swimmerImage, -width / 2, -height / 2, width, height); return; }
    const scale = width / swimmerImage.naturalWidth;
    const stroke = Math.sin(swimmer.strokePhase) * swimmer.strokePower;
    const armAngle = (swimmer.strokePhase % (Math.PI * 2)) * swimmer.strokePower;
    const reach = (1 - Math.cos(swimmer.strokePhase)) / 2 * swimmer.strokePower;
    const drawPart = (name, pivotX, pivotY, angle, shiftX = 0, shiftY = 0) => {
      ctx.save();
      ctx.translate((pivotX - swimmerImage.naturalWidth / 2) * scale + shiftX, (pivotY - swimmerImage.naturalHeight / 2) * scale + shiftY);
      ctx.rotate(angle);
      ctx.drawImage(swimmerParts[name], -pivotX * scale, -pivotY * scale, width, height);
      ctx.restore();
    };
    drawPart("upperLeg", 255, 204, stroke * .18);
    drawPart("lowerLeg", 266, 244, -stroke * .22);
    ctx.drawImage(swimmerParts.body, -width / 2, -height / 2, width, height);
    // Both arms turn through a stroke together. Because one starts behind the
    // body and the other reaches ahead, half a turn swaps their reach: the
    // back hand comes forward above water as the front hand pulls back below.
    drawPart("frontArm", 585, 165, armAngle, -reach * 27, reach * 11);
    drawPart("backArm", 407, 165, armAngle, reach * 35, -reach * 7);
  }

  function drawSwimmer() {
    if (!swimmerImage.complete || !swimmerImage.naturalWidth) return;
    const width = 238;
    const height = width * swimmerImage.naturalHeight / swimmerImage.naturalWidth;
    const x = swimmer.x;
    const y = WATER_Y - 14 + swimmer.depth + (reducedMotion ? 0 : Math.sin(swimmer.phase * 2) * (swimmer.moving ? 2 : 1));

    if (swimmer.depth < 38) {
      ctx.save();
      ctx.strokeStyle = "rgba(181, 249, 239, .78)";
      ctx.lineWidth = 2;
      for (let index = 0; index < 3; index++) {
        const age = (swimmer.phase / (Math.PI * 2) * .45 + index / 3) % 1;
        ctx.globalAlpha = (1 - age) * (1 - swimmer.depth / 38);
        ctx.beginPath();
        ctx.ellipse(x - swimmer.facing * (66 + age * 48), WATER_Y + 4, 15 + age * 28, 4 + age * 3, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    } else {
      ctx.save(); ctx.beginPath(); ctx.rect(0, WATER_Y, WIDTH, HEIGHT - WATER_Y); ctx.clip();
      ctx.fillStyle = "rgba(187, 255, 245, .75)";
      for (let index = 0; index < 5; index++) {
        const age = (renderClock * .55 + index / 5) % 1;
        const bubbleX = x - swimmer.facing * (50 + index * 12) + Math.sin(index * 3 + renderClock * 2) * 5;
        const bubbleY = y + 20 - age * 56;
        ctx.globalAlpha = (1 - age) * .8;
        ctx.beginPath(); ctx.arc(bubbleX, bubbleY, 2 + index % 3, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    const drawBody = () => {
      ctx.translate(x, y);
      ctx.scale(swimmer.facing, 1);
      ctx.rotate(swimmer.pitch + (reducedMotion ? 0 : Math.sin(swimmer.phase) * .025));
      drawSwimmerImage(width, height);
    };
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, WIDTH, WATER_Y); ctx.clip(); drawBody(); ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(0, WATER_Y, WIDTH, HEIGHT - WATER_Y); ctx.clip();
    ctx.globalAlpha = .68;
    drawBody();
    ctx.restore();
  }

  function drawHeightGuide(y) {
    const x = WIDTH / 2 + 91;
    ctx.save();
    ctx.strokeStyle = "#d6f6cc"; ctx.fillStyle = "#f0ffeb"; ctx.lineWidth = 2; ctx.setLineDash([5, 7]);
    ctx.beginPath(); ctx.moveTo(x, y + ROCK_HEIGHT / 2 + 5); ctx.lineTo(x, WATER_Y - 5); ctx.stroke();
    ctx.setLineDash([]); ctx.font = '500 14px "DM Mono", monospace';
    ctx.shadowColor = "#102920"; ctx.shadowBlur = 8;
    ctx.fillText(`h = ${values().height.toFixed(1)} m`, x + 12, Math.max(48, (y + ROCK_HEIGHT / 2 + WATER_Y) / 2));
    ctx.restore();
  }

  function drawWater() {
    ctx.save();
    ctx.strokeStyle = "rgba(179, 252, 235, .8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= WIDTH; x += 12) {
      const y = WATER_Y + Math.sin(x * .027 + renderClock * 1.5) * 1.5;
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawSplash() {
    if (state !== "splash" && state !== "settled") return;
    const t = impactElapsed;
    const { energy } = results(values());
    const strength = Math.min(1.55, Math.max(.65, Math.sqrt(energy / 3500)));
    if (t < 1.15 && splashImage.complete && splashImage.naturalWidth) {
      const width = 360 * strength * (.7 + .3 * Math.min(1, t / .18));
      const height = width * splashImage.naturalHeight / splashImage.naturalWidth;
      ctx.save();
      ctx.globalAlpha = Math.min(1, t / .09) * Math.max(0, 1 - t / 1.15);
      ctx.drawImage(splashImage, WIDTH / 2 - width / 2, WATER_Y + 20 - height, width, height);
      ctx.restore();
    }
    if (t < 1.8) {
      for (let ring = 0; ring < 3; ring++) {
        const age = t - ring * .24;
        if (age < 0 || age > 1.3) continue;
        ctx.save();
        ctx.strokeStyle = `rgba(184, 255, 239, ${(.7 * (1 - age / 1.3)).toFixed(3)})`;
        ctx.lineWidth = 4 - ring * .7;
        ctx.beginPath(); ctx.ellipse(WIDTH / 2, WATER_Y + 3, 28 + age * 110 * strength, 6 + age * 9, 0, Math.PI, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
    }
    if (t < .7) {
      const fade = 1 - t / .7;
      ctx.save(); ctx.fillStyle = `rgba(156, 242, 224, ${(.42 * fade).toFixed(3)})`;
      ctx.beginPath(); ctx.ellipse(WIDTH / 2, WATER_Y - 5, 34 + 48 * strength * t, 8 + 30 * strength * Math.sin(Math.PI * t / .7), 0, Math.PI, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    for (const drop of particles) {
      const age = t - drop.delay;
      if (age < 0 || age > 1.6) continue;
      const x = drop.x + drop.vx * age;
      const y = WATER_Y + drop.vy * age + .5 * 390 * age * age;
      if (y > WATER_Y + 5) continue;
      ctx.save(); ctx.globalAlpha = Math.max(0, 1 - age / 1.6); ctx.fillStyle = drop.blue ? "#aaf7ef" : "#e7fff8";
      ctx.beginPath(); ctx.arc(x, y, drop.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackdrop();
    const { height, gravity } = values();
    let y = IMPACT_CENTRE_Y - height * PIXELS_PER_METRE;
    if (state === "falling") y += .5 * gravity * elapsed * elapsed * PIXELS_PER_METRE;
    if (state === "splash" || state === "settled") y = IMPACT_CENTRE_Y + 108 * (1 - Math.exp(-impactElapsed * 2.4));
    if (state === "ready" || state === "falling") drawHeightGuide(y);
    drawBoulder(y);
    drawSwimmer();
    drawWater();
    drawSplash();
  }

  function frame(now) {
    const delta = Math.min(.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    const simulatedDelta = delta * (slowMotion ? .35 : 1);
    renderClock += simulatedDelta;
    updateSwimmer(delta);
    if (state === "falling") {
      elapsed = Math.min(results(values()).time, elapsed + simulatedDelta);
      $("#speed-value").textContent = speedText(values().gravity * elapsed);
      if (elapsed >= results(values()).time) impact();
    } else if (state === "splash") {
      impactElapsed += simulatedDelta;
      if (impactElapsed >= 2.2) { state = "settled"; updateButtons(); }
    }
    drawFrame();
    requestAnimationFrame(frame);
  }

  controls.forEach(control => control.addEventListener("input", () => { resetScene(); }));
  const arrowKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);
  window.addEventListener("keydown", event => {
    if (!arrowKeys.has(event.key)) return;
    const target = event.target;
    if (target instanceof HTMLElement && (target.matches("input, textarea, select") || target.isContentEditable)) return;
    event.preventDefault();
    swimKeys.add(event.key);
  });
  window.addEventListener("keyup", event => {
    if (!arrowKeys.has(event.key) || !swimKeys.has(event.key)) return;
    event.preventDefault();
    swimKeys.delete(event.key);
  });
  window.addEventListener("blur", () => swimKeys.clear());
  document.addEventListener("visibilitychange", () => { if (document.hidden) swimKeys.clear(); });
  document.addEventListener("focusin", event => { if (event.target.matches("input, textarea, select")) swimKeys.clear(); });
  canvas.addEventListener("pointerdown", () => canvas.focus());
  swimmerImage.addEventListener("load", setupSwimmerParts);
  if (swimmerImage.complete) setupSwimmerParts();
  $("#drop-button").addEventListener("click", startDrop);
  $("#slow-button").addEventListener("click", () => { slowMotion = !slowMotion; updateButtons(); });
  $("#complete-module").addEventListener("click", async () => {
    if (!hasSplashed || completed) return;
    const button = $("#complete-module"); button.disabled = true;
    try {
      const response = await fetch(`/api/modules/${slug}/progress`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ learnerId, completed: true }) });
      if (!response.ok) throw new Error("save failed");
      completed = true;
      updateButtons();
      window.showToast?.(message("saved"), "success");
    } catch {
      button.disabled = false;
      $("#completion-status").textContent = message("saveError");
      window.showToast?.(message("saveError"), "error");
    }
  });
  document.querySelectorAll("[data-locale]").forEach(button => button.addEventListener("click", () => {
    locale = button.dataset.locale;
    localStorage.setItem("godot-forge-locale", locale);
    applyLocale();
  }));
  window.addEventListener("godot-forge-module-reset", event => {
    if (event.detail?.slug !== slug) return;
    completed = false;
    hasSplashed = false;
    resetScene();
  });

  async function loadProgress() {
    try {
      const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
      if (!response.ok) return;
      const modules = await response.json();
      completed = modules.find(module => module.slug === slug)?.completed === true;
      if (completed) hasSplashed = true;
      updateButtons();
    } catch { /* The experiment still works when progress is unavailable. */ }
  }

  async function loadPrompts() {
    for (const [id, filename] of [["pool-prompt", "forest-pool.txt"], ["boulder-prompt", "boulder.txt"], ["splash-prompt", "water-splash.txt"], ["swimmer-prompt", "swimmer.txt"]]) {
      try {
        const response = await fetch(`/game-physics/art-prompts/${filename}`);
        if (!response.ok) throw new Error("prompt unavailable");
        $(`#${id}`).textContent = await response.text();
      } catch { $(`#${id}`).textContent = message("promptError"); }
    }
  }

  applyLocale();
  loadProgress();
  loadPrompts();
  requestAnimationFrame(frame);
})();

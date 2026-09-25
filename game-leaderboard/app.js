(() => {
  const $ = selector => document.querySelector(selector);
  const canvas = $('#leaderboard-stage');
  const ctx = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const FLOOR_Y = 385;
  const WORLD_WIDTH = 1850;
  const START_X = 120;
  const HEART_X = 940;
  const HEART_Y = FLOOR_Y - 59;
  const coins = Array.from({ length: 10 }, (_, id) => ({ id, x: 285 + id * 145, y: FLOOR_Y - 59 - (id % 3 === 1 ? 9 : 0) }));
  const slug = 'game-leaderboard';
  const learnerKey = 'godot-forge-learner-id';
  const copy = {
    en: {
      pageTitle: 'Leaderboards · Godot Forge', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 16 / LEADERBOARDS', language: 'Language', eyebrow: 'PLAYABLE SYSTEM / SCORING', title: 'Climb the board.', intro: 'Collect all 10 gold coins and the heart. Every pickup adds points; a finished run reveals your place on the animated leaderboard.', tabsLabel: 'Leaderboard module views', playTab: 'SCORE RUN', boardTab: 'LEADERBOARD', arenaEyebrow: 'DUSK RUN / SCORE CHALLENGE', canvasLabel: 'Move through the forest with left and right arrows or A and D, collect ten gold coins and one heart for points. Space or up jumps.', hudLabel: 'Score run progress', goldLabel: 'GOLD', heartLabel: 'HEART', scoreLabel: 'SCORE', unlockedLabel: 'LEADERBOARD UNLOCKED', revealTitle: '150 points!', revealDetail: 'Your result is joining the ranking.', touchControlsLabel: 'Touch game controls', leftControl: 'Move left', rightControl: 'Move right', jumpControl: 'Jump', jumpLabel: 'JUMP', controlsHelp: '← → or A / D to move · Space / ↑ to jump · touch buttons work too.', missionEyebrow: 'SCORING RULES', missionTitle: 'Every pickup counts.', goldMission: '10 gold coins', goldMissionCopy: '+10 points each · 100 points total', heartMission: '1 heart', heartMissionCopy: '+50 points · finish with 150', runLabel: 'RUN PROGRESS', viewBoard: 'VIEW LEADERBOARD →', completionHint: 'Collect all 11 pickups to reveal the leaderboard.', completionReady: 'Your score is ranked. Complete the module when ready.', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETED', saved: 'Leaderboard progress saved.', saveError: 'Progress could not be saved. Try again.', boardEyebrow: 'PRACTICE RANKING', boardTitle: 'Leaderboard', boardIntro: 'Finish the run to reveal your result among three demo rivals.', boardLockedAria: 'Leaderboard locked', boardEarnedAria: 'Leaderboard unlocked', locked: 'LOCKED', ranked: 'RANKED', lockedTitle: 'Your result is waiting.', lockedDetail: 'Collect 10 gold and the heart to bring this leaderboard into color.', earnedTitle: 'You reached the top.', earnedDetail: 'All 11 pickups collected · 150 points.', rankLabel: 'RANK', playerLabel: 'PLAYER', pointsLabel: 'POINTS', rankingLabel: 'Practice ranking', you: 'YOU', pointsShort: 'PTS', boardNote: "Demo rivals make this a local practice ranking. Your saved result belongs to this browser's learner profile.", backToPlay: '← BACK TO THE RUN', lessonEyebrow: 'HOW IT WORKS', lessonTitle: 'A clear rule makes a fair ranking.', ruleCopy: 'A gold coin is worth 10 points. The heart is worth 50. The finished score is always 150.', saveCopy: 'Each unique pickup is saved once. The result and its color return when the page reloads.', artCredit: 'Arena and leaderboard crest generated with GPT Image 2.5 Sunburst. Coin, heart, and explorer reuse Sunburst game art.', arenaPrompt: 'Arena prompt', crestPrompt: 'Crest prompt', statusStart: 'Move right and collect every pickup.', statusGold: '{count} / 10 gold collected · {score} points.', statusHeart: 'Heart collected! +50 points · {score} total.', statusAll: '150 points! Your leaderboard result is ready.'
    },
    zh: {
      pageTitle: '排行榜 · Godot Forge', back: '← GODOT FORGE / 学习路径', chapter: '第 16 章 / 排行榜', language: '语言', eyebrow: '可玩系统 / 计分', title: '登上排行榜。', intro: '收集全部 10 枚金币和一颗爱心。每件道具都增加分数；完成挑战后，你的名次将以动画呈现在排行榜上。', tabsLabel: '排行榜模块页面', playTab: '计分挑战', boardTab: '排行榜', arenaEyebrow: '黄昏跑酷 / 计分挑战', canvasLabel: '用左右方向键或 A、D 在森林移动，收集十枚金币和一颗爱心得分。空格或上方向键跳跃。', hudLabel: '挑战进度', goldLabel: '金币', heartLabel: '爱心', scoreLabel: '分数', unlockedLabel: '排行榜已解锁', revealTitle: '150 分！', revealDetail: '你的成绩正在进入排行。', touchControlsLabel: '触控游戏按钮', leftControl: '向左移动', rightControl: '向右移动', jumpControl: '跳跃', jumpLabel: '跳跃', controlsHelp: '← → 或 A / D 移动 · 空格 / ↑ 跳跃 · 也可使用触控按钮。', missionEyebrow: '计分规则', missionTitle: '每件道具都计分。', goldMission: '10 枚金币', goldMissionCopy: '每枚 +10 分 · 共 100 分', heartMission: '1 颗爱心', heartMissionCopy: '+50 分 · 满分 150', runLabel: '挑战进度', viewBoard: '查看排行榜 →', completionHint: '收集全部 11 件道具以解锁排行榜。', completionReady: '你的分数已上榜。准备好后完成模块。', complete: '完成模块', completed: '模块已完成', saved: '排行榜进度已保存。', saveError: '无法保存进度，请重试。', boardEyebrow: '练习排名', boardTitle: '排行榜', boardIntro: '完成挑战，查看你与三位示例对手的名次。', boardLockedAria: '排行榜未解锁', boardEarnedAria: '排行榜已解锁', locked: '未解锁', ranked: '已上榜', lockedTitle: '你的成绩仍在等待。', lockedDetail: '收集 10 枚金币和爱心，让排行榜恢复彩色。', earnedTitle: '你登上榜首！', earnedDetail: '已收集全部 11 件道具 · 150 分。', rankLabel: '名次', playerLabel: '玩家', pointsLabel: '分数', rankingLabel: '练习排名', you: '你', pointsShort: '分', boardNote: '示例对手用于本地练习排名。你的成绩保存在此浏览器的学习者档案中。', backToPlay: '← 返回挑战', lessonEyebrow: '运作方式', lessonTitle: '清晰的规则让排名更公平。', ruleCopy: '每枚金币得 10 分，爱心得 50 分；完成挑战共 150 分。', saveCopy: '每件独特道具只计分一次。刷新页面后，成绩与颜色仍会保留。', artCredit: '场景和排行榜徽章由 GPT Image 2.5 Sunburst 生成；金币、爱心和探险者复用 Sunburst 游戏素材。', arenaPrompt: '场景提示词', crestPrompt: '徽章提示词', statusStart: '向右移动，收集所有道具。', statusGold: '已收集 {count} / 10 枚金币 · {score} 分。', statusHeart: '爱心已收集！+50 分 · 共 {score} 分。', statusAll: '150 分！你的排行榜成绩已就绪。'
    },
    ms: {
      pageTitle: 'Papan Pendahulu · Godot Forge', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 16 / PAPAN PENDAHULU', language: 'Bahasa', eyebrow: 'SISTEM BOLEH MAIN / MARKAH', title: 'Naik ke puncak.', intro: 'Kumpul kesemua 10 syiling emas dan satu hati. Setiap item menambah mata; larian lengkap memaparkan kedudukan anda pada papan pendahulu beranimasi.', tabsLabel: 'Paparan modul papan pendahulu', playTab: 'LARIAN MARKAH', boardTab: 'PAPAN PENDAHULU', arenaEyebrow: 'LARIAN SENJA / CABARAN MARKAH', canvasLabel: 'Bergerak di hutan dengan anak panah kiri dan kanan atau A dan D, kumpul sepuluh syiling emas dan satu hati untuk mata. Space atau atas untuk melompat.', hudLabel: 'Kemajuan larian', goldLabel: 'EMAS', heartLabel: 'HATI', scoreLabel: 'MATA', unlockedLabel: 'PAPAN PENDAHULU DIBUKA', revealTitle: '150 mata!', revealDetail: 'Keputusan anda masuk ke dalam kedudukan.', touchControlsLabel: 'Kawalan permainan sentuh', leftControl: 'Gerak ke kiri', rightControl: 'Gerak ke kanan', jumpControl: 'Lompat', jumpLabel: 'LOMPAT', controlsHelp: '← → atau A / D untuk bergerak · Space / ↑ untuk melompat · butang sentuh juga tersedia.', missionEyebrow: 'PERATURAN MARKAH', missionTitle: 'Setiap item dikira.', goldMission: '10 syiling emas', goldMissionCopy: '+10 mata setiap satu · 100 mata', heartMission: '1 hati', heartMissionCopy: '+50 mata · tamat dengan 150', runLabel: 'KEMAJUAN LARIAN', viewBoard: 'LIHAT PAPAN PENDAHULU →', completionHint: 'Kumpul kesemua 11 item untuk membuka papan pendahulu.', completionReady: 'Markah anda sudah tersenarai. Selesaikan modul apabila sedia.', complete: 'SELESAIKAN MODUL', completed: 'MODUL SELESAI', saved: 'Kemajuan papan pendahulu disimpan.', saveError: 'Kemajuan tidak dapat disimpan. Cuba lagi.', boardEyebrow: 'KEDUDUKAN LATIHAN', boardTitle: 'Papan Pendahulu', boardIntro: 'Tamatkan larian untuk melihat keputusan anda bersama tiga pesaing contoh.', boardLockedAria: 'Papan pendahulu terkunci', boardEarnedAria: 'Papan pendahulu dibuka', locked: 'TERKUNCI', ranked: 'TERSENARAI', lockedTitle: 'Keputusan anda masih menunggu.', lockedDetail: 'Kumpul 10 emas dan hati untuk mewarnakan papan pendahulu.', earnedTitle: 'Anda di tempat teratas.', earnedDetail: 'Kesemua 11 item dikumpul · 150 mata.', rankLabel: 'TEMPAT', playerLabel: 'PEMAIN', pointsLabel: 'MATA', rankingLabel: 'Kedudukan latihan', you: 'ANDA', pointsShort: 'MATA', boardNote: 'Pesaing contoh menjadikan ini kedudukan latihan setempat. Keputusan anda disimpan untuk profil pelajar pelayar ini.', backToPlay: '← KEMBALI KE LARIAN', lessonEyebrow: 'CARA IA BERFUNGSI', lessonTitle: 'Peraturan jelas memberi kedudukan adil.', ruleCopy: 'Setiap syiling emas bernilai 10 mata. Hati bernilai 50 mata. Markah tamat sentiasa 150.', saveCopy: 'Setiap item unik disimpan sekali. Keputusan dan warnanya kembali apabila halaman dimuat semula.', artCredit: 'Arena dan lambang papan pendahulu dijana dengan GPT Image 2.5 Sunburst. Emas, hati dan penjelajah menggunakan semula seni permainan Sunburst.', arenaPrompt: 'Prom arena', crestPrompt: 'Prom lambang', statusStart: 'Gerak ke kanan dan kumpul setiap item.', statusGold: '{count} / 10 emas dikumpul · {score} mata.', statusHeart: 'Hati dikumpul! +50 mata · {score} jumlah.', statusAll: '150 mata! Keputusan papan pendahulu anda sudah sedia.'
    }
  };
  let locale = localStorage.getItem('godot-forge-locale') || 'en';
  if (!copy[locale]) locale = 'en';
  let learnerId = localStorage.getItem(learnerKey);
  if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(learnerKey, learnerId); }
  const assets = { 'dusk-arena': 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-leaderboard/images/dusk-arena.webp', explorer: 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/items-spawning/images/forest-sword-explorer.png', 'gold-coin': 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/gold-coin.webp', 'heart-pickup': 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/heart-pickup.webp' };
  const images = Object.fromEntries(Object.entries(assets).map(([name, src]) => { const image = new Image(); image.crossOrigin = 'anonymous'; image.src = src; return [name, image]; }));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const input = new Set();
  const collected = new Set();
  const player = { x: START_X, feetY: FLOOR_Y, velocityY: 0, facing: 1 };
  let heartCollected = false;
  let completed = false;
  let ready = false;
  let activeTab = 'play';
  let cameraX = 0;
  let clock = 0;
  let lastFrame = performance.now();
  let particles = [];
  let revealTimer;
  let boardAnimation = 0;
  let saveChain = Promise.resolve();
  let statusKey = 'statusStart';
  const msg = key => copy[locale][key] || copy.en[key];
  const score = () => collected.size * 10 + Number(heartCollected) * 50;
  const unlocked = () => collected.size === coins.length && heartCollected;
  const format = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), msg(key));

  function setStatus(key) { statusKey = key; $('#game-status').textContent = format(key, { count: collected.size, score: score() }); }
  function renderRanking() {
    const rows = unlocked() ? [[msg('you'), 150, true], ['Fenn', 120, false], ['Mira', 100, false], ['Ash', 80, false]] : [['Fenn', 120, false], ['Mira', 100, false], ['Ash', 80, false]];
    const list = $('#ranking-list');
    list.replaceChildren(...rows.map(([name, points, isYou], index) => {
      const row = document.createElement('div'); row.className = `rank-row${isYou ? ' is-you' : ''}`; row.setAttribute('role', 'listitem');
      const rank = document.createElement('span'); rank.textContent = `#${index + 1}`;
      const playerName = document.createElement('strong'); playerName.textContent = name;
      const value = document.createElement('span'); value.textContent = String(points); if (isYou) value.id = 'you-score';
      row.append(rank, playerName, value); return row;
    }));
  }
  function updateUI() {
    const done = unlocked();
    $('#gold-count').textContent = `${collected.size} / 10`;
    $('#heart-count').textContent = `${Number(heartCollected)} / 1`;
    $('#score-count').textContent = String(score());
    $('#pickup-count').textContent = `${collected.size + Number(heartCollected)} / 11`;
    $('#run-progress').style.width = `${(collected.size + Number(heartCollected)) / 11 * 100}%`;
    $('#tab-board-score').textContent = done ? `150 ${msg('pointsShort')}` : '—';
    $('#board-total').textContent = done ? `150 ${msg('pointsShort')}` : '—';
    const board = $('#leaderboard-card');
    board.classList.toggle('is-locked', !done);
    board.classList.toggle('is-earned', done);
    board.setAttribute('aria-label', msg(done ? 'boardEarnedAria' : 'boardLockedAria'));
    $('#board-state').textContent = msg(done ? 'ranked' : 'locked');
    $('#board-message').textContent = msg(done ? 'earnedTitle' : 'lockedTitle');
    $('#board-detail').textContent = msg(done ? 'earnedDetail' : 'lockedDetail');
    renderRanking();
    $('#complete-module').disabled = !done || completed;
    $('#complete-module').textContent = msg(completed ? 'completed' : 'complete');
    $('#completion-status').textContent = msg(completed ? 'saved' : done ? 'completionReady' : 'completionHint');
    $('#world-progress').textContent = `${Math.max(0, Math.min(100, Math.round((player.x - START_X) / (coins.at(-1).x - START_X) * 100)))}%`;
  }
  function applyLocale() {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.title = msg('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = msg(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', msg(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
    setStatus(statusKey); updateUI();
  }
  function switchTab(next, focusTab = false) {
    activeTab = next; input.clear();
    for (const name of ['play', 'board']) {
      const selected = name === next;
      $(`#${name}-panel`).hidden = !selected;
      const tab = $(`#tab-${name}`); tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1;
    }
    if (focusTab) $(`#tab-${next}`).focus();
  }
  function snapshot() { return { collected: [...collected].sort((a, b) => a - b), heartCollected, playerX: Math.round(player.x) }; }
  function saveCheckpoint() {
    const state = snapshot();
    saveChain = saveChain.catch(() => {}).then(async () => {
      const response = await fetch(`/api/modules/${slug}/checkpoint`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, state }) });
      if (!response.ok) throw new Error('checkpoint failed');
    }).catch(() => window.showToast?.(msg('saveError'), 'error'));
  }
  function animateBoard() {
    const board = $('#leaderboard-card');
    board.classList.remove('is-revealing'); void board.offsetWidth; board.classList.add('is-revealing');
    const epoch = ++boardAnimation;
    if (reducedMotion) return;
    const start = performance.now();
    function tick(now) {
      if (epoch !== boardAnimation || !unlocked()) return;
      const amount = Math.min(1, (now - start) / 1000);
      const value = Math.round(150 * (1 - (1 - amount) ** 3));
      $('#board-total').textContent = `${value} ${msg('pointsShort')}`;
      const youScore = $('#you-score'); if (youScore) youScore.textContent = String(value);
      if (amount < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function showUnlock() {
    const overlay = $('#unlock-reveal');
    overlay.hidden = false; overlay.style.animation = 'none'; void overlay.offsetWidth; overlay.style.animation = '';
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => { overlay.hidden = true; switchTab('board', true); animateBoard(); }, reducedMotion ? 250 : 1600);
  }
  function burst(x, y, color) {
    for (let index = 0; index < 15; index++) {
      const angle = Math.PI * 2 * index / 15;
      particles.push({ x, y, vx: Math.cos(angle) * (55 + index % 4 * 15), vy: Math.sin(angle) * (55 + index % 3 * 12) - 35, life: .7, color });
    }
  }
  function pickupAdded(key) { setStatus(unlocked() ? 'statusAll' : key); updateUI(); saveCheckpoint(); if (unlocked()) showUnlock(); }
  function collectPickups() {
    const centerY = player.feetY - 62;
    for (const coin of coins) {
      if (collected.has(coin.id) || Math.abs(player.x - coin.x) > 42 || Math.abs(centerY - coin.y) > 57) continue;
      collected.add(coin.id); burst(coin.x, coin.y, '#ffdd76'); pickupAdded('statusGold');
    }
    if (!heartCollected && Math.abs(player.x - HEART_X) < 45 && Math.abs(centerY - HEART_Y) < 58) {
      heartCollected = true; burst(HEART_X, HEART_Y, '#ff7f8b'); pickupAdded('statusHeart');
    }
  }
  function drawBackdrop() {
    if (images['dusk-arena'].complete && images['dusk-arena'].naturalWidth) ctx.drawImage(images['dusk-arena'], 0, 0, WIDTH, HEIGHT);
    else { const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT); gradient.addColorStop(0, '#695d88'); gradient.addColorStop(.72, '#477c69'); gradient.addColorStop(1, '#173a27'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
    ctx.fillStyle = 'rgba(8, 28, 20, .26)'; ctx.fillRect(0, FLOOR_Y + 9, WIDTH, HEIGHT - FLOOR_Y);
  }
  function drawPickup(image, x, y, size) {
    if (!image.complete || !image.naturalWidth) return;
    ctx.save(); ctx.shadowColor = '#ffe4a5'; ctx.shadowBlur = 15; ctx.drawImage(image, x - size / 2, y - size / 2, size, size); ctx.restore();
  }
  function drawPlayer() {
    const screenX = player.x - cameraX;
    const bob = Math.abs(Math.sin(clock * 12)) * (input.has('left') || input.has('right') ? 3 : 1);
    ctx.save(); ctx.translate(screenX, player.feetY - bob); ctx.scale(player.facing, 1);
    ctx.fillStyle = 'rgba(13, 32, 21, .35)'; ctx.beginPath(); ctx.ellipse(0, 0, 38, 8, 0, 0, Math.PI * 2); ctx.fill();
    if (images.explorer.complete && images.explorer.naturalWidth) {
      const moving = input.has('left') || input.has('right');
      const frame = player.feetY < FLOOR_Y - 2 ? 32 + Math.floor(clock * 10) % 4 : moving ? 8 + Math.floor(clock * 9) % 8 : 0;
      ctx.drawImage(images.explorer, frame % 8 * 256, Math.floor(frame / 8) * 256, 256, 256, -78, -154, 156, 156);
    }
    else { ctx.fillStyle = '#355144'; ctx.fillRect(-22, -100, 44, 96); }
    ctx.restore();
  }
  function drawFrame() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); drawBackdrop();
    for (const coin of coins) {
      if (collected.has(coin.id)) continue;
      const x = coin.x - cameraX; if (x < -50 || x > WIDTH + 50) continue;
      const bob = reducedMotion ? 0 : Math.sin(clock * 3 + coin.id) * 4;
      const spin = reducedMotion ? 1 : Math.max(.45, Math.abs(Math.cos(clock * 1.8 + coin.id * .7)));
      ctx.save(); ctx.translate(x, coin.y + bob); ctx.scale(spin, 1); drawPickup(images['gold-coin'], 0, 0, 43); ctx.restore();
    }
    if (!heartCollected) {
      const pulse = reducedMotion ? 1 : 1 + .07 * Math.sin(clock * 4);
      drawPickup(images['heart-pickup'], HEART_X - cameraX, HEART_Y + (reducedMotion ? 0 : Math.sin(clock * 2) * 4), 53 * pulse);
    }
    drawPlayer();
    for (const particle of particles) {
      ctx.save(); ctx.globalAlpha = Math.max(0, particle.life / .7); ctx.fillStyle = particle.color;
      ctx.beginPath(); ctx.arc(particle.x - cameraX, particle.y, 3.5 * particle.life / .7, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  function frame(now) {
    const delta = Math.min(.05, Math.max(0, (now - lastFrame) / 1000)); lastFrame = now; clock += delta;
    if (ready && activeTab === 'play') {
      const direction = Number(input.has('right')) - Number(input.has('left'));
      if (direction) player.facing = direction;
      player.x = Math.max(55, Math.min(WORLD_WIDTH - 55, player.x + direction * 260 * delta));
      if (input.has('jump') && player.feetY >= FLOOR_Y) player.velocityY = -550;
      player.velocityY += 1450 * delta;
      player.feetY = Math.min(FLOOR_Y, player.feetY + player.velocityY * delta);
      if (player.feetY === FLOOR_Y) player.velocityY = 0;
      cameraX = Math.max(0, Math.min(WORLD_WIDTH - WIDTH, player.x - WIDTH * .36));
      collectPickups();
      $('#world-progress').textContent = `${Math.max(0, Math.min(100, Math.round((player.x - START_X) / (coins.at(-1).x - START_X) * 100)))}%`;
    }
    for (const particle of particles) { particle.x += particle.vx * delta; particle.y += particle.vy * delta; particle.vy += 150 * delta; particle.life -= delta; }
    particles = particles.filter(particle => particle.life > 0);
    drawFrame(); requestAnimationFrame(frame);
  }
  async function loadState() {
    try {
      const [checkpointResponse, modulesResponse] = await Promise.all([fetch(`/api/modules/${slug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`), fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`)]);
      if (checkpointResponse.ok) {
        const saved = (await checkpointResponse.json()).state;
        if (saved && typeof saved === 'object') {
          for (const id of Array.isArray(saved.collected) ? saved.collected : []) if (Number.isInteger(id) && id >= 0 && id < coins.length) collected.add(id);
          heartCollected = saved.heartCollected === true;
          player.x = Number.isFinite(saved.playerX) ? Math.max(55, Math.min(WORLD_WIDTH - 55, saved.playerX)) : START_X;
        }
      }
      if (modulesResponse.ok) completed = (await modulesResponse.json()).find(module => module.slug === slug)?.completed === true;
      cameraX = Math.max(0, Math.min(WORLD_WIDTH - WIDTH, player.x - WIDTH * .36));
      setStatus(unlocked() ? 'statusAll' : heartCollected ? 'statusHeart' : collected.size ? 'statusGold' : 'statusStart');
    } catch { /* The playable lesson still works when the network is unavailable. */ }
    finally { ready = true; updateUI(); }
  }
  const keyControls = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'jump', Space: 'jump' };
  window.addEventListener('keydown', event => {
    const control = keyControls[event.code];
    if (!control || activeTab !== 'play' || event.target.closest?.('input, textarea, select, [role="tab"]')) return;
    event.preventDefault(); input.add(control);
  });
  window.addEventListener('keyup', event => { const control = keyControls[event.code]; if (control && input.has(control)) { event.preventDefault(); input.delete(control); } });
  window.addEventListener('blur', () => input.clear());
  document.addEventListener('visibilitychange', () => { if (document.hidden) input.clear(); });
  canvas.addEventListener('pointerdown', () => canvas.focus());
  document.querySelectorAll('[data-control]').forEach(button => {
    const control = button.dataset.control;
    const stop = event => { input.delete(control); button.classList.remove('is-pressed'); if (event?.pointerId && button.hasPointerCapture?.(event.pointerId)) button.releasePointerCapture(event.pointerId); };
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); input.add(control); button.classList.add('is-pressed'); });
    button.addEventListener('pointerup', stop); button.addEventListener('pointercancel', stop); button.addEventListener('lostpointercapture', () => stop());
    button.addEventListener('keydown', event => { if (event.code === 'Space' || event.code === 'Enter') input.add(control); });
    button.addEventListener('keyup', event => { if (event.code === 'Space' || event.code === 'Enter') input.delete(control); });
  });
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => switchTab(button.dataset.tab)));
  $('.module-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); switchTab(event.key === 'ArrowLeft' || event.key === 'Home' ? 'play' : 'board', true);
  });
  $('#view-board').addEventListener('click', () => switchTab('board', true));
  $('#back-to-play').addEventListener('click', () => switchTab('play', true));
  document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => { locale = button.dataset.locale; localStorage.setItem('godot-forge-locale', locale); applyLocale(); }));
  $('#complete-module').addEventListener('click', async () => {
    if (!unlocked() || completed) return;
    const button = $('#complete-module'); button.disabled = true;
    try {
      await saveChain;
      const response = await fetch(`/api/modules/${slug}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: true }) });
      if (!response.ok) throw new Error('save failed');
      completed = true; updateUI(); window.showToast?.(msg('saved'), 'success');
    } catch { button.disabled = false; $('#completion-status').textContent = msg('saveError'); window.showToast?.(msg('saveError'), 'error'); }
  });
  window.addEventListener('godot-forge-module-reset', event => {
    if (event.detail?.slug !== slug) return;
    collected.clear(); heartCollected = false; completed = false; player.x = START_X; player.feetY = FLOOR_Y; player.velocityY = 0; cameraX = 0; particles = []; input.clear(); boardAnimation++;
    clearTimeout(revealTimer); $('#unlock-reveal').hidden = true; $('#leaderboard-card').classList.remove('is-revealing'); setStatus('statusStart'); updateUI(); switchTab('play');
  });
  applyLocale(); loadState(); requestAnimationFrame(frame);
})();

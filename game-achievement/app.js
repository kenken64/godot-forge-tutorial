(() => {
  const $ = selector => document.querySelector(selector);
  const canvas = $('#achievement-stage');
  const ctx = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const FLOOR_Y = 385;
  const WORLD_WIDTH = 1850;
  const START_X = 120;
  const HEART_X = 940;
  const HEART_Y = FLOOR_Y - 59;
  const coins = Array.from({ length: 10 }, (_, id) => ({ id, x: 285 + id * 145, y: FLOOR_Y - 59 - (id % 3 === 1 ? 9 : 0) }));
  const slug = 'game-achievement';
  const learnerKey = 'godot-forge-learner-id';
  const copy = {
    en: {
      pageTitle: 'Achievements · Godot Forge', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 15 / ACHIEVEMENTS', language: 'Language', eyebrow: 'PLAYABLE SYSTEM / REWARDS', title: 'Earn it. See it shine.', intro: 'Collect 10 gold coins and a healing heart. Each milestone lights up an animated badge and stays earned when you return.', tabsLabel: 'Achievement module views', playTab: 'PLAY THE CHALLENGE', badgesTab: 'ACHIEVEMENTS', arenaEyebrow: 'FOREST RUN / TWO MILESTONES', canvasLabel: 'Run through the forest with left and right arrows or A and D. Collect ten gold coins and a heart. Space or up jumps.', hudLabel: 'Game progress', goldLabel: 'GOLD', hpLabel: 'HP', unlockedLabel: 'ACHIEVEMENT UNLOCKED', touchControlsLabel: 'Touch game controls', leftControl: 'Move left', rightControl: 'Move right', jumpControl: 'Jump', jumpLabel: 'JUMP', controlsHelp: '← → or A / D to move · Space / ↑ to jump · touch buttons work too. Click the game to return keyboard focus.', missionEyebrow: 'YOUR MISSION', missionTitle: 'Two small wins. Two bright badges.', goldMission: 'Gather 10 gold', goldMissionCopy: 'Every coin moves the counter. The tenth unlocks a golden medal.', heartMission: 'Find a healing heart', heartMissionCopy: 'The heart restores HP from 2 to 3 and unlocks the heart medal.', earnedLabel: 'BADGES EARNED', viewBadges: 'VIEW ACHIEVEMENTS →', completionHint: 'Earn both badges to finish this lesson.', completionReady: 'Both badges earned. Complete the module when ready.', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETED', saved: 'Achievement progress saved.', saveError: 'Progress could not be saved. Try again.', collectionEyebrow: 'YOUR COLLECTION', collectionTitle: 'Achievements', collectionIntro: 'Locked medals stay grey. Earn one and it blooms into full color.', locked: 'LOCKED', earned: 'EARNED', goldBadgeTitle: 'Gold Collector', goldBadgeCopy: 'Collect all 10 gold coins in the forest run.', goldReveal: 'You collected ten gold coins.', heartBadgeTitle: 'Heart Restored', heartBadgeCopy: 'Collect a heart to bring your HP back to full.', heartReveal: 'Your HP is full again.', goldUnit: 'GOLD', heartUnit: 'HEART', backToPlay: '← BACK TO THE CHALLENGE', lessonEyebrow: 'HOW IT WORKS', lessonTitle: 'A milestone has a rule, a reward, and a memory.', ruleCopy: 'The coin badge unlocks exactly when the tenth coin is collected. The heart badge unlocks when HP is restored.', saveCopy: 'The game saves each pickup and earned badge. A return visit restores the same colors and counters.', artCredit: 'Forest scene and reward art generated with GPT Image 2.5 Sunburst; the explorer reuses a Sunburst character asset.', arenaPrompt: 'Scene prompt', coinPrompt: 'Gold prompt', heartPrompt: 'Heart prompt', goldBadgePrompt: 'Gold badge prompt', heartBadgePrompt: 'Heart badge prompt', statusStart: 'Move right to collect the gold and heart.', statusGold: '{count} of 10 gold collected. Keep exploring!', statusHeart: 'Heart collected! HP restored to 3 / 3.', statusAll: 'Both achievements earned. Open the collection to see them in color.'
    },
    zh: {
      pageTitle: '游戏成就 · Godot Forge', back: '← GODOT FORGE / 学习路径', chapter: '第 15 章 / 游戏成就', language: '语言', eyebrow: '可玩系统 / 奖励', title: '达成目标，让徽章闪耀。', intro: '收集 10 枚金币和一颗恢复生命的爱心。每完成一个目标，成就徽章便会亮起并永久保留。', tabsLabel: '成就模块页面', playTab: '开始挑战', badgesTab: '成就', arenaEyebrow: '森林跑酷 / 两个目标', canvasLabel: '用左右方向键或 A、D 在森林里移动，收集十枚金币和一颗爱心。按空格或上方向键跳跃。', hudLabel: '游戏进度', goldLabel: '金币', hpLabel: '生命值', unlockedLabel: '成就已解锁', touchControlsLabel: '触控游戏按钮', leftControl: '向左移动', rightControl: '向右移动', jumpControl: '跳跃', jumpLabel: '跳跃', controlsHelp: '← → 或 A / D 移动 · 空格 / ↑ 跳跃 · 也可以使用触控按钮。调整焦点后点击游戏画面。', missionEyebrow: '你的任务', missionTitle: '两个小目标，两枚闪亮徽章。', goldMission: '收集 10 枚金币', goldMissionCopy: '每枚金币都会增加计数；第十枚解锁金色徽章。', heartMission: '找到恢复爱心', heartMissionCopy: '爱心将生命值从 2 恢复到 3，并解锁爱心徽章。', earnedLabel: '已获得徽章', viewBadges: '查看成就 →', completionHint: '获得两枚徽章后即可完成本课。', completionReady: '两枚徽章都已获得。准备好后完成模块。', complete: '完成模块', completed: '模块已完成', saved: '成就进度已保存。', saveError: '无法保存进度，请重试。', collectionEyebrow: '你的收藏', collectionTitle: '成就', collectionIntro: '未解锁的徽章为灰色，获得后会恢复鲜艳色彩。', locked: '未解锁', earned: '已获得', goldBadgeTitle: '金币收藏家', goldBadgeCopy: '在森林挑战中收集全部 10 枚金币。', goldReveal: '你收集了十枚金币。', heartBadgeTitle: '生命恢复', heartBadgeCopy: '收集爱心，让生命值恢复满格。', heartReveal: '你的生命值再次满格。', goldUnit: '金币', heartUnit: '爱心', backToPlay: '← 返回挑战', lessonEyebrow: '运作方式', lessonTitle: '成就包含规则、奖励和记录。', ruleCopy: '收集第十枚金币时解锁金币徽章；爱心恢复生命值时解锁爱心徽章。', saveCopy: '每件道具和已获得的徽章都会保存。再次进入时，颜色和计数保持不变。', artCredit: '森林场景与奖励美术由 GPT Image 2.5 Sunburst 生成；探险者复用 Sunburst 角色素材。', arenaPrompt: '场景提示词', coinPrompt: '金币提示词', heartPrompt: '爱心提示词', goldBadgePrompt: '金币徽章提示词', heartBadgePrompt: '爱心徽章提示词', statusStart: '向右移动，收集金币和爱心。', statusGold: '已收集 {count} / 10 枚金币，继续探索！', statusHeart: '已收集爱心！生命值恢复到 3 / 3。', statusAll: '两项成就都已获得。打开收藏查看彩色徽章。'
    },
    ms: {
      pageTitle: 'Pencapaian Permainan · Godot Forge', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 15 / PENCAPAIAN', language: 'Bahasa', eyebrow: 'SISTEM BOLEH MAIN / GANJARAN', title: 'Capai sasaran. Lihat lencana bersinar.', intro: 'Kumpul 10 syiling emas dan satu hati penyembuh. Setiap pencapaian menyalakan lencana beranimasi dan kekal apabila anda kembali.', tabsLabel: 'Paparan modul pencapaian', playTab: 'MAIN CABARAN', badgesTab: 'PENCAPAIAN', arenaEyebrow: 'LARIAN HUTAN / DUA SASARAN', canvasLabel: 'Bergerak di hutan dengan anak panah kiri dan kanan atau A dan D. Kumpul sepuluh syiling emas dan satu hati. Space atau atas untuk melompat.', hudLabel: 'Kemajuan permainan', goldLabel: 'EMAS', hpLabel: 'HP', unlockedLabel: 'PENCAPAIAN DIBUKA', touchControlsLabel: 'Kawalan permainan sentuh', leftControl: 'Gerak ke kiri', rightControl: 'Gerak ke kanan', jumpControl: 'Lompat', jumpLabel: 'LOMPAT', controlsHelp: '← → atau A / D untuk bergerak · Space / ↑ untuk melompat · butang sentuh juga tersedia. Klik permainan untuk kembali ke kawalan papan kekunci.', missionEyebrow: 'MISI ANDA', missionTitle: 'Dua kejayaan kecil. Dua lencana bersinar.', goldMission: 'Kumpul 10 emas', goldMissionCopy: 'Setiap syiling menambah kiraan. Syiling kesepuluh membuka pingat emas.', heartMission: 'Cari hati penyembuh', heartMissionCopy: 'Hati memulihkan HP daripada 2 kepada 3 dan membuka pingat hati.', earnedLabel: 'LENCANA DIPEROLEH', viewBadges: 'LIHAT PENCAPAIAN →', completionHint: 'Dapatkan kedua-dua lencana untuk menamatkan pelajaran ini.', completionReady: 'Kedua-dua lencana diperoleh. Selesaikan modul apabila sedia.', complete: 'SELESAIKAN MODUL', completed: 'MODUL SELESAI', saved: 'Kemajuan pencapaian disimpan.', saveError: 'Kemajuan tidak dapat disimpan. Cuba lagi.', collectionEyebrow: 'KOLEKSI ANDA', collectionTitle: 'Pencapaian', collectionIntro: 'Pingat terkunci kekal kelabu. Dapatkannya untuk melihat warna penuh.', locked: 'TERKUNCI', earned: 'DIPEROLEH', goldBadgeTitle: 'Pengumpul Emas', goldBadgeCopy: 'Kumpul kesemua 10 syiling emas dalam larian hutan.', goldReveal: 'Anda mengumpul sepuluh syiling emas.', heartBadgeTitle: 'Hati Dipulihkan', heartBadgeCopy: 'Kumpul hati untuk memulihkan HP sepenuhnya.', heartReveal: 'HP anda kembali penuh.', goldUnit: 'EMAS', heartUnit: 'HATI', backToPlay: '← KEMBALI KE CABARAN', lessonEyebrow: 'CARA IA BERFUNGSI', lessonTitle: 'Pencapaian ada peraturan, ganjaran dan ingatan.', ruleCopy: 'Lencana emas terbuka tepat apabila syiling kesepuluh dikumpul. Lencana hati terbuka apabila HP dipulihkan.', saveCopy: 'Permainan menyimpan setiap item dan lencana. Lawatan seterusnya memulihkan warna dan kiraan yang sama.', artCredit: 'Seni hutan dan ganjaran dijana dengan GPT Image 2.5 Sunburst; penjelajah menggunakan semula aset watak Sunburst.', arenaPrompt: 'Prom pemandangan', coinPrompt: 'Prom emas', heartPrompt: 'Prom hati', goldBadgePrompt: 'Prom lencana emas', heartBadgePrompt: 'Prom lencana hati', statusStart: 'Gerak ke kanan untuk mengumpul emas dan hati.', statusGold: '{count} daripada 10 emas dikumpul. Teruskan meneroka!', statusHeart: 'Hati dikumpul! HP pulih kepada 3 / 3.', statusAll: 'Kedua-dua pencapaian diperoleh. Buka koleksi untuk melihat lencana berwarna.'
    }
  };
  let locale = localStorage.getItem('godot-forge-locale') || 'en';
  if (!copy[locale]) locale = 'en';
  let learnerId = localStorage.getItem(learnerKey);
  if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(learnerKey, learnerId); }
  const images = {};
  for (const name of ['forest-arena', 'gold-coin', 'heart-pickup']) {
    const image = new Image(); image.crossOrigin = 'anonymous'; image.src = `https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/${name}.webp`; images[name] = image;
  }
  images.explorer = new Image();
  images.explorer.crossOrigin = 'anonymous';
  images.explorer.src = 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/items-spawning/images/forest-sword-explorer.png';
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
  let activeReveal = null;
  let revealTimer;
  let saveChain = Promise.resolve();
  let statusKey = 'statusStart';
  const msg = key => copy[locale][key] || copy.en[key];
  const earnedGold = () => collected.size === coins.length;
  const earnedHeart = () => heartCollected;
  const earnedCount = () => Number(earnedGold()) + Number(earnedHeart());
  const format = (key, values = {}) => Object.entries(values).reduce((text, [name, value]) => text.replace(`{${name}}`, value), msg(key));

  function setStatus(key) { statusKey = key; $('#game-status').textContent = format(key, { count: collected.size }); }
  function updateUI() {
    const count = earnedCount();
    $('#gold-count').textContent = `${collected.size} / 10`;
    $('#hp-count').textContent = `${heartCollected ? 3 : 2} / 3`;
    for (const id of ['earned-count', 'tab-earned-count', 'collection-count']) $(`#${id}`).textContent = `${count} / 2`;
    $('#earned-progress').style.width = `${count * 50}%`;
    $('#gold-badge-progress').textContent = `${collected.size} / 10`;
    $('#heart-badge-progress').textContent = `${Number(heartCollected)} / 1`;
    $('#gold-badge-bar').style.width = `${collected.size * 10}%`;
    $('#heart-badge-bar').style.width = heartCollected ? '100%' : '0%';
    for (const [name, earned] of [['gold', earnedGold()], ['heart', earnedHeart()]]) {
      const card = document.querySelector(`[data-badge="${name}"]`);
      card.classList.toggle('is-locked', !earned);
      card.classList.toggle('is-earned', earned);
      card.setAttribute('aria-label', `${msg(earned ? 'earned' : 'locked')}: ${msg(name === 'gold' ? 'goldBadgeTitle' : 'heartBadgeTitle')}`);
      document.querySelector(`[data-badge-state="${name}"]`).textContent = msg(earned ? 'earned' : 'locked');
    }
    $('#complete-module').disabled = count < 2 || completed;
    $('#complete-module').textContent = msg(completed ? 'completed' : 'complete');
    $('#completion-status').textContent = msg(completed ? 'saved' : count === 2 ? 'completionReady' : 'completionHint');
    $('#world-progress').textContent = `${Math.round((player.x - START_X) / (coins.at(-1).x - START_X) * 100)}%`;
    if (activeReveal) {
      $('#reveal-title').textContent = msg(activeReveal === 'gold' ? 'goldBadgeTitle' : 'heartBadgeTitle');
      $('#reveal-detail').textContent = msg(activeReveal === 'gold' ? 'goldReveal' : 'heartReveal');
    }
  }
  function applyLocale() {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.title = msg('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = msg(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', msg(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
    $('#game-status').textContent = format(statusKey, { count: collected.size });
    updateUI();
  }
  function switchTab(next, focusTab = false) {
    activeTab = next;
    input.clear();
    for (const name of ['play', 'badges']) {
      const selected = name === next;
      $(`#${name === 'play' ? 'play' : 'badges'}-panel`).hidden = !selected;
      const tab = $(`#tab-${name}`);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
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
  function showUnlock(name) {
    activeReveal = name;
    const overlay = $('#unlock-reveal');
    $('#reveal-art').src = `https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/${name}-badge.webp`;
    updateUI();
    overlay.hidden = false;
    overlay.style.animation = 'none';
    void overlay.offsetWidth;
    overlay.style.animation = '';
    const card = document.querySelector(`[data-badge="${name}"]`);
    card.classList.remove('just-unlocked'); void card.offsetWidth; card.classList.add('just-unlocked');
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => { overlay.hidden = true; activeReveal = null; card.classList.remove('just-unlocked'); }, reducedMotion ? 2600 : 3800);
  }
  function burst(x, y, color) {
    for (let index = 0; index < 15; index++) {
      const angle = Math.PI * 2 * index / 15;
      particles.push({ x, y, vx: Math.cos(angle) * (55 + index % 4 * 15), vy: Math.sin(angle) * (55 + index % 3 * 12) - 35, life: .7, color });
    }
  }
  function collectPickups() {
    const centerY = player.feetY - 62;
    for (const coin of coins) {
      if (collected.has(coin.id) || Math.abs(player.x - coin.x) > 42 || Math.abs(centerY - coin.y) > 57) continue;
      collected.add(coin.id); burst(coin.x, coin.y, '#ffdd76');
      setStatus(earnedGold() && heartCollected ? 'statusAll' : 'statusGold');
      if (earnedGold()) showUnlock('gold');
      updateUI(); saveCheckpoint();
    }
    if (!heartCollected && Math.abs(player.x - HEART_X) < 45 && Math.abs(centerY - HEART_Y) < 58) {
      heartCollected = true; burst(HEART_X, HEART_Y, '#ff7f8b');
      setStatus(earnedGold() ? 'statusAll' : 'statusHeart');
      showUnlock('heart'); updateUI(); saveCheckpoint();
    }
  }
  function drawBackdrop() {
    if (images['forest-arena'].complete && images['forest-arena'].naturalWidth) ctx.drawImage(images['forest-arena'], 0, 0, WIDTH, HEIGHT);
    else { const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT); gradient.addColorStop(0, '#75a7ad'); gradient.addColorStop(.72, '#467f52'); gradient.addColorStop(1, '#173a27'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
    ctx.fillStyle = 'rgba(8, 28, 20, .26)'; ctx.fillRect(0, FLOOR_Y + 9, WIDTH, HEIGHT - FLOOR_Y);
  }
  function drawPickup(image, x, y, size, alpha = 1) {
    if (!image.complete || !image.naturalWidth) return;
    ctx.save(); ctx.globalAlpha = alpha; ctx.shadowColor = '#ffe4a5'; ctx.shadowBlur = 15; ctx.drawImage(image, x - size / 2, y - size / 2, size, size); ctx.restore();
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
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackdrop();
    for (const coin of coins) {
      if (collected.has(coin.id)) continue;
      const x = coin.x - cameraX;
      if (x < -50 || x > WIDTH + 50) continue;
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
    const delta = Math.min(.05, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now; clock += delta;
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
    drawFrame();
    requestAnimationFrame(frame);
  }
  async function loadState() {
    try {
      const [checkpointResponse, modulesResponse] = await Promise.all([fetch(`/api/modules/${slug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`), fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`)]);
      if (checkpointResponse.ok) {
        const saved = (await checkpointResponse.json()).state;
        if (saved && typeof saved === 'object') {
          for (const id of saved.collected || []) if (Number.isInteger(id) && id >= 0 && id < coins.length) collected.add(id);
          heartCollected = saved.heartCollected === true;
          player.x = Number.isFinite(saved.playerX) ? Math.max(55, Math.min(WORLD_WIDTH - 55, saved.playerX)) : START_X;
        }
      }
      if (modulesResponse.ok) completed = (await modulesResponse.json()).find(module => module.slug === slug)?.completed === true;
      cameraX = Math.max(0, Math.min(WORLD_WIDTH - WIDTH, player.x - WIDTH * .36));
      setStatus(earnedGold() && heartCollected ? 'statusAll' : heartCollected ? 'statusHeart' : collected.size ? 'statusGold' : 'statusStart');
    } catch { /* The playable lesson still works when the network is unavailable. */ }
    finally { ready = true; updateUI(); }
  }
  const keyControls = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'jump', Space: 'jump' };
  window.addEventListener('keydown', event => {
    const control = keyControls[event.code];
    if (!control || activeTab !== 'play' || event.target.closest('input, textarea, select, [role="tab"]')) return;
    event.preventDefault(); input.add(control);
  });
  window.addEventListener('keyup', event => { const control = keyControls[event.code]; if (control && input.has(control)) { event.preventDefault(); input.delete(control); } });
  window.addEventListener('blur', () => input.clear());
  document.addEventListener('visibilitychange', () => { if (document.hidden) input.clear(); });
  canvas.addEventListener('pointerdown', () => canvas.focus());
  document.querySelectorAll('[data-control]').forEach(button => {
    const control = button.dataset.control;
    const stop = event => { input.delete(control); button.classList.remove('is-pressed'); if (event?.pointerId) button.releasePointerCapture?.(event.pointerId); };
    button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); input.add(control); button.classList.add('is-pressed'); });
    button.addEventListener('pointerup', stop);
    button.addEventListener('pointercancel', stop);
    button.addEventListener('lostpointercapture', () => stop());
    button.addEventListener('keydown', event => { if (event.code === 'Space' || event.code === 'Enter') input.add(control); });
    button.addEventListener('keyup', event => { if (event.code === 'Space' || event.code === 'Enter') input.delete(control); });
  });
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => switchTab(button.dataset.tab)));
  $('.module-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    switchTab(event.key === 'ArrowLeft' || event.key === 'Home' ? 'play' : 'badges', true);
  });
  $('#view-badges').addEventListener('click', () => switchTab('badges', true));
  $('#back-to-play').addEventListener('click', () => switchTab('play', true));
  document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => { locale = button.dataset.locale; localStorage.setItem('godot-forge-locale', locale); applyLocale(); }));
  $('#complete-module').addEventListener('click', async () => {
    if (earnedCount() < 2 || completed) return;
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
    collected.clear(); heartCollected = false; completed = false; player.x = START_X; player.feetY = FLOOR_Y; player.velocityY = 0; cameraX = 0; particles = []; input.clear();
    clearTimeout(revealTimer); $('#unlock-reveal').hidden = true; activeReveal = null; setStatus('statusStart'); updateUI(); switchTab('play');
  });
  applyLocale();
  loadState();
  requestAnimationFrame(frame);
})();

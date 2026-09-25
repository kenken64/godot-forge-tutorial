(() => {
  const $ = selector => document.querySelector(selector);
  const canvas = $('#coop-stage');
  const ctx = canvas.getContext('2d');
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const FLOOR_Y = 423;
  const slug = 'local-coop';
  const coinXs = [120, 180, 300, 360, 430, 500, 560, 630, 690, 760, 840, 900];
  const coins = coinXs.map((x, id) => ({ id, x, y: FLOOR_Y - (id % 2 ? 157 : 56) }));
  const copy = {
    en: { pageTitle: 'Local Co-op · Godot Forge', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 17 / LOCAL CO-OP', language: 'Language', eyebrow: 'SHARED SCREEN / TWO CONTROLLERS', title: 'Two heroes. One forest.', intro: "Player 1 uses the keyboard. Player 2 uses a gamepad. Gather the coins together and watch each player's total grow separately.", runEyebrow: 'PLAYABLE CO-OP RUN', runTitle: 'Share the path, share the goal.', canvasLabel: 'Two players in a forest. Player 1 uses the keyboard and Player 2 uses a gamepad to collect coins.', playerOne: 'P1 · KEYBOARD', playerTwo: 'P2 · GAMEPAD', keyboardControls: 'Keyboard: A / D or ← / → to move · W, ↑ or Space to jump', gamepadControls: 'Gamepad: left stick or D-pad to move · A / bottom button to jump', completionHint: 'Collect all 12 coins together to complete the module.', completionReady: 'Team goal reached. Complete the module when ready.', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETED', lessonEyebrow: 'HOW LOCAL CO-OP WORKS', lessonTitle: 'One world, two input streams.', lessonOne: 'Both players stay on the same screen. The keyboard only moves Player 1; the first connected gamepad only moves Player 2.', lessonTwo: 'A coin belongs to the player who touches it first. The team total and both personal counters are saved for your next visit.', artCredit: 'Forest, coin, and explorer art reused from the earlier Godot Forge game modules. Player 2 wears a blue tunic and amber cloak.', promptsEyebrow: 'BUILD PROMPT / SOURCE ART', promptsTitle: 'Prompts behind the co-op scene', promptsIntro: 'Open a card to read the co-op build prompt or the original art prompts for the assets reused here.', buildPromptTitle: 'Co-op gameplay build prompt', forestPromptTitle: 'Forest arena source art prompt', explorerPromptTitle: 'Explorer sprite source art prompt', coinPromptTitle: 'Gold coin source art prompt', disconnected: 'CONNECT A GAMEPAD FOR PLAYER 2', connected: 'PLAYER 2 GAMEPAD CONNECTED', statusStart: 'Connect a gamepad, then collect the coins together.', statusConnected: 'Both players are ready. Collect every coin together.', statusOne: 'Player 1 collected a coin.', statusTwo: 'Player 2 collected a coin.', statusAll: 'All coins collected! Team goal reached.', saveError: 'Co-op progress could not be saved. Try again.', saved: 'Local co-op module completed.' },
    zh: { pageTitle: '本地合作游戏 · Godot Forge', back: '← GODOT FORGE / 学习路径', chapter: '第 17 章 / 本地合作游戏', language: '语言', eyebrow: '共享画面 / 双人控制', title: '两位英雄，一片森林。', intro: '玩家 1 使用键盘，玩家 2 使用手柄。一起收集金币，同时分别记录两人的数量。', runEyebrow: '可游玩的合作挑战', runTitle: '共走一条路，共赴一个目标。', canvasLabel: '两名玩家在森林里收集金币。玩家 1 使用键盘，玩家 2 使用手柄。', playerOne: '玩家 1 · 键盘', playerTwo: '玩家 2 · 手柄', keyboardControls: '键盘：A / D 或 ← / → 移动 · W、↑ 或空格跳跃', gamepadControls: '手柄：左摇杆或方向键移动 · A / 下方按钮跳跃', completionHint: '一起收集全部 12 枚金币以完成模块。', completionReady: '团队目标已达成。准备好后完成模块。', complete: '完成模块', completed: '模块已完成', lessonEyebrow: '本地合作原理', lessonTitle: '一个世界，两路输入。', lessonOne: '两位玩家始终处于同一画面。键盘只控制玩家 1；首个连接的手柄只控制玩家 2。', lessonTwo: '金币归先碰到它的玩家所有。团队总数和各自的计数会保存，方便下次继续。', artCredit: '森林、金币和探险者素材复用 Godot Forge 之前的游戏模块。玩家 2 穿蓝色上衣和琥珀色披风。', promptsEyebrow: '构建提示词 / 原始美术', promptsTitle: '合作场景背后的提示词', promptsIntro: '展开卡片，阅读合作玩法构建提示词及复用素材的原始美术提示词。', buildPromptTitle: '合作玩法构建提示词', forestPromptTitle: '森林场景原始美术提示词', explorerPromptTitle: '探险者精灵原始美术提示词', coinPromptTitle: '金币原始美术提示词', disconnected: '连接手柄以控制玩家 2', connected: '玩家 2 的手柄已连接', statusStart: '连接手柄，然后一起收集金币。', statusConnected: '两位玩家已就绪，一起收集所有金币。', statusOne: '玩家 1 拾取了一枚金币。', statusTwo: '玩家 2 拾取了一枚金币。', statusAll: '所有金币已收集！团队目标达成。', saveError: '合作进度无法保存，请重试。', saved: '本地合作模块已完成。' },
    ms: { pageTitle: 'Kerjasama Setempat · Godot Forge', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 17 / KERJASAMA SETEMPAT', language: 'Bahasa', eyebrow: 'SKRIN BERSAMA / DUA KAWALAN', title: 'Dua wira. Satu hutan.', intro: 'Pemain 1 menggunakan papan kekunci. Pemain 2 menggunakan pad permainan. Kumpul syiling bersama dan lihat jumlah masing-masing.', runEyebrow: 'LARIAN KOPERATIF', runTitle: 'Kongsi laluan, kongsi matlamat.', canvasLabel: 'Dua pemain di hutan. Pemain 1 menggunakan papan kekunci dan Pemain 2 menggunakan pad permainan untuk mengumpul syiling.', playerOne: 'P1 · PAPAN KEKUNCI', playerTwo: 'P2 · PAD PERMAINAN', keyboardControls: 'Papan kekunci: A / D atau ← / → untuk bergerak · W, ↑ atau Space untuk melompat', gamepadControls: 'Pad permainan: kayu kiri atau D-pad untuk bergerak · A / butang bawah untuk melompat', completionHint: 'Kumpul kesemua 12 syiling bersama untuk menyelesaikan modul.', completionReady: 'Matlamat pasukan tercapai. Selesaikan modul apabila sedia.', complete: 'SELESAIKAN MODUL', completed: 'MODUL SELESAI', lessonEyebrow: 'CARA KERJASAMA SETEMPAT BERFUNGSI', lessonTitle: 'Satu dunia, dua aliran input.', lessonOne: 'Kedua-dua pemain kekal pada skrin yang sama. Papan kekunci hanya menggerakkan Pemain 1; pad permainan pertama hanya menggerakkan Pemain 2.', lessonTwo: 'Syiling menjadi milik pemain yang menyentuhnya dahulu. Jumlah pasukan dan kiraan peribadi disimpan untuk lawatan seterusnya.', artCredit: 'Seni hutan, syiling dan penjelajah digunakan semula daripada modul permainan Godot Forge terdahulu. Pemain 2 memakai baju biru dan jubah ambar.', promptsEyebrow: 'PROM BINA / SENI ASAL', promptsTitle: 'Prom di sebalik adegan kerjasama', promptsIntro: 'Buka kad untuk membaca prom bina permainan atau prom seni asal bagi aset yang digunakan semula di sini.', buildPromptTitle: 'Prom bina permainan kerjasama', forestPromptTitle: 'Prom seni asal arena hutan', explorerPromptTitle: 'Prom seni asal sprite penjelajah', coinPromptTitle: 'Prom seni asal syiling emas', disconnected: 'SAMBUNG PAD UNTUK PEMAIN 2', connected: 'PAD PEMAIN 2 DISAMBUNG', statusStart: 'Sambung pad permainan, kemudian kumpul syiling bersama.', statusConnected: 'Kedua-dua pemain bersedia. Kumpul semua syiling bersama.', statusOne: 'Pemain 1 mengutip satu syiling.', statusTwo: 'Pemain 2 mengutip satu syiling.', statusAll: 'Semua syiling dikutip! Matlamat pasukan tercapai.', saveError: 'Kemajuan kerjasama tidak dapat disimpan. Cuba lagi.', saved: 'Modul kerjasama setempat selesai.' },
  };
  let locale = localStorage.getItem('godot-forge-locale') || 'en';
  if (!copy[locale]) locale = 'en';
  const learnerKey = 'godot-forge-learner-id';
  let learnerId = localStorage.getItem(learnerKey);
  if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(learnerKey, learnerId); }
  const image = (src, onload) => { const asset = new Image(); asset.crossOrigin = 'anonymous'; if (onload) asset.onload = () => onload(asset); asset.src = src; return asset; };
  const background = image('https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/forest-arena.webp');
  const coinArt = image('https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/gold-coin.webp');
  let blueExplorer = null;
  const explorer = image('https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/items-spawning/images/forest-sword-explorer.png', source => { blueExplorer = recolorExplorer(source); });
  const players = [
    { id: 1, x: 210, feetY: FLOOR_Y, velocityY: 0, facing: 1, jumpHeld: false, moving: false, coins: 0 },
    { id: 2, x: 750, feetY: FLOOR_Y, velocityY: 0, facing: -1, jumpHeld: false, moving: false, coins: 0 },
  ];
  const collected = new Map();
  const keys = new Set();
  let ready = false;
  let completed = false;
  let connected = false;
  let statusKey = 'statusStart';
  let saveChain = Promise.resolve();
  let clock = 0;
  let lastFrame = performance.now();
  const t = key => copy[locale][key] || copy.en[key];
  const won = () => collected.size === coins.length;

  function recolorExplorer(source) {
    const sheet = document.createElement('canvas');
    sheet.width = source.naturalWidth; sheet.height = source.naturalHeight;
    const surface = sheet.getContext('2d', { willReadFrequently: true });
    surface.drawImage(source, 0, 0);
    const pixels = surface.getImageData(0, 0, sheet.width, sheet.height);
    const data = pixels.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 8) continue;
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
      if (delta < .06) continue;
      let hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
      hue = (hue * 60 + 360) % 360;
      let target;
      if (hue >= 65 && hue <= 165) target = 205 + (hue - 110) * .12;
      else if (hue >= 255 && hue <= 325) target = 35 + (hue - 290) * .12;
      else continue;
      const lightness = (max + min) / 2;
      const saturation = delta / (1 - Math.abs(2 * lightness - 1));
      const chroma = (1 - Math.abs(2 * lightness - 1)) * Math.max(.3, saturation);
      const sector = target / 60;
      const middle = chroma * (1 - Math.abs(sector % 2 - 1));
      const base = lightness - chroma / 2;
      const channels = sector < 1 ? [chroma, middle, 0] : sector < 2 ? [middle, chroma, 0] : sector < 3 ? [0, chroma, middle] : sector < 4 ? [0, middle, chroma] : sector < 5 ? [middle, 0, chroma] : [chroma, 0, middle];
      for (let channel = 0; channel < 3; channel++) data[i + channel] = Math.round((channels[channel] + base) * 255);
    }
    surface.putImageData(pixels, 0, 0);
    return sheet;
  }

  function setStatus(key) { statusKey = key; $('#game-status').textContent = t(key); }
  function updateUI() {
    $('#p1-coins').textContent = String(players[0].coins);
    $('#p2-coins').textContent = String(players[1].coins);
    $('#team-count').textContent = `${collected.size} / ${coins.length}`;
    $('#team-progress').style.width = `${collected.size / coins.length * 100}%`;
    $('#completion-status').textContent = t(completed ? 'saved' : won() ? 'completionReady' : 'completionHint');
    $('#complete-module').textContent = t(completed ? 'completed' : 'complete');
    $('#complete-module').disabled = !ready || !won() || completed;
    $('#controller-status').textContent = t(connected ? 'connected' : 'disconnected');
    $('#controller-status').dataset.connected = String(connected);
  }
  function applyLocale() {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
    setStatus(statusKey); updateUI();
  }
  function saveCheckpoint() {
    const state = { collected: [...collected].map(([id, owner]) => ({ id, owner })), positions: players.map(player => Math.round(player.x)) };
    saveChain = saveChain.catch(() => {}).then(async () => {
      const response = await fetch(`/api/modules/${slug}/checkpoint`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, state }) });
      if (!response.ok) throw new Error('checkpoint failed');
    }).catch(() => window.showToast?.(t('saveError'), 'error'));
  }
  function getGamepad() {
    try { return Array.from(navigator.getGamepads?.() || []).find(pad => pad && pad.connected !== false) || null; }
    catch { return null; }
  }
  function readGamepad(pad) {
    if (!pad) return { direction: 0, jump: false };
    const axis = Number(pad.axes?.[0]) || 0;
    const left = axis < -.22 || Boolean(pad.buttons?.[14]?.pressed);
    const right = axis > .22 || Boolean(pad.buttons?.[15]?.pressed);
    return { direction: Number(right) - Number(left), jump: Boolean(pad.buttons?.[0]?.pressed) };
  }
  function movePlayer(player, direction, jump, delta) {
    player.moving = direction !== 0;
    if (direction) player.facing = direction;
    player.x = Math.max(55, Math.min(WIDTH - 55, player.x + direction * 245 * delta));
    if (jump && !player.jumpHeld && player.feetY >= FLOOR_Y) player.velocityY = -600;
    player.jumpHeld = jump;
    player.velocityY += 1450 * delta;
    player.feetY = Math.min(FLOOR_Y, player.feetY + player.velocityY * delta);
    if (player.feetY === FLOOR_Y) player.velocityY = 0;
  }
  function collectPickups() {
    for (const coin of coins) {
      if (collected.has(coin.id)) continue;
      const player = players.map(candidate => ({ candidate, dx: Math.abs(candidate.x - coin.x), dy: Math.abs(candidate.feetY - 65 - coin.y) }))
        .filter(entry => entry.dx <= 32 && entry.dy <= 43)
        .sort((a, b) => a.dx ** 2 + a.dy ** 2 - b.dx ** 2 - b.dy ** 2)[0]?.candidate;
      if (!player) continue;
      collected.set(coin.id, player.id);
      player.coins++;
      setStatus(won() ? 'statusAll' : player.id === 1 ? 'statusOne' : 'statusTwo');
      updateUI(); saveCheckpoint();
    }
  }
  function drawBackdrop() {
    if (background.complete && background.naturalWidth) {
      const cropHeight = background.naturalWidth * HEIGHT / WIDTH;
      ctx.drawImage(background, 0, (background.naturalHeight - cropHeight) / 2, background.naturalWidth, cropHeight, 0, 0, WIDTH, HEIGHT);
    } else { ctx.fillStyle = '#285944'; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
    ctx.fillStyle = '#18352236'; ctx.fillRect(0, FLOOR_Y, WIDTH, HEIGHT - FLOOR_Y);
  }
  function drawCoin(coin) {
    const bob = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : Math.sin(clock * 3 + coin.id) * 4;
    if (coinArt.complete && coinArt.naturalWidth) ctx.drawImage(coinArt, coin.x - 22, coin.y - 22 + bob, 44, 44);
    else { ctx.fillStyle = '#ffda70'; ctx.beginPath(); ctx.arc(coin.x, coin.y + bob, 16, 0, Math.PI * 2); ctx.fill(); }
  }
  function drawPlayer(player) {
    const sheet = player.id === 2 ? blueExplorer : explorer;
    ctx.save();
    ctx.fillStyle = '#0a251c75'; ctx.beginPath(); ctx.ellipse(player.x, FLOOR_Y + 3, 34, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.translate(player.x, player.feetY);
    ctx.scale(player.facing, 1);
    if (sheet?.width && sheet?.height && (sheet !== explorer || explorer.complete && explorer.naturalWidth)) {
      const frame = player.feetY < FLOOR_Y - 2 ? 32 + Math.floor(clock * 10) % 4 : player.moving ? 8 + Math.floor(clock * 10) % 8 : 0;
      ctx.drawImage(sheet, frame % 8 * 256, Math.floor(frame / 8) * 256, 256, 256, -70, -156, 140, 156);
    } else {
      ctx.fillStyle = player.id === 1 ? '#53975a' : '#448db9';
      ctx.fillRect(-20, -110, 40, 105); ctx.fillStyle = '#e1ba89'; ctx.beginPath(); ctx.arc(0, -128, 18, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = player.id === 1 ? '#193f29' : '#164663';
    ctx.fillRect(player.x - 17, player.feetY - 170, 34, 19);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px "DM Mono", monospace'; ctx.textAlign = 'center';
    ctx.fillText(`P${player.id}`, player.x, player.feetY - 156);
  }
  function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT); drawBackdrop();
    for (const coin of coins) if (!collected.has(coin.id)) drawCoin(coin);
    for (const player of players) drawPlayer(player);
  }
  function frame(now) {
    const delta = Math.min(.05, Math.max(0, (now - lastFrame) / 1000)); lastFrame = now; clock += delta;
    const pad = getGamepad();
    const nextConnected = Boolean(pad);
    if (nextConnected !== connected) { connected = nextConnected; if (statusKey === 'statusStart' || statusKey === 'statusConnected') setStatus(connected ? 'statusConnected' : 'statusStart'); updateUI(); }
    if (ready) {
      const left = keys.has('ArrowLeft') || keys.has('KeyA');
      const right = keys.has('ArrowRight') || keys.has('KeyD');
      movePlayer(players[0], Number(right) - Number(left), keys.has('ArrowUp') || keys.has('KeyW') || keys.has('Space'), delta);
      const padInput = readGamepad(pad);
      movePlayer(players[1], padInput.direction, padInput.jump, delta);
      collectPickups();
    }
    draw(); requestAnimationFrame(frame);
  }
  async function loadState() {
    try {
      const [checkpointResponse, modulesResponse] = await Promise.all([
        fetch(`/api/modules/${slug}/checkpoint?learnerId=${encodeURIComponent(learnerId)}`),
        fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`),
      ]);
      if (checkpointResponse.ok) {
        const saved = (await checkpointResponse.json()).state;
        if (saved && typeof saved === 'object') {
          for (const item of Array.isArray(saved.collected) ? saved.collected : []) {
            if (!Number.isInteger(item?.id) || item.id < 0 || item.id >= coins.length || ![1, 2].includes(item.owner) || collected.has(item.id)) continue;
            collected.set(item.id, item.owner); players[item.owner - 1].coins++;
          }
          for (let index = 0; index < 2; index++) if (Number.isFinite(saved.positions?.[index])) players[index].x = Math.max(55, Math.min(WIDTH - 55, saved.positions[index]));
        }
      }
      if (modulesResponse.ok) completed = (await modulesResponse.json()).find(module => module.slug === slug)?.completed === true;
      if (won()) statusKey = 'statusAll';
    } catch { /* The local game remains playable when the network is unavailable. */ }
    finally { ready = true; document.body.dataset.coopReady = 'true'; applyLocale(); }
  }
  window.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(event.code) || event.target.closest?.('input, textarea, select, button, a')) return;
    event.preventDefault(); keys.add(event.code);
  });
  window.addEventListener('keyup', event => { if (keys.has(event.code)) { keys.delete(event.code); event.preventDefault(); } });
  window.addEventListener('blur', () => keys.clear());
  document.addEventListener('visibilitychange', () => { if (document.hidden) keys.clear(); });
  canvas.addEventListener('pointerdown', () => canvas.focus());
  document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => { locale = button.dataset.locale; localStorage.setItem('godot-forge-locale', locale); applyLocale(); }));
  $('#complete-module').addEventListener('click', async () => {
    if (!won() || completed) return;
    const button = $('#complete-module'); button.disabled = true;
    try {
      await saveChain;
      const response = await fetch(`/api/modules/${slug}/progress`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: true }) });
      if (!response.ok) throw new Error('completion failed');
      completed = true; window.showToast?.(t('saved'), 'success'); updateUI();
    } catch { $('#completion-status').textContent = t('saveError'); button.disabled = false; window.showToast?.(t('saveError'), 'error'); }
  });
  applyLocale(); loadState(); requestAnimationFrame(frame);
})();

(() => {
  const $ = selector => document.querySelector(selector);
  const copy = {
    en: {
      pageTitle: 'Multiplayer Game · Godot Forge', back: '← GODOT FORGE / LEARNING PATH', chapter: 'CHAPTER 18 / MULTIPLAYER GAME', language: 'Language', eyebrow: 'LIVE WEBSOCKETS / TWO PLAYERS', title: 'Create a room. Play together.', intro: 'Either player can host. The other joins with the room code, both can chat, and the shared game begins when both mark ready. Try both views on this page or join from another browser.', stepsLabel: 'Multiplayer steps', stepOne: '01 · HOST', stepTwo: '02 · JOIN', stepThree: '03 · CHAT + READY', stepFour: '04 · PLAY', viewsLabel: 'Both player views', playerOneLabel: 'PLAYER 1 VIEW', playerTwoLabel: 'PLAYER 2 VIEW', playerOne: 'Forest Scout', playerTwo: 'Blue Ranger', nameLabel: 'DISPLAY NAME', host: 'HOST GAME', or: 'OR', codeLabel: 'ROOM CODE', join: 'JOIN', roomCodeLabel: 'ROOM', ready: 'READY', unready: 'NOT READY', playAgain: 'READY FOR NEXT ROUND', leave: 'LEAVE ROOM', chatLabel: 'Room chat', chatTitle: 'ROOM CHAT', chatHint: 'Messages go to both players.', chatPlaceholder: 'Send a message', chatInputLabel: 'Chat message', send: 'SEND', gameTitle: 'SHARED FOREST RUN', waitingGame: 'The game appears when both players are ready.', controlsOne: 'PLAYER 1 · A / D MOVE · W JUMP', controlsTwo: 'PLAYER 2 · ← / → MOVE · ↑ JUMP', canvasOne: 'Shared forest game view for Player 1', canvasTwo: 'Shared forest game view for Player 2', completionHint: 'Finish a shared round to complete this module.', completionReady: 'Shared round finished. Complete the module when ready.', complete: 'COMPLETE MODULE', completed: 'MODULE COMPLETED', lessonEyebrow: 'HOW THE NETWORK ROOM WORKS', lessonTitle: 'One room, two live connections.', lessonOne: 'Each player view opens its own WebSocket. The server assigns the room code, relays chat and readiness, and starts the round after both players are ready.', lessonTwo: 'The server owns movement and coin scores, then sends the same game state to both views. If a player leaves, the room returns to the lobby.', artCredit: 'Forest, explorer and coin art reused from the earlier Godot Forge game modules.', promptsEyebrow: 'BUILD PROMPTS', promptsTitle: 'Prompts for the networked room', promptsIntro: 'Open a card to read the exact build prompt. It stays on this page, alongside the working example.', roomPromptTitle: 'WebSocket lobby and chat prompt', gamePromptTitle: 'Synchronized game-state prompt', offline: 'OFFLINE', connecting: 'CONNECTING', online: 'ONLINE', connectionError: 'CONNECTION ERROR', statusStart: 'Host or join a room.', waitingForOther: 'Waiting for the other player.', readyUp: 'Both players are here. Mark ready.', waitingReady: 'Waiting for both players to be ready.', playing: 'Round live · collect the coins!', finished: 'Round complete · ready up to replay.', waiting: 'WAITING', readyBadge: 'READY', chatEmpty: 'Chat messages will appear here.', invalidCode: 'Enter a six-character room code.', roomMissing: 'Room not found. Check the code.', slotTaken: 'That player slot is already taken.', roomFull: 'This room is full.', gameRunning: 'A round is already in progress.', networkError: 'Could not connect to the game server.', saveError: 'Module progress could not be saved.', saved: 'Multiplayer module completed.'
    },
    zh: {
      pageTitle: '多人游戏 · Godot Forge', back: '← GODOT FORGE / 学习路径', chapter: '第 18 章 / 多人游戏', language: '语言', eyebrow: '实时 WEBSOCKET / 双人游戏', title: '创建房间，一起游戏。', intro: '任意玩家都可以主持。另一位输入房间码加入，两人可以聊天，双方准备后共享游戏才会开始。可以在本页同时体验两个视角，也可以从另一浏览器加入。', stepsLabel: '多人游戏步骤', stepOne: '01 · 主持', stepTwo: '02 · 加入', stepThree: '03 · 聊天与准备', stepFour: '04 · 游玩', viewsLabel: '两位玩家的画面', playerOneLabel: '玩家 1 画面', playerTwoLabel: '玩家 2 画面', playerOne: '森林侦察员', playerTwo: '蓝衣游侠', nameLabel: '显示名称', host: '主持游戏', or: '或', codeLabel: '房间码', join: '加入', roomCodeLabel: '房间', ready: '准备好了', unready: '取消准备', playAgain: '准备下一局', leave: '离开房间', chatLabel: '房间聊天', chatTitle: '房间聊天', chatHint: '消息会发送给双方。', chatPlaceholder: '发送消息', chatInputLabel: '聊天消息', send: '发送', gameTitle: '共享森林挑战', waitingGame: '双方准备后游戏将在这里开始。', controlsOne: '玩家 1 · A / D 移动 · W 跳跃', controlsTwo: '玩家 2 · ← / → 移动 · ↑ 跳跃', canvasOne: '玩家 1 的共享森林游戏画面', canvasTwo: '玩家 2 的共享森林游戏画面', completionHint: '完成一局共享游戏即可完成本模块。', completionReady: '共享游戏已结束。准备好后完成模块。', complete: '完成模块', completed: '模块已完成', lessonEyebrow: '网络房间如何运作', lessonTitle: '一个房间，两条实时连接。', lessonOne: '每个玩家画面都有独立的 WebSocket。服务器分配房间码、转发聊天和准备状态，双方准备后开始游戏。', lessonTwo: '服务器负责移动和金币分数，再把同一份游戏状态发送给两个画面。玩家离开时，房间返回大厅。', artCredit: '森林、探险者和金币素材复用 Godot Forge 之前的游戏模块。', promptsEyebrow: '构建提示词', promptsTitle: '网络房间构建提示词', promptsIntro: '展开卡片，在可运行示例旁阅读完整构建提示词。', roomPromptTitle: 'WebSocket 大厅与聊天提示词', gamePromptTitle: '同步游戏状态提示词', offline: '离线', connecting: '连接中', online: '已连接', connectionError: '连接错误', statusStart: '主持或加入房间。', waitingForOther: '等待另一位玩家。', readyUp: '双方已加入，请标记准备。', waitingReady: '等待双方准备。', playing: '游戏进行中 · 收集金币！', finished: '本局结束 · 准备下一局。', waiting: '等待中', readyBadge: '已准备', chatEmpty: '聊天消息将在这里显示。', invalidCode: '请输入六位房间码。', roomMissing: '找不到房间，请检查房间码。', slotTaken: '该玩家位置已被占用。', roomFull: '房间已满。', gameRunning: '游戏正在进行中。', networkError: '无法连接游戏服务器。', saveError: '无法保存模块进度。', saved: '多人游戏模块已完成。'
    },
    ms: {
      pageTitle: 'Permainan Berbilang Pemain · Godot Forge', back: '← GODOT FORGE / LALUAN PEMBELAJARAN', chapter: 'BAB 18 / PERMAINAN BERBILANG PEMAIN', language: 'Bahasa', eyebrow: 'WEBSOCKET LANGSUNG / DUA PEMAIN', title: 'Cipta bilik. Main bersama.', intro: 'Mana-mana pemain boleh menjadi hos. Pemain lain menyertai dengan kod bilik, kedua-duanya boleh bersembang, dan permainan bermula apabila kedua-duanya bersedia. Cuba kedua-dua paparan di halaman ini atau sertai dari pelayar lain.', stepsLabel: 'Langkah permainan berbilang pemain', stepOne: '01 · HOS', stepTwo: '02 · SERTAI', stepThree: '03 · SEMBANG + SEDIA', stepFour: '04 · MAIN', viewsLabel: 'Kedua-dua paparan pemain', playerOneLabel: 'PAPARAN PEMAIN 1', playerTwoLabel: 'PAPARAN PEMAIN 2', playerOne: 'Peninjau Hutan', playerTwo: 'Renjer Biru', nameLabel: 'NAMA PAPARAN', host: 'JADI HOS', or: 'ATAU', codeLabel: 'KOD BILIK', join: 'SERTAI', roomCodeLabel: 'BILIK', ready: 'SEDIA', unready: 'BATAL SEDIA', playAgain: 'SEDIA PUSINGAN SETERUSNYA', leave: 'KELUAR BILIK', chatLabel: 'Sembang bilik', chatTitle: 'SEMBANG BILIK', chatHint: 'Mesej sampai kepada kedua-dua pemain.', chatPlaceholder: 'Hantar mesej', chatInputLabel: 'Mesej sembang', send: 'HANTAR', gameTitle: 'LARIAN HUTAN BERSAMA', waitingGame: 'Permainan muncul apabila kedua-dua pemain bersedia.', controlsOne: 'PEMAIN 1 · A / D GERAK · W LOMPAT', controlsTwo: 'PEMAIN 2 · ← / → GERAK · ↑ LOMPAT', canvasOne: 'Paparan permainan hutan bersama untuk Pemain 1', canvasTwo: 'Paparan permainan hutan bersama untuk Pemain 2', completionHint: 'Tamatkan satu pusingan bersama untuk menyelesaikan modul.', completionReady: 'Pusingan bersama selesai. Selesaikan modul apabila sedia.', complete: 'SELESAIKAN MODUL', completed: 'MODUL SELESAI', lessonEyebrow: 'CARA BILIK RANGKAIAN BERFUNGSI', lessonTitle: 'Satu bilik, dua sambungan langsung.', lessonOne: 'Setiap paparan pemain membuka WebSocket sendiri. Pelayan memberikan kod bilik, menyampaikan sembang dan status sedia, lalu memulakan pusingan apabila kedua-duanya bersedia.', lessonTwo: 'Pelayan mengawal gerakan dan markah syiling, kemudian menghantar keadaan permainan yang sama kepada kedua-dua paparan. Jika pemain keluar, bilik kembali ke lobi.', artCredit: 'Seni hutan, penjelajah dan syiling digunakan semula daripada modul permainan Godot Forge terdahulu.', promptsEyebrow: 'PROM BINA', promptsTitle: 'Prom untuk bilik rangkaian', promptsIntro: 'Buka kad untuk membaca prom bina lengkap di sebelah contoh yang berfungsi.', roomPromptTitle: 'Prom lobi dan sembang WebSocket', gamePromptTitle: 'Prom keadaan permainan terselaras', offline: 'LUAR TALIAN', connecting: 'MENGHUBUNG', online: 'DALAM TALIAN', connectionError: 'RALAT SAMBUNGAN', statusStart: 'Jadi hos atau sertai bilik.', waitingForOther: 'Menunggu pemain lain.', readyUp: 'Kedua-dua pemain sudah ada. Tandakan sedia.', waitingReady: 'Menunggu kedua-dua pemain sedia.', playing: 'Pusingan berjalan · kumpul syiling!', finished: 'Pusingan tamat · sedia untuk main lagi.', waiting: 'MENUNGGU', readyBadge: 'SEDIA', chatEmpty: 'Mesej sembang akan muncul di sini.', invalidCode: 'Masukkan kod bilik enam aksara.', roomMissing: 'Bilik tidak dijumpai. Semak kod.', slotTaken: 'Tempat pemain itu sudah diambil.', roomFull: 'Bilik ini penuh.', gameRunning: 'Pusingan sedang berjalan.', networkError: 'Tidak dapat menyambung ke pelayan permainan.', saveError: 'Kemajuan modul tidak dapat disimpan.', saved: 'Modul berbilang pemain selesai.'
    },
  };
  let locale = localStorage.getItem('godot-forge-locale') || 'en';
  if (!copy[locale]) locale = 'en';
  const t = key => copy[locale][key] || copy.en[key];
  const learnerKey = 'godot-forge-learner-id';
  let learnerId = localStorage.getItem(learnerKey);
  if (!learnerId) { learnerId = crypto.randomUUID().replace(/-/g, ''); localStorage.setItem(learnerKey, learnerId); }
  const panels = [1, 2].map(slot => ({ slot, root: $(`#seat-${slot}`), socket: null, room: null, game: null, joined: false, pending: false, error: '', connection: 'offline' }));
  const keys = new Set();
  let completed = false;
  let playedRound = false;
  let saveBusy = false;
  let animationTime = 0;
  const background = new Image(); background.crossOrigin = 'anonymous'; background.src = 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/forest-arena.webp';
  const explorer = new Image(); explorer.crossOrigin = 'anonymous'; explorer.src = 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/items-spawning/images/forest-sword-explorer.png';
  const coinArt = new Image(); coinArt.crossOrigin = 'anonymous'; coinArt.src = 'https://godot-forge.sgp1.digitaloceanspaces.com/2d-game-development/game-achievement/images/gold-coin.webp';
  for (const asset of [background, explorer, coinArt]) asset.onload = () => panels.forEach(drawPanel);

  function send(panel, payload) { if (panel.socket?.readyState === WebSocket.OPEN) panel.socket.send(JSON.stringify(payload)); }
  function errorText(code, fallback) {
    return t({ room_missing: 'roomMissing', slot_taken: 'slotTaken', room_full: 'roomFull', game_running: 'gameRunning', invalid_slot: 'slotTaken' }[code]) || fallback || t('networkError');
  }
  function updateCompletion() {
    $('#completion-status').textContent = t(completed ? 'saved' : playedRound ? 'completionReady' : 'completionHint');
    $('#complete-module').textContent = t(completed ? 'completed' : 'complete');
    $('#complete-module').disabled = !playedRound || completed || saveBusy;
  }
  function roomStatus(panel) {
    if (panel.error) return panel.error;
    const room = panel.room;
    if (!room) return t('statusStart');
    if (room.phase === 'playing') return t('playing');
    if (room.phase === 'finished') return t('finished');
    return room.members.length < 2 ? t('waitingForOther') : room.members.every(member => member.ready) ? t('waitingReady') : t('readyUp');
  }
  function renderChat(panel) {
    const host = panel.root.querySelector('.chat-messages');
    host.replaceChildren();
    const entries = panel.room?.chat || [];
    if (!entries.length) {
      const empty = document.createElement('li'); empty.className = 'chat-empty'; empty.textContent = t('chatEmpty'); host.append(empty); return;
    }
    for (const entry of entries) {
      const row = document.createElement('li');
      const name = document.createElement('strong'); name.textContent = `${entry.name}: `;
      row.append(name, document.createTextNode(entry.text)); host.append(row);
    }
    host.scrollTop = host.scrollHeight;
  }
  function renderPanel(panel) {
    const root = panel.root, room = panel.room;
    const connection = root.querySelector('.seat-connection');
    connection.dataset.connection = panel.connection;
    connection.textContent = t(panel.connection === 'error' ? 'connectionError' : panel.connection);
    root.querySelector('.room-code').textContent = room?.code || '—';
    root.querySelector('.phase-label').textContent = roomStatus(panel);
    for (const slot of [1, 2]) {
      const member = room?.members.find(item => item.slot === slot);
      const element = root.querySelector(`.member--${slot === 1 ? 'one' : 'two'}`);
      element.textContent = `P${slot} · ${member ? `${member.name}${member.ready ? ` · ${t('readyBadge')}` : ''}` : t('waiting')}`;
      element.dataset.ready = String(Boolean(member?.ready));
    }
    const active = panel.joined && Boolean(room);
    root.querySelector('.host-button').disabled = active || panel.pending;
    root.querySelector('.join-button').disabled = active || panel.pending;
    root.querySelector('.name-input').disabled = active || panel.pending;
    root.querySelector('.code-input').disabled = active || panel.pending;
    root.querySelector('.leave-button').disabled = !active;
    const own = room?.members.find(member => member.slot === panel.slot);
    const ready = root.querySelector('.ready-button');
    ready.disabled = !active || room.phase === 'playing';
    ready.textContent = t(own?.ready ? 'unready' : room?.phase === 'finished' ? 'playAgain' : 'ready');
    root.querySelector('.chat-input').disabled = !active;
    root.querySelector('.chat-form button').disabled = !active;
    const overlay = root.querySelector('.game-overlay');
    overlay.hidden = Boolean(panel.game && (room?.phase === 'playing' || room?.phase === 'finished'));
    const scores = panel.game?.players || [];
    root.querySelector('.score-label').textContent = `P1 ${scores.find(player => player.slot === 1)?.score || 0} · P2 ${scores.find(player => player.slot === 2)?.score || 0}`;
    renderChat(panel);
    drawPanel(panel);
  }
  function applyLocale() {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : locale;
    document.title = t('pageTitle');
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    document.querySelectorAll('[data-locale]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.locale === locale)));
    panels.forEach(renderPanel); updateCompletion();
  }
  function drawPanel(panel) {
    const canvas = panel.root.querySelector('.game-canvas'), ctx = canvas.getContext('2d');
    const width = canvas.width, height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    if (background.complete && background.naturalWidth) {
      const cropHeight = background.naturalWidth * height / width;
      ctx.drawImage(background, 0, (background.naturalHeight - cropHeight) / 2, background.naturalWidth, cropHeight, 0, 0, width, height);
    } else { ctx.fillStyle = '#315b47'; ctx.fillRect(0, 0, width, height); }
    const game = panel.game || { players: [{ slot: 1, x: 55, feetY: 318, facing: 1 }, { slot: 2, x: 665, feetY: 318, facing: -1 }], collected: [], coins: [100, 170, 245, 320, 400, 475, 550, 620].map((x, id) => ({ id, x, y: 318 - (id % 3 === 1 ? 96 : 36) })) };
    for (const coin of game.coins || []) {
      if (game.collected?.includes(coin.id)) continue;
      const bob = Math.sin(animationTime / 390 + coin.id) * 3;
      if (coinArt.complete && coinArt.naturalWidth) ctx.drawImage(coinArt, coin.x - 17, coin.y - 17 + bob, 34, 34);
      else { ctx.fillStyle = '#ffda75'; ctx.beginPath(); ctx.arc(coin.x, coin.y + bob, 12, 0, Math.PI * 2); ctx.fill(); }
    }
    for (const player of game.players || []) {
      ctx.save();
      ctx.fillStyle = player.slot === panel.slot ? '#eaffab' : '#d8ebd7';
      ctx.beginPath(); ctx.ellipse(player.x, 320, 27, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.translate(player.x, player.feetY);
      ctx.scale(player.facing || 1, 1);
      if (player.slot === 2) ctx.filter = 'hue-rotate(135deg)';
      if (explorer.complete && explorer.naturalWidth) {
        const frame = player.feetY < 315 ? 32 + Math.floor(animationTime / 120) % 4 : player.moving ? 8 + Math.floor(animationTime / 105) % 8 : 0;
        ctx.drawImage(explorer, frame % 8 * 256, Math.floor(frame / 8) * 256, 256, 256, -52, -114, 104, 114);
      } else { ctx.fillStyle = player.slot === 1 ? '#5a9d64' : '#4d9ac9'; ctx.fillRect(-16, -80, 32, 78); }
      ctx.restore();
      ctx.fillStyle = player.slot === 1 ? '#295b32' : '#1b6386';
      ctx.fillRect(player.x - 16, player.feetY - 126, 32, 18);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px "DM Mono", monospace'; ctx.textAlign = 'center';
      ctx.fillText(`P${player.slot}`, player.x, player.feetY - 113);
    }
  }
  function drawLoop(time) { animationTime = time; panels.forEach(drawPanel); requestAnimationFrame(drawLoop); }
  function handlePacket(panel, packet) {
    if (packet.type === 'joined') {
      panel.joined = true; panel.pending = false; panel.room = packet.room; panel.error = '';
      const other = panels.find(item => item !== panel);
      if (other && !other.joined) other.root.querySelector('.code-input').value = packet.room.code;
    } else if (packet.type === 'room') {
      const wasPlaying = panel.room?.phase === 'playing';
      if (packet.room.phase === 'lobby' && panel.room?.phase !== 'lobby') panel.game = null;
      panel.room = packet.room; panel.error = '';
      if (wasPlaying && packet.room.phase === 'finished') playedRound = true;
    } else if (packet.type === 'chat') {
      if (panel.room) { panel.room.chat = [...panel.room.chat, packet.entry].slice(-30); }
    } else if (packet.type === 'state') {
      panel.game = packet.state;
    } else if (packet.type === 'left') {
      panel.joined = false; panel.room = null; panel.game = null; panel.error = '';
    } else if (packet.type === 'error') {
      panel.pending = false; panel.error = errorText(packet.code, packet.message);
      window.showToast?.(panel.error, 'error');
    }
    renderPanel(panel); updateCompletion();
  }
  function connect(panel) {
    if (panel.socket?.readyState === WebSocket.OPEN) return Promise.resolve();
    if (panel.openPromise) return panel.openPromise;
    panel.connection = 'connecting'; renderPanel(panel);
    panel.openPromise = new Promise((resolve, reject) => {
      const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${location.host}/ws/multiplayer`);
      panel.socket = ws;
      let opened = false;
      ws.addEventListener('open', () => { opened = true; panel.connection = 'online'; panel.error = ''; renderPanel(panel); resolve(); });
      ws.addEventListener('message', event => { try { handlePacket(panel, JSON.parse(event.data)); } catch { /* Ignore malformed server messages. */ } });
      ws.addEventListener('close', () => {
        if (panel.socket !== ws) return;
        panel.socket = null; panel.joined = false; panel.room = null; panel.game = null; panel.pending = false;
        panel.connection = opened ? 'offline' : 'error'; panel.error = opened ? '' : t('networkError');
        renderPanel(panel);
        if (!opened) reject(new Error('WebSocket connection failed'));
      });
      ws.addEventListener('error', () => { if (!opened) panel.connection = 'error'; });
    }).finally(() => { panel.openPromise = null; });
    return panel.openPromise;
  }
  async function enterRoom(panel, type) {
    const code = panel.root.querySelector('.code-input').value.trim().toUpperCase();
    if (type === 'join' && !/^[A-F0-9]{6}$/.test(code)) { panel.error = t('invalidCode'); renderPanel(panel); return; }
    panel.pending = true; panel.error = ''; renderPanel(panel);
    try {
      await connect(panel);
      send(panel, { type, slot: panel.slot, name: panel.root.querySelector('.name-input').value, code });
    } catch { panel.pending = false; panel.error = t('networkError'); renderPanel(panel); }
  }
  function sendInput() {
    for (const panel of panels) {
      if (!panel.joined || panel.room?.phase !== 'playing') continue;
      const one = panel.slot === 1;
      send(panel, { type: 'input', left: keys.has(one ? 'KeyA' : 'ArrowLeft'), right: keys.has(one ? 'KeyD' : 'ArrowRight'), jump: keys.has(one ? 'KeyW' : 'ArrowUp') });
    }
  }

  for (const panel of panels) {
    panel.root.querySelector('.host-button').addEventListener('click', () => enterRoom(panel, 'host'));
    panel.root.querySelector('.join-button').addEventListener('click', () => enterRoom(panel, 'join'));
    panel.root.querySelector('.code-input').addEventListener('input', event => { event.target.value = event.target.value.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 6); });
    panel.root.querySelector('.ready-button').addEventListener('click', () => {
      const own = panel.room?.members.find(member => member.slot === panel.slot);
      send(panel, { type: 'ready', ready: !own?.ready });
    });
    panel.root.querySelector('.leave-button').addEventListener('click', () => send(panel, { type: 'leave' }));
    panel.root.querySelector('.chat-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = panel.root.querySelector('.chat-input');
      const value = input.value.trim(); if (!value) return;
      send(panel, { type: 'chat', text: value }); input.value = '';
    });
  }
  window.addEventListener('keydown', event => {
    if (!['KeyA', 'KeyD', 'KeyW', 'ArrowLeft', 'ArrowRight', 'ArrowUp'].includes(event.code) || event.target.closest?.('input, textarea, select, [contenteditable]')) return;
    event.preventDefault();
    if (!keys.has(event.code)) { keys.add(event.code); sendInput(); }
  });
  window.addEventListener('keyup', event => { if (keys.delete(event.code)) { event.preventDefault(); sendInput(); } });
  window.addEventListener('blur', () => { keys.clear(); sendInput(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { keys.clear(); sendInput(); } });
  document.querySelectorAll('[data-locale]').forEach(button => button.addEventListener('click', () => { locale = button.dataset.locale; localStorage.setItem('godot-forge-locale', locale); applyLocale(); }));
  $('#complete-module').addEventListener('click', async () => {
    if (!playedRound || completed || saveBusy) return;
    saveBusy = true; updateCompletion();
    try {
      const response = await fetch('/api/modules/multiplayer-game/progress', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ learnerId, completed: true }) });
      if (!response.ok) throw new Error('save failed');
      completed = true; window.showToast?.(t('saved'), 'success');
    } catch { window.showToast?.(t('saveError'), 'error'); }
    finally { saveBusy = false; updateCompletion(); }
  });
  async function loadProgress() {
    try {
      const response = await fetch(`/api/modules?learnerId=${encodeURIComponent(learnerId)}`);
      if (response.ok) completed = (await response.json()).find(module => module.slug === 'multiplayer-game')?.completed === true;
    } catch { /* Room play remains available if progress is offline. */ }
    updateCompletion();
  }
  applyLocale(); loadProgress(); requestAnimationFrame(drawLoop);
})();

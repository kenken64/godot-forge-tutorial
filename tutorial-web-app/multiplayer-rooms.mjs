import { randomBytes } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';

const WIDTH = 720;
const FLOOR_Y = 318;
const COINS = [100, 170, 245, 320, 400, 475, 550, 620].map((x, id) => ({ id, x, y: FLOOR_Y - (id % 3 === 1 ? 96 : 36) }));
const TICK_MS = 50;

export function attachMultiplayerRooms(server) {
  const rooms = new Map();
  const wss = new WebSocketServer({ noServer: true, maxPayload: 4096, perMessageDeflate: false });

  const send = (ws, payload) => { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload)); };
  const members = room => [...room.members.values()].sort((a, b) => a.slot - b.slot);
  const snapshot = room => ({
    code: room.code,
    phase: room.phase,
    round: room.round,
    members: members(room).map(({ slot, name, ready }) => ({ slot, name, ready })),
    chat: room.chat.slice(-30),
  });
  const broadcast = (room, payload) => members(room).forEach(member => send(member.ws, payload));
  const announce = room => broadcast(room, { type: 'room', room: snapshot(room) });
  const error = (ws, code, message) => send(ws, { type: 'error', code, message });

  function leave(ws, notify = true) {
    const room = ws.room;
    if (!room) return;
    const member = room.members.get(ws.slot);
    if (member?.ws === ws) room.members.delete(ws.slot);
    ws.room = null;
    ws.slot = null;
    if (notify) send(ws, { type: 'left' });
    if (!room.members.size) { rooms.delete(room.code); return; }
    room.phase = 'lobby';
    room.game = null;
    for (const remaining of room.members.values()) remaining.ready = false;
    announce(room);
  }

  function joinRoom(ws, room, slot, name) {
    if (![1, 2].includes(slot)) return error(ws, 'invalid_slot', 'Choose Player 1 or Player 2.');
    if (room.members.has(slot)) return error(ws, 'slot_taken', `Player ${slot} is already in this room.`);
    if (room.members.size >= 2) return error(ws, 'room_full', 'This room already has two players.');
    if (room.phase === 'playing') return error(ws, 'game_running', 'Wait for the current round to finish.');
    leave(ws, false);
    if (room.phase === 'finished') {
      room.phase = 'lobby';
      room.game = null;
      for (const existing of room.members.values()) existing.ready = false;
    }
    const cleanName = String(name || `Player ${slot}`).replace(/[\p{Cc}\p{Cf}]/gu, '').trim().slice(0, 24) || `Player ${slot}`;
    const member = { slot, name: cleanName, ready: false, ws, input: { left: false, right: false, jump: false }, jumpHeld: false };
    room.members.set(slot, member);
    ws.room = room;
    ws.slot = slot;
    send(ws, { type: 'joined', slot, room: snapshot(room) });
    announce(room);
  }

  function startRoom(room) {
    room.phase = 'playing';
    room.round++;
    room.game = {
      players: members(room).map(member => ({ slot: member.slot, x: member.slot === 1 ? 55 : 665, feetY: FLOOR_Y, velocityY: 0, facing: member.slot === 1 ? 1 : -1, score: 0 })),
      collected: [],
      coins: COINS,
    };
    for (const member of room.members.values()) { member.input = { left: false, right: false, jump: false }; member.jumpHeld = false; }
    announce(room);
    broadcast(room, { type: 'state', state: room.game });
  }

  function updateRoom(room) {
    if (room.phase !== 'playing' || !room.game) return;
    const game = room.game;
    for (const player of game.players) {
      const member = room.members.get(player.slot);
      const input = member?.input || {};
      const direction = Number(Boolean(input.right)) - Number(Boolean(input.left));
      player.moving = direction !== 0;
      if (direction) player.facing = direction;
      player.x = Math.max(35, Math.min(WIDTH - 35, player.x + direction * 190 * TICK_MS / 1000));
      if (input.jump && !member?.jumpHeld && player.feetY >= FLOOR_Y) player.velocityY = -390;
      if (member) member.jumpHeld = Boolean(input.jump);
      player.velocityY += 1150 * TICK_MS / 1000;
      player.feetY = Math.min(FLOOR_Y, player.feetY + player.velocityY * TICK_MS / 1000);
      if (player.feetY === FLOOR_Y) player.velocityY = 0;
    }
    for (const coin of COINS) {
      if (game.collected.includes(coin.id)) continue;
      const winner = game.players.map(player => ({ player, distance: Math.hypot(player.x - coin.x, player.feetY - 44 - coin.y) }))
        .filter(entry => entry.distance < 34)
        .sort((a, b) => a.distance - b.distance)[0]?.player;
      if (winner) { game.collected.push(coin.id); winner.score++; }
    }
    if (game.collected.length === COINS.length) {
      room.phase = 'finished';
      for (const member of room.members.values()) member.ready = false;
      announce(room);
    }
    broadcast(room, { type: 'state', state: game });
  }

  function handleMessage(ws, raw) {
    let message;
    try { message = JSON.parse(String(raw)); }
    catch { return error(ws, 'invalid_message', 'Send valid JSON.'); }
    if (!message || typeof message !== 'object') return error(ws, 'invalid_message', 'Send a valid room action.');
    const slot = Number(message.slot);
    if (message.type === 'host') {
      if (![1, 2].includes(slot)) return error(ws, 'invalid_slot', 'Choose Player 1 or Player 2.');
      let code;
      do { code = randomBytes(3).toString('hex').toUpperCase(); } while (rooms.has(code));
      const room = { code, phase: 'lobby', round: 0, members: new Map(), chat: [], game: null };
      rooms.set(code, room);
      joinRoom(ws, room, slot, message.name);
      return;
    }
    if (message.type === 'join') {
      const code = String(message.code || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room) return error(ws, 'room_missing', 'Room not found. Check the code and try again.');
      joinRoom(ws, room, slot, message.name);
      return;
    }
    if (message.type === 'leave') { leave(ws); return; }
    const room = ws.room;
    if (!room || room.members.get(ws.slot)?.ws !== ws) return error(ws, 'not_in_room', 'Join a room first.');
    const member = room.members.get(ws.slot);
    if (message.type === 'chat') {
      const text = String(message.text || '').replace(/[\p{Cc}\p{Cf}]/gu, '').trim().slice(0, 280);
      if (!text) return;
      const entry = { slot: member.slot, name: member.name, text, at: Date.now() };
      room.chat.push(entry);
      if (room.chat.length > 30) room.chat.shift();
      broadcast(room, { type: 'chat', entry });
      return;
    }
    if (message.type === 'ready') {
      if (room.phase === 'playing') return;
      member.ready = message.ready === true;
      announce(room);
      if (room.members.size === 2 && members(room).every(player => player.ready)) startRoom(room);
      return;
    }
    if (message.type === 'input' && room.phase === 'playing') {
      member.input = { left: message.left === true, right: message.right === true, jump: message.jump === true };
    }
  }

  server.on('upgrade', (request, socket, head) => {
    let pathname;
    try { pathname = new URL(request.url, `http://${request.headers.host}`).pathname; }
    catch { socket.destroy(); return; }
    if (pathname !== '/ws/multiplayer') { socket.destroy(); return; }
    try {
      if (request.headers.origin && new URL(request.headers.origin).host !== request.headers.host) { socket.destroy(); return; }
    } catch { socket.destroy(); return; }
    wss.handleUpgrade(request, socket, head, ws => wss.emit('connection', ws, request));
  });
  wss.on('connection', ws => {
    ws.on('message', raw => handleMessage(ws, raw));
    ws.on('close', () => leave(ws, false));
    ws.on('error', () => leave(ws, false));
  });
  const timer = setInterval(() => { for (const room of rooms.values()) updateRoom(room); }, TICK_MS);
  server.on('close', () => { clearInterval(timer); wss.close(); });
  return { rooms };
}

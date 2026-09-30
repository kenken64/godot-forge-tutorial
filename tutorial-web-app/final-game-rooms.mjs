import { randomBytes } from 'node:crypto';
import { WebSocket, WebSocketServer } from 'ws';

// A small two-peer relay for the Final Game Godot tutorial. The host simulates
// the world; the relay only assigns a room code and forwards input/snapshots.
export function attachFinalGameRooms(server) {
  const rooms = new Map();
  const wss = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024, perMessageDeflate: false });
  const send = (socket, message) => {
    if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  };

  function leave(socket) {
    const room = socket.room;
    if (!room) return;
    socket.room = null;
    if (room.host === socket) {
      send(room.guest, { type: 'peer_left' });
      if (room.guest) room.guest.room = null;
      rooms.delete(room.code);
    } else if (room.guest === socket) {
      room.guest = null;
      send(room.host, { type: 'peer_left' });
    }
  }

  function receive(socket, raw) {
    let message;
    try { message = JSON.parse(String(raw)); }
    catch { return send(socket, { type: 'error', message: 'Invalid message.' }); }
    if (!message || typeof message !== 'object') return;
    if (message.type === 'host') {
      if (rooms.size >= 100) return send(socket, { type: 'error', message: 'Room limit reached.' });
      leave(socket);
      let code;
      do { code = randomBytes(3).toString('hex').toUpperCase(); } while (rooms.has(code));
      const room = { code, host: socket, guest: null };
      rooms.set(code, room);
      socket.room = room;
      send(socket, { type: 'joined', code, slot: 1 });
      return;
    }
    if (message.type === 'join') {
      const code = String(message.code || '').trim().toUpperCase();
      const room = rooms.get(code);
      if (!room || room.guest) return send(socket, { type: 'error', message: 'Room unavailable.' });
      leave(socket);
      room.guest = socket;
      socket.room = room;
      send(socket, { type: 'joined', code, slot: 2 });
      send(room.host, { type: 'peer_joined' });
      return;
    }
    const room = socket.room;
    if (!room) return send(socket, { type: 'error', message: 'Join a room first.' });
    if (message.type === 'input' && room.guest === socket) {
      send(room.host, {
        type: 'input', axis: Number(message.axis) || 0,
        jump: message.jump === true, attack: message.attack === true,
        interact: message.interact === true,
      });
    } else if (message.type === 'trade' && room.guest === socket) {
      const action = String(message.action || '');
      if (['buy', 'sell', 'salvage'].includes(action)) send(room.host, { type: 'trade', action });
    } else if (message.type === 'state' && room.host === socket) {
      send(room.guest, message);
    }
  }

  server.on('upgrade', (request, socket, head) => {
    let pathname;
    try { pathname = new URL(request.url, `http://${request.headers.host}`).pathname; }
    catch { socket.destroy(); return; }
    if (pathname !== '/ws/final-game') return;
    // Godot runs on the separate cloud editor host, so its Origin differs from
    // the lesson site. Room codes and a two-player limit scope each session.
    wss.handleUpgrade(request, socket, head, ws => wss.emit('connection', ws));
  });
  wss.on('connection', socket => {
    socket.on('message', raw => receive(socket, raw));
    socket.on('close', () => leave(socket));
    socket.on('error', () => leave(socket));
  });
  server.on('close', () => wss.close());
  return { rooms };
}

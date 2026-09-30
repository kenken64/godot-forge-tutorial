import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { WebSocket } from 'ws';
import { attachMultiplayerRooms } from '../multiplayer-rooms.mjs';
import { attachFinalGameRooms } from '../final-game-rooms.mjs';

function nextMessage(socket) {
  return new Promise(resolve => socket.once('message', raw => resolve(JSON.parse(String(raw)))));
}

test('Final Game room relays only guest input and host world state', async () => {
  const server = createServer();
  attachMultiplayerRooms(server);
  attachFinalGameRooms(server);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = `ws://127.0.0.1:${server.address().port}/ws/final-game`;
  const host = new WebSocket(address);
  const guest = new WebSocket(address, { origin: 'https://cloud-editor.example' });
  try {
    await Promise.all([once(host, 'open'), once(guest, 'open')]);
    const hostJoined = nextMessage(host);
    host.send(JSON.stringify({ type: 'host' }));
    const room = await hostJoined;
    assert.match(room.code, /^[A-F0-9]{6}$/);
    assert.equal(room.slot, 1);

    const guestJoined = nextMessage(guest);
    const hostNotice = nextMessage(host);
    guest.send(JSON.stringify({ type: 'join', code: room.code }));
    assert.deepEqual(await guestJoined, { type: 'joined', code: room.code, slot: 2 });
    assert.deepEqual(await hostNotice, { type: 'peer_joined' });

    const input = nextMessage(host);
    guest.send(JSON.stringify({ type: 'input', axis: 1, jump: true, attack: false, interact: false }));
    assert.deepEqual(await input, { type: 'input', axis: 1, jump: true, attack: false, interact: false });

    const trade = nextMessage(host);
    guest.send(JSON.stringify({ type: 'trade', action: 'salvage' }));
    assert.deepEqual(await trade, { type: 'trade', action: 'salvage' });

    const state = nextMessage(guest);
    host.send(JSON.stringify({ type: 'state', score: 120, coins: 8 }));
    assert.deepEqual(await state, { type: 'state', score: 120, coins: 8 });

    const left = nextMessage(host);
    guest.close();
    assert.deepEqual(await left, { type: 'peer_left' });
  } finally {
    host.close();
    guest.close();
    await new Promise(resolve => server.close(resolve));
  }
});

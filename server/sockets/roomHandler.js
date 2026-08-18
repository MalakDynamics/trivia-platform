import {
  gameRooms,
  createRoom,
  joinRoom,
  setPlayerName,
  removePlayer,
  getPlayerList,
} from '../state/rooms.js';

export const registerRoomHandlers = (io, socket) => {
  socket.on('room:create', (ack) => {
    const { roomCode } = createRoom(socket.id);
    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    ack({ ok: true, code: roomCode });
  });

  socket.on('room:join', (roomCode, role, ack) => {
    const result = joinRoom(roomCode, socket.id, role);
    if (!result.ok) return ack(result);

    socket.join(roomCode);
    socket.data.roomCode = roomCode;
    io.to(roomCode).emit('room:playerList', getPlayerList(result.room));
    ack({ ok: true });
  });

  socket.on('player:set-name', (userName) => {
    const room = gameRooms.get(socket.data.roomCode);
    if (!room) return;

    setPlayerName(room, socket.id, userName);
    io.to(socket.data.roomCode).emit('room:playerList', getPlayerList(room));
  });

  socket.on('disconnect', () => {
    const room = gameRooms.get(socket.data.roomCode);
    if (!room) return;

    removePlayer(room, socket.id);
    io.to(socket.data.roomCode).emit('room:playerList', getPlayerList(room));
  });
};
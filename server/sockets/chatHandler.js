import { gameRooms } from '../state/rooms.js';
import { buildMessage } from '../state/chat.js';

export const registerChatHandlers = (io, socket) => {
  socket.on('room:message', (text) => {
    const roomCode = socket.data.roomCode;
    const room = gameRooms.get(roomCode);
    if (!room) return;

    const message = buildMessage(room, socket.id, text);
    if (!message) return;

    io.to(roomCode).emit('room:message', message);
  });
};
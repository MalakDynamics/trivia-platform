import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { gameRooms } from './state/rooms.js';
import { registerRoomHandlers } from './sockets/roomHandler.js';
import { registerChatHandlers } from './sockets/chatHandler.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://192.168.50.32:5173'],
    methods: ['GET', 'POST'],
  },
});

// TEST ENTRY: DELETE LATER
gameRooms.set('AAAA', { players: new Map(), host: null, board: null, phase: 'lobby' });

io.on('connection', (socket) => {
  console.log('connected', socket.id);

  registerRoomHandlers(io, socket);
  registerChatHandlers(io, socket);
  // TODO: registerGameHandlers(io, socket) — player:buzz, buzzer:reset
  //       buzzWinner needs to live on the room, not as a server-wide array

  socket.on('disconnect', () => console.log('disconnected', socket.id));
});

httpServer.listen(3000, () => console.log('http://localhost:3000'));
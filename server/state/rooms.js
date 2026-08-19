const MAX_PLAYERS = 8;

export const gameRooms = new Map();

const getRandomChar = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

const getStringOfFour = () => {
  let letters = '';
  for (let i = 0; i < 4; i++) letters += getRandomChar();
  return letters;
};

const usernameDuplicateProtection = (name, room) => {
  const suffixes = ['Jr.', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const userList = getPlayerList(room);
  if (!userList.includes(name)) return name;

  for (const suffix of suffixes) {
    const potentialName = `${name} ${suffix}`;
    if (!userList.includes(potentialName)) return potentialName;
  }
  return `${name} ${crypto.randomUUID().slice(0, 4)}`; 
};

/* EXPORT API */

export const getPlayerList = (room) =>
  [...room.players.values()].map((user) => user.name);

export const createRoom = (boardSocketId) => {
  let roomCode = getStringOfFour();
  while (gameRooms.has(roomCode)) roomCode = getStringOfFour();

  const room = {
    players: new Map(),
    host: null,
    board: boardSocketId,
    phase: 'lobby',
    game: null,
  };
  gameRooms.set(roomCode, room);

  return { ok: true, roomCode, room };
};

export const joinRoom = (roomCode, socketId, role) => {
  const room = gameRooms.get(roomCode);
  if (!room) return { ok: false, error: 'room-not-found' };

  if (role === 'player') {
    if (room.players.size >= MAX_PLAYERS) return { ok: false, error: 'room-full' };
    room.players.set(socketId, { name: null, ready: false });
  } else if (role === 'board') {
    room.board = socketId;
  } else {
    return { ok: false, error: 'invalid-role' };
  }

  return { ok: true, room };
};

export const setPlayerName = (room, socketId, name) => {
  const player = room.players.get(socketId);
  if (!player) return { ok: false, error: 'not-in-room' };

  player.name = usernameDuplicateProtection(name, room);
  return { ok: true, name: player.name };
};

export const removePlayer = (room, socketId) => {
  room.players.delete(socketId);
};
/*
HUGE ISSUE: 
THis setup does not currently protect on refresh and will exit a game
Need

*/

import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.50.32:5173"],
    methods: ["GET", "POST"]
  }
});

const gameRooms = new Map();
const buzzWinner = [];



// Utility functions to generate room code
const getRandomChar = () => {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    return letter;
}

const getStringOfFour = () => {
    let letters = '';
    for (let i = 0; i < 4; i++) {
        letters += getRandomChar()
    }
    return letters
} 

const usernameDuplicateProtection = (name, room) => {
    const suffixes = ['Jr.', 'III', 'IV', 'V',
        'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
    ]
    let userList = [...room.players.values()].map(user => user.name); 
    if (!userList.includes(name)) return name;

    for (const suffix of suffixes) {
        const potentialName = name + ' ' + suffix;
        if (!userList.includes(potentialName)) return potentialName;
    }
}

// TEST ENTRY: DELETE LATER
gameRooms.set('AAAA', {players: new Map(), phase: 'lobby'})

/*
Need to build function that determines who clicked in first, 
but for now I will be using a firstClick constant for testing
*/
const TEMP_FIRST_CLICK = true;

const determineBuzzWinner = (userId) => {
    if (buzzWinner.length == 0) {
        buzzWinner.push(userId);
        return true;
    } else {
        buzzWinner.push(userId);
        return false;
    };
};

io.on("connection", (socket) => {
    let currentRoom = null; // stores gameroom for individual player

    console.log("connected", socket.id);
    
    // add username to userNames map
    socket.on('player:set-name', (userName) => {
        let room = gameRooms.get(currentRoom);
        const transformedUsername = usernameDuplicateProtection(userName, room)

        room.players.set(socket.id, {name: transformedUsername, ready: false});

        let userList = [...room.players.values()].map(user => user.name);        
        io.to(currentRoom).emit('room:playerList', userList)
    })
    
    socket.on('player:buzz', () => {
        let winner = determineBuzzWinner(socket.id)
        console.log('Did you win?: ', winner);
    })

    socket.on('buzzer:reset', () => {
        buzzWinner.length = 0;
    })

    socket.on('room:join', (roomCode) => {
        const roomExists = gameRooms.has(roomCode); 
        let gameRoom;
        console.log(`${socket.id} tried using room code ${roomCode}. Result: ${gameRooms.has(roomCode)}`)
        if (!roomExists) {
            socket.emit('room:joined', [false, gameRoom, roomCode]);
            return;
        }

        socket.join(roomCode);
        currentRoom = roomCode;
        gameRoom = gameRooms.get(currentRoom)

        socket.emit('room:joined', [true, gameRoom, roomCode])
        

    })

    socket.on('room:create', () => {

        let roomCode = getStringOfFour();
        while (gameRooms.has(roomCode)) {
            roomCode = getStringOfFour();
        }
        // WE WILL BE ADDING HERE TO GAME STATE
        gameRooms.set(roomCode, {players: new Map(), phase: 'lobby'})
        console.log(`room request made, added ${roomCode} to roomMap`)
        socket.emit('room:created', roomCode);
    })

    socket.on('room:message', (msg) => {
            if (currentRoom) {
                io.to(currentRoom).emit('room:message', {
                    id: socket.id,
                    name: gameRooms.get(currentRoom).players.get(socket.id).name,
                    text: msg,
                    msgId: crypto.randomUUID(),
                    ts: Date.now()
                });
            }
        })

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
        if (gameRooms.has(currentRoom)) {
            let room = gameRooms.get(currentRoom)
            room.players.delete(socket.id)
            console.log(room.players);
            
            let userList = [...room.players.values()].map(user => user.name);
            io.to(currentRoom).emit('room:playerList', userList);
        }

    })
    



});

httpServer.listen(3000, () => console.log("http://localhost:3000"));
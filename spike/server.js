import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const gameRooms = new Set();
const userNames = new Map();
const activeUsers = {};
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

// TEST ENTRY
gameRooms.add('AAAA')

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


app.use(express.static("public"));

io.on("connection", (socket) => {
    let currentRoom = null; // stores gameroom for individual player

    console.log("connected", socket.id);

    // Emits a chat message to all users
    socket.on("player:message", (msg) => {
        console.log('message: ', msg);
        io.emit('player:message', userNames.get(socket.id) + ': ' + msg)
    });
    
    // add username to userNames map
    socket.on('player:set-name', (name) => {
        userNames.set(socket.id, name)
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

        if (!roomExists) {
            socket.emit('room:joined', [false, roomCode]);
            return;
        }

        socket.join(roomCode);
        currentRoom = roomCode;
        socket.emit('room:joined', [true, roomCode])
        

        console.log(`${socket.id} tried using room code ${roomCode}. Result: ${gameRooms.has(roomCode)}`)
    })

    socket.on('room:create', () => {
        let roomCode = getStringOfFour();
        while (gameRooms.has(roomCode)) {
            roomCode = getStringOfFour();
        }
        gameRooms.add(roomCode)
        console.log(`room request made, added ${roomCode} to roomMap`)
        socket.emit('room:created', roomCode);
    })

    socket.on('room:message', (msg) => {
            if (currentRoom) {
                io.to(currentRoom).emit('room:message', msg);
            }
        })

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
        userNames.delete(socket.id);
    })
    



});

httpServer.listen(3000, () => console.log("http://localhost:3000"));
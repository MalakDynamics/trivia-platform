import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const gameRooms = new Map();
const userNames = new Map();
const activeUsers = {};
const buzzWinner = [];


// TEST ENTRY
gameRooms.set('AAAA')

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
    console.log("connected", socket.id);

    // Emits a chat message to all users
    socket.on("chat message", (msg) => {
        console.log('message: ', msg);
        io.emit('chat message', userNames.get(socket.id) + ': ' + msg)
    });
    
    // add username to userNames map
    socket.on('username value', (name) => {
        userNames.set(socket.id, name)
    })
    
    socket.on('buzzer', () => {
        let winner = determineBuzzWinner(socket.id)
        console.log('Did you win?: ', winner);
    })

    socket.on('reset buzzer', () => {
        buzzWinner.length = 0;
    })

    socket.on('join request', (roomCode) => {
        io.emit('join request result', gameRooms.has(roomCode))
        console.log(`${socket.id} tried using room code ${roomCode}. Result: ${gameRooms.has(roomCode)}`)
    })

    socket.on('room request', () => {
        let roomCode = getStringOfFour();
        while (gameRooms.has(roomCode)) {
            roomCode = getStringOfFour();
        }
        gameRooms.set(roomCode)
        console.log(`room request made, added ${roomCode} to roomMap`)
        io.emit('room request confirm', roomCode);
    })

    socket.on("disconnect", () => {
        console.log("disconnected", socket.id);
        userNames.delete(socket.id);
    })
    



});
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

httpServer.listen(3000, () => console.log("http://localhost:3000"));
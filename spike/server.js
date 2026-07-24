import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const users = {};


app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("disconnect", () => console.log("disconnected", socket.id));
});

io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
        console.log('message: ', msg);
        io.emit('chat message', users[socket.id]+ ': ' + msg)
    });
});

io.on("connection", (socket) => {
    socket.on('username value', (name) => {
        users[socket.id] = name;
        console.log(users);
    })
})

httpServer.listen(3000, () => console.log("http://localhost:3000"));
import express from 'express';
import { createServer } from 'node:http';
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("disconnect", () => console.log("disconnected", socket.id));
});

io.on("connection", (socket) => {
    socket.on("chat message", (msg) => {
        console.log('message: ', msg);
    });
});

httpServer.listen(3000, () => console.log("http://localhost:3000"));
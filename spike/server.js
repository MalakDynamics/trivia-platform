const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("connected", socket.id);
    socket.on("disconnect", () => console.log("disconnected", socket.id));
});

httpServer.listen(3000, () => console.log("http://localhost:3000"));
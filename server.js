const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();

app.use(cors());
app.use(express.static("public"));

const httpServer = app.listen(8000);

const io = new Server(httpServer);

let history = [];

io.on("connection", (socket) => {
    socket.emit("load-canvas", history);

    socket.on("new-drawing", (data) => {
        socket.broadcast.emit("new-drawing", data);
        history.push(data);
    })

    socket.on("clear-canvas", () => {
        socket.broadcast.emit("clear-canvas");
        history = [];
    });
});
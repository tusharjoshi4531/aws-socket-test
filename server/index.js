const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const { Server } = require("socket.io");

const express = require("express");

console.log("test");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const httpserver = http.createServer(app);
const wsserver = http.createServer(app);
const server = new Server(wsserver, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

wsserver.listen(WS_PORT, () => {
  console.log(`Websocket server is running on port ${WS_PORT}`);
});

server.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("join", (room) => {
    console.log("Joining room: ", room);
    socket.join(room);
  });

  socket.on("message", (message) => {
    console.log("Message received: ", message);
    console.log("Sending message to room: ", message.roomId);
    server.to(message.roomId).emit("message", message);
  });
});

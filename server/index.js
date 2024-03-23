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

const httpserver = http.createServer(app);
const server = new Server(httpserver, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3001;

httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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

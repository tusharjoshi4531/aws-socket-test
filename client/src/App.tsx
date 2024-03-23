import { useState } from "react";

import "./App.css";
import { io } from "socket.io-client";

// const serverUrl = "http://3.109.132.88:8000";
const serverUrl = "http://localhost:3002"
const socket = io(serverUrl, {
  transports: ["websocket"],
});

function App() {
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (roomId === "") return;

          socket.emit("join", roomId);
          socket.on("message", (data) => {
            console.log(data.message);
            alert(data.message);
          });
        }}
      >
        <input
          type="text"
          name="roomid"
          id="roomid"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button>Join</button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (message === "") return;
          socket.emit("message", { roomId, message });
        }}
      >
        <input
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
}

export default App;

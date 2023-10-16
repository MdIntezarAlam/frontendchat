import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import MessageBox from "./MessageBox";

const backendUrl = "https://backendchat-seven.vercel.app/";
const socket = io.connect(backendUrl);

function App() {
  const [userName, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isTrue, setIsTrue] = useState(false);

  const startMessage = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setIsTrue(true);
    }
  };
  console.log("Connecting to:", backendUrl);
  const socket = io.connect(backendUrl);
  console.log("Socket connected:", socket);

  return (
    <div className="flex flex-col items-center  py-6 h-screen relative   bg-gradient-to-tr from-violet-400 via-neutral-800 to-teal-700 text-white">
      {!isTrue ? (
        <div className="w-full flex flex-col items-center justify-center h-full px-6">
          <div className="w-full min-h-[45vh] bg-slate-900 flex flex-col items-center justify-center gap-y-6 rounded-md p-3">
            <h1 className="text-3xl">Messanger-App</h1>
            <input
              type="text"
              placeholder="Enter Username"
              onChange={(event) => setUsername(event.target.value)}
              className="bg-transparent p-3 border border-lime-400 rounded-full w-full"
            />
            <input
              type="text"
              placeholder="Enter Username Id"
              onChange={(event) => setRoom(event.target.value)}
              className="bg-transparent p-3 border border-lime-400 rounded-full w-full"
            />
            <button
              onClick={startMessage}
              className="w-full rounded-full p-3 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90 text-black font-semibold"
            >
              Start Message
            </button>
          </div>
        </div>
      ) : (
        <MessageBox userName={userName} socket={socket} room={room} />
      )}
    </div>
  );
}

export default App;

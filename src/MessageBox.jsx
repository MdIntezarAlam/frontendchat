import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function MessageBox({ socket, userName, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: userName,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => {
        const updatedList = [...list, messageData];
        localStorage.setItem("chatMessages", JSON.stringify(updatedList));
        return updatedList;
      });

      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessageList(JSON.parse(storedMessages));
    }

    socket.on("receive_message", (data) => {
      setMessageList((list) => {
        const updatedList = [...list, data];
        localStorage.setItem("chatMessages", JSON.stringify(updatedList));
        return updatedList;
      });
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center py-4 px-5 w-full">
      <h1 className="w-full text-3xl mb-4">Messanger-App</h1>

      <div className="overflow-y-auto w-full  rounded-md bg-gradient-to-t from-black via-green-300 to-sky-600">
        <ScrollToBottom className="message-container w-[100%] h-[100%] overflow-y-scroll overflow-x-hidden chat-window ">
          {messageList.map((msg) => {
            return (
              <div
                className="message h-auto p-3 flex"
                id={userName === msg.author ? "you" : "other"}
              >
                <div
                  style={{
                    overflowWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                  className="bg-black min-w-[50%] mx-w-[80%] text-white rounded-md flex items-cente flex-col justify-between m-2 p-2 break-words"
                >
                  <h1>{msg.message}</h1>
                  <div className="flex items-center justify-end gap-x-3 text-green-300 text-xs">
                    <h1 id="time" className="flex text-xs">
                      {msg.time}
                    </h1>
                    <h1 id="author">{msg.author}</h1>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>

      <footer className="w-full px-6 absolute bottom-4">
        <div
          className="w-full flex items-center justify-between px-4 py-2 rounded-full p-3
          bg-gradient-to-l from-black via-indigo-500 to-black"
        >
          <input
            type="text"
            value={currentMessage}
            placeholder="Type Messages here..."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
            className="bg-transparent outline-none w-full border-0"
          />
          <button
            className="px-4 py-1 rounded-full p-3
             bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90 text-black font-semibold"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default MessageBox;

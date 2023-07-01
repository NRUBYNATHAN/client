import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import SendIcon from "@mui/icons-material/Send";
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setmessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setmessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    let iscancelled = false;
    const maha = async () => {
      if (!iscancelled) {
        socket.on("received_message", (data) => {
          setmessageList((list) => [...list, data]);
        });
      }
    };
    maha();
    return () => {
      iscancelled = true;
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messagecontent) => {
            return (
              <div
                className="message"
                id={username === messagecontent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messagecontent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messagecontent.time}</p>
                    <p id="author">{messagecontent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="type your message...."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

export default Chat;

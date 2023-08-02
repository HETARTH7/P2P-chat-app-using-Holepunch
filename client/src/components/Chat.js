import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { serverID } = useParams();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/messages", { serverID })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const sendMessage = () => {
    axios.post("http://localhost:5000/send", { serverID, message });
  };
  return (
    <div className="container">
      <h1>Chat</h1>
      <input onChange={handleChange} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { serverID } = useParams();
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/messages/${serverID}`)
      .then((res) => setChats(res.data))
      .catch((err) => console.log(err));
  }, [serverID]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const sendMessage = () => {
    axios.post("http://localhost:5000/send", { serverID, message });
    window.location.href = `/${serverID}`;
  };
  return (
    <div className="container text-center">
      <h1>Chat</h1>

      <input className="form-control m-4" onChange={handleChange} />
      <button className="btn btn-success m-4" onClick={sendMessage}>
        Send
      </button>
      <div className="card">
        {chats.map((chat, index) => {
          return (
            <div className="card-title" key={index}>
              <h5>{chat}</h5>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;

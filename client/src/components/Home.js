import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [name, setName] = useState("");
  const [join, setJoin] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleTopicChange = (e) => {
    setJoin(e.target.value);
  };

  const joinNetwork = (e) => {
    e.preventDefault();
    const cred = { name, join };
    axios.post("http://localhost:5000/connect", cred);
    console.log(cred);
  };
  return (
    <div>
      <h1>P2P Chat App using Holepunch</h1>
      <form onSubmit={joinNetwork}>
        <label>Enter your name</label>
        <input onChange={handleNameChange} />
        <label>Enter topic</label>
        <input onChange={handleTopicChange} />
        <input type="submit" />
      </form>
    </div>
  );
};

export default Home;

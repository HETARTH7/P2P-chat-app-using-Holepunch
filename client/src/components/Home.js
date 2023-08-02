import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [id, setId] = useState("");
  const [servers, setServers] = useState([]);
  const navigate = useNavigate();
  const getNetworks = async () => {
    axios
      .get("http://localhost:5000/servers")
      .then((res) => setServers(res.data))
      .catch((err) => console.log(err));
  };
  const getPeerId = () => {
    axios
      .get("http://localhost:5000/id")
      .then((res) => {
        setId(res.data);
        localStorage["peerID"] = res.data;
      })
      .catch((err) => console.log(err));
  };
  const createNetwork = async () => {
    try {
      axios.post("http://localhost:5000/create", { id });
    } catch (err) {
      console.log(err);
    }
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
    localStorage["peerID"] = id;
  };

  const joinNetwork = (e) => {
    navigate(`/${e.target.value}`);
  };
  return (
    <div className="container text-center">
      <h1 className="m-5">P2P Chat App using Holepunch</h1>
      <h2>Your peerID: {id}</h2>
      <input
        onChange={handleIdChange}
        className="form-control"
        placeholder="Enter your PeerID"
      ></input>
      <button onClick={createNetwork} className="btn btn-outline-primary m-3">
        Create a network
      </button>
      <button onClick={getPeerId} className="btn btn-outline-primary m-3">
        Get a new PeerID
      </button>
      <button className="btn btn-outline-primary m-3" onClick={getNetworks}>
        Get available networks
      </button>
      {servers.map((server, index) => {
        return (
          <div key={index} className="card">
            <div className="card-body">
              <h3 className="card-topic">{server}</h3>
              <button
                onClick={joinNetwork}
                value={server}
                className="btn btn-outline-success m-3"
              >
                Join network
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;

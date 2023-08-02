const express = require("express");
const cors = require("cors");
const DHT = require("hyperdht");
const goodbye = require("graceful-goodbye");
const b4a = require("b4a");
const crypto = require("hypercore-crypto");
const Hyperswarm = require("hyperswarm");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

const servers = [];
const conn = new Map();

app.get("/id", (req, res) => {
  const keyPair = DHT.keyPair();
  res.status(200).json(b4a.toString(keyPair.publicKey, "hex"));
});

app.post("/create", async (req, res) => {
  const { peerID } = req.body;
  const dht = new DHT();
  const keyPair = DHT.keyPair();
  conn[b4a.toString(keyPair.publicKey, "hex")] = [];
  const server = dht.createServer((conn) => {
    console.log("got connection!");
    process.stdin.pipe(conn).pipe(process.stdout);
  });
  await servers.push(b4a.toString(keyPair.publicKey, "hex"));
  conn[b4a.toString(keyPair.publicKey, "hex")].push(peerID);
  server.listen(keyPair).then(() => {
    console.log("listening on:", b4a.toString(keyPair.publicKey, "hex"));
  });
  res.status(200).json("Server created");
});

app.get("/servers", (req, res) => {
  res.json(servers);
});
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

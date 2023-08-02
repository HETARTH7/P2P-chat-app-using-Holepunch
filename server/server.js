const express = require("express");
const cors = require("cors");
const DHT = require("hyperdht");
const goodbye = require("graceful-goodbye");
const b4a = require("b4a");
const Hypercore = require("hypercore");
const fs = require("fs").promises;

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
  servers.push(b4a.toString(keyPair.publicKey, "hex"));
  conn[b4a.toString(keyPair.publicKey, "hex")].push(peerID);
  server.listen(keyPair).then(() => {
    console.log("listening on:", b4a.toString(keyPair.publicKey, "hex"));
  });
  const core = new Hypercore(`./${b4a.toString(keyPair.publicKey, "hex")}`);
  await core.ready();
  console.log("hypercore key:", b4a.toString(core.key, "hex"));
  core.append("Start here");
  res.status(200).json("Server created");
});

app.get("/servers", (req, res) => {
  res.json(servers);
});

app.post("/join", (req, res) => {
  const { peerID, serverID } = req.body;
  conn[serverID].push(peerID);
  res.status(200).json(conn);
});

app.post("/send", async (req, res) => {
  const { serverID, message } = req.body;
  const core = new Hypercore(`./${serverID}`);
  await core.ready();
  console.log("hypercore key:", b4a.toString(core.key, "hex"));
  core.append(message);
  core.append("`");
  console.log(req.body);
  res.status(200).json("Message sent");
});

app.get("/messages", async (req, res) => {
  const { serverID } = req.body;
  const filePath = `./${serverID}/data`;

  try {
    const messages = await fs.readFile(filePath, "utf8");
    const chatMessages = messages.split("`");
    res.status(200).json(chatMessages);
  } catch (error) {
    console.error("Error reading messages:", error);
    res.status(500).json({ error: "Failed to read messages" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

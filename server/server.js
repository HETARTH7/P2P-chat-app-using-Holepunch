const express = require("express");
const cors = require("cors");
const Hyperswarm = require("hyperswarm");
const goodbye = require("graceful-goodbye");
const crypto = require("hypercore-crypto");
const b4a = require("b4a");

const app = express();
app.use(express.json());
app.use(cors());

const swarm = new Hyperswarm();
goodbye(() => swarm.destroy());
const connections = new Map(); // Use a Map to store user connections

app.post("/connect", (req, res) => {
  const { name, join } = req.body;

  // Validate the input parameters (e.g., name should not be empty)
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Invalid name provided." });
  }

  // Check if the user is already connected and reject if so
  if (connections.has(name)) {
    return res.status(400).json({ error: "User is already connected." });
  }

  // Generate a unique user ID for the new user
  const userID = crypto.randomBytes(16).toString("hex");

  // Add the user's connection to the connections Map
  connections.set(name, { userID, conn: null });

  swarm.on("connection", (conn) => {
    const user = [...connections.values()].find((u) => u.conn === null);
    if (user) {
      user.conn = conn;

      console.log(`* ${name} (${user.userID}) connected *`);

      // Handle data and disconnection events for the user's connection
      conn.on("data", (data) => {
        const sender = [...connections.values()].find((u) => u.conn === conn);
        if (sender) {
          for (const { conn } of connections.values()) {
            if (conn !== null && conn !== sender.conn) {
              conn.write(`${name}: ${data}`);
            }
          }
        }
      });

      conn.on("close", () => {
        connections.delete(name);
        console.log(`* ${name} (${user.userID}) disconnected *`);
      });
    }
  });
  console.log(connections);

  // Generate the topic based on the provided "join" parameter or a random topic
  const topic = join ? b4a.from(join, "hex") : crypto.randomBytes(32);

  // Join the P2P network with the generated topic
  const discovery = swarm.join(topic, { client: true, server: true });

  discovery.flushed().then(() => {
    console.log(
      `* ${name} (${userID}) joined topic: ${b4a.toString(topic, "hex")} *`
    );
  });

  res.status(200).json({ userID, topic: b4a.toString(topic, "hex") });
});

app.listen(5000, () => {
  console.log("Server running at port 5000");
});

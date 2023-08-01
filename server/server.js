const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const chatMessages = [];

app.post("/send", (req, res) => {
  const { sender, content } = req.body;
  if (sender && content) {
    const message = { sender, content, timestamp: new Date() };
    chatMessages.push(message);
    res.status(200).json({ status: "Message sent successfully", message });
  } else {
    res
      .status(400)
      .json({ error: "Invalid data. Sender and content are required." });
  }
});

app.get("/history", (req, res) => {
  res.status(200).json(chatMessages);
});

app.listen(5000, () => {
  console.log("Server running at port 5000");
});

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const AWS = require("aws-sdk");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

AWS.config.update({
  region: "ap-south-1",
});

const ec2 = new AWS.EC2();

const sendLog = (msg) => {
  io.emit("log", msg);
};

app.post("/deploy/aws", async (req, res) => {
  try {
    sendLog("Connecting to AWS...");

    await ec2.describeInstances().promise();

    sendLog("AWS Connected ✅");
    sendLog("Deploying to AWS...");

    res.json({ message: "AWS deployment triggered 🚀" });
  } catch (err) {
    sendLog("AWS Error ❌");
    res.json({ message: "AWS failed" });
  }
});

app.post("/deploy/azure", (req, res) => {
  sendLog("Starting Azure deployment...");
  setTimeout(() => sendLog("Building..."), 500);
  setTimeout(() => sendLog("Testing..."), 1000);
  setTimeout(() => sendLog("Deploying to Azure..."), 1500);

  res.json({ message: "Azure deployment triggered 🚀" });
});

server.listen(5001, () => console.log("Server running on port 5001"));
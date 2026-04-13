const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// 🔥 Socket.IO for live pipeline logs
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// ===============================
// 🟢 HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "Backend running 🚀",
    message: "DevOps Pipeline API Active"
  });
});

// ===============================
// 📦 PIPELINE STATE (IN MEMORY)
// ===============================
let pipelineStatus = {
  stage: "idle",
  progress: 0,
  logs: []
};

// ===============================
// 🔥 GET PIPELINE STATUS
// ===============================
app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineStatus);
});

// ===============================
// 🚀 START PIPELINE (SIMULATION)
// ===============================
app.post("/api/pipeline/start", async (req, res) => {
  pipelineStatus = {
    stage: "starting",
    progress: 0,
    logs: []
  };

  res.json({ message: "Pipeline started 🚀" });

  runPipelineSimulation();
});

// ===============================
// 🧪 PIPELINE SIMULATOR
// ===============================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runPipelineSimulation() {
  const steps = [
    "🔄 Pulling code from GitHub...",
    "📦 Installing dependencies...",
    "🔧 Building application...",
    "🧪 Running tests...",
    "🐳 Building Docker image...",
    "☁️ Deploying to cloud...",
    "✅ Deployment successful!"
  ];

  for (let i = 0; i < steps.length; i++) {
    pipelineStatus.stage = steps[i];
    pipelineStatus.progress = Math.round(((i + 1) / steps.length) * 100);

    const logEntry = {
      time: new Date().toISOString(),
      message: steps[i]
    };

    pipelineStatus.logs.push(logEntry);

    // 🔥 Emit real-time update
    io.emit("pipeline-log", logEntry);
    io.emit("pipeline-status", pipelineStatus);

    await sleep(1200);
  }

  pipelineStatus.stage = "completed";
  io.emit("pipeline-complete", pipelineStatus);
}

// ===============================
// 📡 SOCKET CONNECTION
// ===============================
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // send current state immediately
  socket.emit("pipeline-status", pipelineStatus);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ===============================
// 🟡 ERROR HANDLING
// ===============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong on server"
  });
});

// ===============================
// 🚀 START SERVER (RENDER READY)
// ===============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
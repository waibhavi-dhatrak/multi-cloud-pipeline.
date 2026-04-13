const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ========================
// CORS CONFIG
// ========================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ========================
// SOCKET.IO SETUP (safe for Render)
// ========================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ========================
// HEALTH CHECK ROUTE
// ========================
app.get("/", (req, res) => {
  res.json({
    status: "Backend running 🚀",
    time: new Date().toISOString()
  });
});

// ========================
// PIPELINE STATE
// ========================
let pipelineState = {
  stage: "idle",
  progress: 0,
  logs: []
};

// ========================
// GET STATUS
// ========================
app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineState);
});

// ========================
// START PIPELINE
// ========================
app.post("/api/pipeline/start", (req, res) => {
  pipelineState = {
    stage: "starting",
    progress: 0,
    logs: []
  };

  res.json({ success: true, message: "Pipeline started 🚀" });

  runPipeline();
});

// ========================
// PIPELINE SIMULATION
// ========================
function runPipeline() {
  const steps = [
    "Pulling code from GitHub",
    "Installing dependencies",
    "Building application",
    "Running tests",
    "Preparing deployment",
    "Deploying to cloud",
    "Completed"
  ];

  let i = 0;

  const interval = setInterval(() => {
    if (i >= steps.length) {
      pipelineState.stage = "completed";
      pipelineState.progress = 100;
      clearInterval(interval);
      return;
    }

    pipelineState.stage = steps[i];
    pipelineState.progress = Math.floor(((i + 1) / steps.length) * 100);

    const log = {
      time: new Date().toISOString(),
      message: steps[i]
    };

    pipelineState.logs.push(log);

    // emit live updates (safe even if frontend not connected)
    io.emit("pipeline-update", pipelineState);

    i++;
  }, 1200);
}

// ========================
// SOCKET CONNECTION
// ========================
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("pipeline-update", pipelineState);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// ========================
// START SERVER (CRITICAL FOR RENDER)
// ========================
const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
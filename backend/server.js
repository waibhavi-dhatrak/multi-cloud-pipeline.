const express = require("express");
const cors = require("cors");

const app = express();

// ========================
// MIDDLEWARE
// ========================
app.use(cors({ origin: "*" }));
app.use(express.json());

// ========================
// HEALTH CHECK (IMPORTANT)
// ========================
app.get("/", (req, res) => {
  res.json({
    status: "Backend running 🚀",
    message: "API is live",
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
// GET STATUS API
// ========================
app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineState);
});

// ========================
// START PIPELINE API
// ========================
app.post("/api/pipeline/start", (req, res) => {
  pipelineState = {
    stage: "starting",
    progress: 0,
    logs: [{ message: "Pipeline started" }]
  };

  res.json({
    success: true,
    message: "Pipeline started 🚀"
  });

  runPipeline();
});

// ========================
// SIMULATED PIPELINE
// ========================
function runPipeline() {
  const steps = [
    "Pulling code from GitHub",
    "Installing dependencies",
    "Building application",
    "Running tests",
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

    pipelineState.logs.push({
      time: new Date().toISOString(),
      message: steps[i]
    });

    i++;
  }, 1200);
}

// ========================
// START SERVER (CRITICAL FOR RENDER)
// ========================
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
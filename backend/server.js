const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

// PIPELINE STATE
let pipeline = {
  stage: "idle",
  progress: 0,
  logs: []
};

// STATUS
app.get("/api/pipeline/status", (req, res) => {
  res.json(pipeline);
});

// START PIPELINE
app.post("/api/pipeline/start", (req, res) => {
  pipeline = {
    stage: "running",
    progress: 10,
    logs: [{ message: "Pipeline started" }]
  };

  res.json({ success: true });

  runFakePipeline();
});

// SIMULATION
function runFakePipeline() {
  const steps = [
    "Pulling code",
    "Installing dependencies",
    "Building app",
    "Running tests",
    "Deploying"
  ];

  let i = 0;

  const interval = setInterval(() => {
    if (i >= steps.length) {
      pipeline.stage = "completed";
      pipeline.progress = 100;
      clearInterval(interval);
      return;
    }

    pipeline.stage = steps[i];
    pipeline.progress = Math.floor(((i + 1) / steps.length) * 100);
    pipeline.logs.push({ message: steps[i] });

    i++;
  }, 1200);
}

// IMPORTANT FOR RENDER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
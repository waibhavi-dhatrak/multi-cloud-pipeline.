const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// =====================
// PIPELINE STATE
// =====================
let pipelineState = {
  stage: "idle",
  progress: 0,
  aws: "pending",
  azure: "pending",
  logs: []
};

// =====================
// HEALTH
// =====================
app.get("/", (req, res) => {
  res.json({ status: "Multi-Cloud DevOps Backend 🚀" });
});

// =====================
// STATUS
// =====================
app.get("/api/pipeline/status", (req, res) => {
  res.json(pipelineState);
});

// =====================
// START PIPELINE
// =====================
app.post("/api/pipeline/start", async (req, res) => {
  pipelineState = {
    stage: "starting",
    progress: 0,
    aws: "pending",
    azure: "pending",
    logs: [{ message: "Pipeline started" }]
  };

  res.json({ success: true });

  runPipeline();
});

// =====================
// SIMULATED MULTI-CLOUD PIPELINE
// =====================
async function runPipeline() {
  const steps = [
    "Building application",
    "Running tests",
    "Deploying to AWS",
    "Deploying to Azure",
    "Finalizing"
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    pipelineState.stage = step;
    pipelineState.progress = Math.round(((i + 1) / steps.length) * 100);

    pipelineState.logs.push({ message: step });

    // 🌩 AWS DEPLOY SIMULATION
    if (step.includes("AWS")) {
      pipelineState.aws = "deploying";
      await fakeDelay();
      pipelineState.aws = "success";
    }

    // ☁️ AZURE DEPLOY SIMULATION
    if (step.includes("Azure")) {
      pipelineState.azure = "deploying";
      await fakeDelay();
      pipelineState.azure = "success";
    }

    await fakeDelay();
  }

  pipelineState.stage = "completed";
  pipelineState.progress = 100;
}

function fakeDelay() {
  return new Promise((res) => setTimeout(res, 1200));
}

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Multi-cloud backend running on", PORT);
});
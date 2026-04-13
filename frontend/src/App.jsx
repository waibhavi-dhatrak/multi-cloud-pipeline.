import { useEffect, useState } from "react";
import { startPipeline, getStatus } from "./api";
import "./index.css";

function App() {
  const [status, setStatus] = useState({
    stage: "idle",
    progress: 0,
    logs: [],
    aws: "pending",
    azure: "pending"
  });

  const [running, setRunning] = useState(false);

  // =========================
  // FETCH STATUS (POLLING)
  // =========================
  const fetchStatus = async () => {
    try {
      const data = await getStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to fetch status:", err);
    }
  };

  // =========================
  // START PIPELINE
  // =========================
  const handleStart = async () => {
    try {
      setRunning(true);

      await startPipeline();

      const interval = setInterval(async () => {
        const data = await getStatus();
        setStatus(data);

        if (data.stage === "completed") {
          clearInterval(interval);
          setRunning(false);
        }
      }, 1200);
    } catch (err) {
      console.error("Pipeline start failed:", err);
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // =========================
  // UI
  // =========================
  return (
    <div className="dashboard">

      {/* HEADER */}
      <h1>🚀 Multi-Cloud DevOps Dashboard</h1>

      {/* PIPELINE CARD */}
      <div className="card">
        <h2>Pipeline Status</h2>

        <div className={`badge ${status.stage}`}>
          {status.stage?.toUpperCase()}
        </div>

        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${status.progress || 0}%` }}
          />
        </div>

        <p>{status.progress || 0}% completed</p>

        <button onClick={handleStart} disabled={running}>
          {running ? "Running Pipeline..." : "Start Pipeline"}
        </button>
      </div>

      {/* CLOUD STATUS */}
      <div className="card">
        <h2>☁️ Multi-Cloud Status</h2>

        <div className="cloud-grid">

          <div className="cloud-box">
            <h3>☁️ AWS</h3>
            <p className={`status ${status.aws}`}>
              {status.aws?.toUpperCase()}
            </p>
          </div>

          <div className="cloud-box">
            <h3>🌩 Azure</h3>
            <p className={`status ${status.azure}`}>
              {status.azure?.toUpperCase()}
            </p>
          </div>

        </div>
      </div>

      {/* LIVE LOGS */}
      <div className="card logs">
        <h2>📜 Live Pipeline Logs</h2>

        {!status.logs?.length && <p>No logs yet...</p>}

        {status.logs?.map((log, i) => (
          <div key={i} className="log">
            ✔ {log.message}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
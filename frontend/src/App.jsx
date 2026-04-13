import { useEffect, useState } from "react";
import { startPipeline, getStatus } from "./api";

function App() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const data = await getStatus();
      setStatus(data);
    } catch (err) {
      console.error("Error fetching status:", err);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await startPipeline();

      // poll status instead of socket
      const interval = setInterval(async () => {
        const data = await getStatus();
        setStatus(data);

        if (data.stage === "completed") {
          clearInterval(interval);
          setLoading(false);
        }
      }, 1500);
    } catch (err) {
      console.error("Backend connection failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🚀 Multi-Cloud Pipeline</h1>

      <button onClick={handleStart} disabled={loading}>
        {loading ? "Running..." : "Start Pipeline"}
      </button>

      <div style={{ marginTop: "20px" }}>
        <h3>Status:</h3>
        <p><b>Stage:</b> {status?.stage}</p>
        <p><b>Progress:</b> {status?.progress}%</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Logs:</h3>
        {status?.logs?.map((log, i) => (
          <div key={i}>• {log.message}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
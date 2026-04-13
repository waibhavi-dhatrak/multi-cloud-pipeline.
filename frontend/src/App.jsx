import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [logs, setLogs] = useState([]);
  const [stage, setStage] = useState("Idle");

  const chartData = [
    { name: "Build", time: 2 },
    { name: "Test", time: 1 },
    { name: "Deploy", time: 3 },
  ];

  // SOCKET CONNECTION
  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("log", (msg) => {
      setLogs((prev) => [...prev, msg]);
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    return () => socket.disconnect();
  }, []);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  // PIPELINE FLOW (FIXED)
  const deploy = async (cloud) => {
    setLogs([]);
    setStage("Build");

    addLog("🚀 Starting pipeline...");

    setTimeout(() => {
      setStage("Test");
      addLog("🧪 Testing application...");
    }, 1000);

    setTimeout(() => {
      setStage("Deploy");
      addLog("📦 Deploying to cloud...");
    }, 2000);

    try {
      const res = await fetch(`http://localhost:5001/deploy/${cloud}`, {
        method: "POST",
      });

      const data = await res.json();

      setTimeout(() => {
        setStage("Completed");
        addLog(`✅ ${data.message}`);
      }, 3000);
    } catch (err) {
      setStage("Failed");
      addLog("❌ Backend connection failed");
      console.error(err);
    }
  };

  const StageCard = ({ name }) => (
    <div
      style={{
        padding: 15,
        margin: 5,
        width: 120,
        textAlign: "center",
        borderRadius: 10,
        background: stage === name ? "#2563eb" : "#fff",
        color: stage === name ? "#fff" : "#000",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {name}
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#111", color: "#fff", padding: 20 }}>
        <h2>☁️ CloudOps</h2>

        <p onClick={() => setPage("dashboard")} style={{ cursor: "pointer" }}>
          Dashboard
        </p>
        <p onClick={() => setPage("pipelines")} style={{ cursor: "pointer" }}>
          Pipelines
        </p>
        <p onClick={() => setPage("logs")} style={{ cursor: "pointer" }}>
          Logs
        </p>
        <p onClick={() => setPage("analytics")} style={{ cursor: "pointer" }}>
          Analytics
        </p>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <div style={{ display: "flex" }}>
              {["Build", "Test", "Deploy", "Completed"].map((s) => (
                <StageCard key={s} name={s} />
              ))}
            </div>

            <br />

            <button onClick={() => deploy("aws")}>Deploy AWS</button>
            <button onClick={() => deploy("azure")} style={{ marginLeft: 10 }}>
              Deploy Azure
            </button>
          </>
        )}

        {/* PIPELINES */}
        {page === "pipelines" && (
          <>
            <h1>CI/CD Pipeline</h1>
            <div style={{ display: "flex" }}>
              {["Build", "Test", "Deploy", "Completed"].map((s) => (
                <StageCard key={s} name={s} />
              ))}
            </div>
          </>
        )}

        {/* LOGS */}
        {page === "logs" && (
          <>
            <h1>Logs</h1>
            <div
              style={{
                background: "#000",
                color: "lime",
                padding: 10,
                height: 300,
                overflowY: "auto",
              }}
            >
              {logs.map((l, i) => (
                <p key={i}>{"> " + l}</p>
              ))}
            </div>
          </>
        )}

        {/* ANALYTICS */}
        {page === "analytics" && (
          <>
            <h1>Analytics</h1>

            <BarChart width={500} height={300} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="time" />
            </BarChart>
          </>
        )}

      </div>
    </div>
  );
}
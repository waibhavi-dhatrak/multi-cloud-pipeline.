const API = import.meta.env.VITE_API_URL;

export const startPipeline = async () => {
  const res = await fetch(`${API}/api/pipeline/start`, {
    method: "POST"
  });

  if (!res.ok) throw new Error("Backend connection failed");
  return res.json();
};

export const getStatus = async () => {
  const res = await fetch(`${API}/api/pipeline/status`);
  return res.json();
};
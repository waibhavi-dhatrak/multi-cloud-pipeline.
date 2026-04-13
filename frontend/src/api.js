const API = import.meta.env.VITE_API_URL;

export const startPipeline = async () => {
  const res = await fetch(`${API}/api/pipeline/start`, {
    method: "POST"
  });
  return res.json();
};

export const getPipelineStatus = async () => {
  const res = await fetch(`${API}/api/pipeline/status`);
  return res.json();
};
import axios from "axios";

const BASE_URL = "http://localhost:5001";

export const runPipeline = async () => {
  const res = await axios.post(`${BASE_URL}/deploy/aws`);
  return res.data;
};
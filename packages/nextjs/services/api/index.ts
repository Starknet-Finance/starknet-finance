import axios from "axios";

const api = axios.create({
  baseURL: "https://starknet.api.avnu.fi",
  withCredentials: false,
});

export default api;

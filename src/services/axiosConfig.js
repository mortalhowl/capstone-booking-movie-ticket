import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000,
});

api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: {},
    TokenCybersoft: import.meta.env.VITE_TOKEN_CYBERSOFT,
  };

  return config;
});

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://movienew.cybersoft.edu.vn/api/",
  timeout: 50000,
});

api.interceptors.request.use((config) => {
  const localUserStr = localStorage.getItem("USER_DATA");
  const user = localUserStr ? JSON.parse(localUserStr) : null;

  config.headers = {
    ...config.headers,
    TokenCybersoft:
      import.meta.env.VITE_TOKEN_CYBERSOFT ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5NCIsIkhldEhhblN0cmluZyI6IjEzLzAxLzIwMjciLCJIZXRIYW5UaW1lIjoiMTc5OTc5ODQwMDAwMCIsIm5iZiI6MTc3MjY0MzYwMCwiZXhwIjoxNzk5OTQ2MDAwfQ.fXnFWdTzELVYga9S7pakEljJsvLiA3qz1XvvVCzlxkI",
  };

  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

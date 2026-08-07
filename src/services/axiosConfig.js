import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000,
});

api.interceptors.request.use((config) => {
  const localUserStr = localStorage.getItem("USER_DATA");
  const user = localUserStr ? JSON.parse(localUserStr) : null;

  config.headers = {
    ...config.headers,
    TokenCybersoft: import.meta.env.VITE_TOKEN_CYBERSOFT,
  };

  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

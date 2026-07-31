import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000,
});

api.interceptors.request.use(
  (config) => {
    const userData = JSON.parse(localStorage.getItem("USER_DATA"));
    if (userData && userData.accessToken) {
      config.headers.Authorization = `Bearer ${userData.accessToken}`;
    }
    config.headers.TokenCybersoft = import.meta.env.VITE_TOKEN_CYBERSOFT;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

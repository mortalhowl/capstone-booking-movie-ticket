import axios from "axios";

/**
 * Cấu hình Axios instance mặc định cho toàn bộ dự án
 * Kết nối đến API CyberSoft Movie
 */
const api = axios.create({
  baseURL: import.meta.env?.VITE_BASE_URL || "https://movienew.cybersoft.edu.vn/api/",
  timeout: 30000,
});

/**
 * Interceptor tự động gắn Header trước khi mỗi request được gửi đi:
 * - TokenCybersoft: Mã token dự án của Cybersoft
 * - Authorization: Bearer token đăng nhập lấy từ localStorage (nếu có)
 */
api.interceptors.request.use(
  (config) => {
    // Lấy thông tin user admin đăng nhập từ localStorage (hỗ trợ cả USER_ADMIN và USER_DATA)
    const userAdmin = localStorage.getItem("USER_ADMIN")
      ? JSON.parse(localStorage.getItem("USER_ADMIN"))
      : localStorage.getItem("USER_DATA")
      ? JSON.parse(localStorage.getItem("USER_DATA"))
      : null;

    const accessToken = userAdmin?.accessToken || "";

    config.headers = {
      ...config.headers,
      TokenCybersoft:
        import.meta.env?.VITE_TOKEN_CYBERSOFT ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA5NCIsIkhldEhhblN0cmluZyI6IjEzLzAxLzIwMjciLCJIZXRIYW5UaW1lIjoiMTc5OTc5ODQwMDAwMCIsIm5iZiI6MTc3MjY0MzYwMCwiZXhwIjoxNzk5OTQ2MDAwfQ.fXnFWdTzELVYga9S7pakEljJsvLiA3qz1XvvVCzlxkI",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

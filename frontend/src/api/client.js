import axios from "axios";

// Vite dev server proxies /api -> http://localhost:8000 (see vite.config.js)
const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the stored auth token (if any) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// If the token is rejected (expired/invalid), clear it so the app
// falls back to the logged-out state instead of looping on 401s.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

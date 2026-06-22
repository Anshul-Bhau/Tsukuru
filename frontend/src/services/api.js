import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // Vite proxies this to Django — no cross-origin, no HTTPS issue
  withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
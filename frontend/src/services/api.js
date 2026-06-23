// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: '/api/', 
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true, 
    // THIS HEADER IS CRITICAL FOR DJANGO TO READ THE BODY
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Automatically attach the token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;
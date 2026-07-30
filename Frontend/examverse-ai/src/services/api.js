import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Local Dev
    // baseURL: 'https://examverseai.onrender.com/api', // Production
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor to automatically add the Bearer token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

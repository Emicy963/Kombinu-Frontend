import axios from 'axios';

// Base API configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // Use Vite proxy or env var
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors (e.g., 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle specific error cases if needed
    if (error.response && error.response.status === 401) {
       // Optional: Handle token expiration / logout logic here
       // But be careful with circular dependencies if importing authService
    }
    return Promise.reject(error);
  }
);

/// <reference types="vite/client" />
import axios from 'axios';

// Create an axios instance
const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Adjust default as needed
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('token');
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error) => {
      return Promise.reject(error);
   }
);

// Response interceptor for handling errors
api.interceptors.response.use(
   (response) => response,
   (error) => {
      // Handle 401 Unauthorized globally
      if (error.response && error.response.status === 401) {
         // Clear storage and redirect to login if needed
         // localStorage.clear();
         // window.location.href = '/login';
      }
      return Promise.reject(error);
   }
);

export default api;

/// <reference types="vite/client" />
import axios from 'axios';

// Create an axios instance
export const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api', // Adjust default as needed
   timeout: 60000,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
   (config) => {
      const token = sessionStorage.getItem('token');
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
      // Enhanced error logging
      const errorContext = {
         url: error.config?.url,
         method: error.config?.method,
         status: error.response?.status,
         message: error.message
      };

      if (error.response) {
         console.error(`API Error [${error.response.status}] at ${errorContext.url}:`, error.response.data);
      } else if (error.request) {
         console.error("API Error: No response received from server. Check if backend is running and CORS is configured.", errorContext);
      } else {
         console.error("API Error:", error.message, errorContext);
      }

      // Handle 401 Unauthorized globally
      if (error.response && error.response.status === 401) {
         // Clear storage and redirect to login if needed
      }
      return Promise.reject(error);
   }
);

export default api;

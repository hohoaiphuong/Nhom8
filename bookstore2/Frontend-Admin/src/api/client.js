import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn('API Error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('userName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Separate client for file uploads (multipart/form-data)
// Note: Do NOT set Content-Type header - axios will handle it automatically with FormData
const uploadClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to upload requests
uploadClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { uploadClient };
export default client;

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Book APIs
export const bookAPI = {
  getBooks: (page = 1, limit = 12, category = null) => {
    let url = `/books?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    return apiClient.get(url);
  },
  getBookById: (id) => apiClient.get(`/books/${id}`),
  searchBooks: (query) => apiClient.get(`/books/search?q=${query}`),
};

// Category APIs
export const categoryAPI = {
  getCategories: () => apiClient.get('/categories'),
  getCategoryById: (id) => apiClient.get(`/categories/${id}`),
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => apiClient.post('/orders', data),
  getOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  updateOrder: (id, data) => apiClient.put(`/orders/${id}`, data),
};

// User APIs
export const userAPI = {
  register: (data) => apiClient.post('/users/register', data),
  login: (data) => apiClient.post('/users/login', data),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
};

export default apiClient;

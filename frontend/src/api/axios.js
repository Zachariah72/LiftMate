import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Ensure API_URL always ends with /api for proper routing
const BASE_URL = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

// Response interceptor to handle token errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only clear token and redirect on 401 (unauthorized)
      // 400 errors could be other validation issues, not necessarily token problems
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

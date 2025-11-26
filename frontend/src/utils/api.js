import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
});

// Add auth token automatically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Example API calls
export const loginUser = async ({ email, password }) => {
  return api.post('/auth/login', { email, password });
};

export const registerUser = async ({ name, email, password }) => {
  return api.post('/auth/register', { name, email, password });
};

export const getRides = async (token) => {
  setAuthToken(token);
  return api.get('/rides');
};

export const payRide = async (phone, fare, token) => {
  setAuthToken(token);
  return api.post('/rides/pay', { phone, fare });
};

export const requestRide = async (pickup, dropoff, token) => {
  setAuthToken(token);
  return api.post('/rides', { pickup, dropoff });
};

import api from './axios';

export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);
export const updateLocation = (lat, lon, token) => api.post('/api/auth/location', { lat, lon }, { headers: { Authorization: `Bearer ${token}` } });
export const forgotPassword = (email) => api.post('/api/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post('/api/auth/reset-password', { token, newPassword });

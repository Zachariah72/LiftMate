import api from './axios';

export const createRide = (data, token) =>
  api.post('/api/rides/create', data, { headers: { Authorization: `Bearer ${token}` } });

export const getRides = (token) =>
  api.get('/api/rides', { headers: { Authorization: `Bearer ${token}` } });

export const payRide = (phone, amount, rideId, token) =>
  api.post('/api/payment/mpesa', { phone, amount, rideId }, { headers: { Authorization: `Bearer ${token}` } });

export const getPaymentStatus = (rideId, token) =>
  api.get(`/api/payment/ride/${rideId}`, { headers: { Authorization: `Bearer ${token}` } });


export const getAvailableRides = (token) =>
  api.get('/api/rides/available/for-drivers', { headers: { Authorization: `Bearer ${token}` } });

export const getAvailableDrivers = (token) =>
  api.get('/api/rides/available/for-drivers', { headers: { Authorization: `Bearer ${token}` } });

export const getRideById = (id, token) =>
  api.get(`/api/rides/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const completeRide = (id, token) =>
  api.post(`/api/rides/complete/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const markDriverArrived = (id, token) =>
  api.post(`/api/rides/arrive/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const getDriverStats = (token) =>
  api.get('/api/rides/driver-stats', { headers: { Authorization: `Bearer ${token}` } });

export const rateRide = (id, rating, review, token) =>
  api.patch(`/api/rides/${id}/rate`, { rating, review }, { headers: { Authorization: `Bearer ${token}` } });

export const acceptRide = (id, token) =>
  api.post(`/api/rides/accept/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

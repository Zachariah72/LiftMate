import api from './axios';

export const createRide = (data, token) =>
  api.post('/rides/create', data, { headers: { Authorization: `Bearer ${token}` } });

export const getRides = (token) =>
  api.get('/rides', { headers: { Authorization: `Bearer ${token}` } });

export const payRide = (phone, amount, token) =>
  api.post('/rides/pay', { phone, amount }, { headers: { Authorization: `Bearer ${token}` } });


export const getAvailableRides = (token) =>
  api.get('/rides/available/for-drivers', { headers: { Authorization: `Bearer ${token}` } });

export const getAvailableDrivers = (token) =>
  api.get('/rides/available/for-drivers', { headers: { Authorization: `Bearer ${token}` } });

export const getRideById = (id, token) =>
  api.get(`/rides/${id}`, { headers: { Authorization: `Bearer ${token}` } });

export const completeRide = (id, token) =>
  api.post(`/rides/complete/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const markDriverArrived = (id, token) =>
  api.post(`/rides/arrive/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const getDriverStats = (token) =>
  api.get('/rides/driver-stats', { headers: { Authorization: `Bearer ${token}` } });

export const rateRide = (id, rating, review, token) =>
  api.patch(`/rides/${id}/rate`, { rating, review }, { headers: { Authorization: `Bearer ${token}` } });

export const acceptRide = (id, token) =>
  api.post(`/rides/accept/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

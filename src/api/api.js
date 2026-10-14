// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust backend URL if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization token to request headers if present in localStorage
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
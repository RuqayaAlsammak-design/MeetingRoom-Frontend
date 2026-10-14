import axios from 'axios';

// Base API URL configuration with Vite environment variable fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Extract root host URL for OAuth redirects (e.g., http://localhost:5000)
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor: Attach JWT Bearer token to headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Manage 401 unauthorization while ignoring login attempts
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRoute = error.config?.url?.includes('/auth/login');

    if (error.response && error.response.status === 401 && !isLoginRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// OAuth trigger helper
export const loginWithMicrosoft = () => {
  window.location.href = `${SERVER_BASE_URL}/auth/microsoft`;
};

export default API;
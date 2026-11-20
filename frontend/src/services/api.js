import axios from 'axios';

let baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://student-management-7aut.onrender.com/api'
    : 'http://localhost:5000/api');

// Auto-correct any typo if old env variable persisted
if (baseURL.includes('7qut')) {
  baseURL = baseURL.replace('7qut', '7aut');
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach bearer token as header fallback alongside cookies
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiry smoothly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on the login page, clear storage and notify
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('sms_auth_token');
        localStorage.removeItem('sms_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

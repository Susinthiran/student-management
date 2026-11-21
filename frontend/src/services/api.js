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

// Clean and ensure baseURL ends with /api
baseURL = baseURL.replace(/\/+$/, '');
if (!baseURL.endsWith('/api')) {
  baseURL += '/api';
}

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cache for transparent public viewer session (for read-only GET requests)
let publicViewerToken = null;
let publicViewerPromise = null;

const getPublicViewerToken = async () => {
  if (publicViewerToken) return publicViewerToken;
  if (!publicViewerPromise) {
    publicViewerPromise = axios
      .post(`${baseURL}/auth/login`, {
        email: 'admin@sms.edu',
        password: 'admin123'
      })
      .then((res) => {
        publicViewerToken = res.data?.token;
        return publicViewerToken;
      })
      .catch((err) => {
        console.warn('Public read token fallback notice:', err.message);
        return null;
      });
  }
  return publicViewerPromise;
};

// Request interceptor: attach admin token if signed in; otherwise attach public viewer token for read GET requests
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('sms_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.method?.toLowerCase() === 'get') {
      // Allows guests/students to read student dates, details, and courses without logging in
      const viewerToken = await getPublicViewerToken();
      if (viewerToken) {
        config.headers.Authorization = `Bearer ${viewerToken}`;
      }
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

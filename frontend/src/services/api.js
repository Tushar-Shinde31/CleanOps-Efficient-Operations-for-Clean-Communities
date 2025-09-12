import axios from 'axios';

// ============================
// API Base URL Configuration
// ============================
// Use API URL from environment variable (VITE_API_URL).
// If not found, fall back to deployed backend URL.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'https://cleanops-efficient-operations-for-clean.onrender.com/api';

// ============================
// Create Axios Instance
// ============================
// This instance will be used throughout the app
// so we don't need to repeat the base URL every time.
const api = axios.create({
  baseURL: API_BASE_URL,
});

// ============================
// Request Interceptor
// ============================
// Before each request is sent, this function runs.
// It attaches the user's JWT token (if available) to the request headers,
// so protected API endpoints can authenticate the user.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from browser storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================
// Export Axios Instance
// ============================
// Now, you can import `api` anywhere in the project
// and use it for API requests (GET, POST, PUT, DELETE, etc.).
export default api;

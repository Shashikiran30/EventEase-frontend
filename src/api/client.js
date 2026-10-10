import axios from 'axios';

const getBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL?.trim();
  if (!rawUrl) return '/api';
  if (rawUrl.endsWith('/api')) return rawUrl;
  return rawUrl.endsWith('/') ? `${rawUrl}api` : `${rawUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventease_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('eventease_token');
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

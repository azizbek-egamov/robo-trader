import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
});

// Interceptor: JWT tokenni so'rovga qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('xf_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Token muddati tugaganda tozalash
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('xf_access_token');
      localStorage.removeItem('xf_refresh_token');
    }
    return Promise.reject(error);
  }
);


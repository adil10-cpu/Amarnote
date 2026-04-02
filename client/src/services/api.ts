import axios from 'axios';

// Dynamic Base URL for Vercel/Localhost
export const BASE_URL = (typeof window !== 'undefined' && window.location.hostname !== 'localhost')
  ? window.location.origin
  : 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;




const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('amar-note-user');
  if (user) {
    const token = JSON.parse(user).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;

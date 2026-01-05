import axios from 'axios';

// Detecta se está rodando no servidor (SSR) ou no cliente (browser)
const isServer = typeof window === 'undefined';

// No servidor (Docker): usa nome do serviço 'api'
// No cliente (browser): usa localhost
const API_URL = isServer 
  ? process.env.NEXT_PUBLIC_API_URL_INTERNAL || 'http://api:3002'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export default api;

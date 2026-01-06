import axios from 'axios';

const isServer = typeof window === 'undefined';

const API_URL = isServer 
  ? process.env.NEXT_PUBLIC_API_URL_INTERNAL || 'http://api:3002/api'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

console.log('[Axios] 🔧 Configurando instância com baseURL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('[API] 🔄 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      params: config.params
    });

    if (!isServer) {
      try {
        const userStr = localStorage.getItem('smartclass_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          config.headers['x-user-id'] = user.id || user._id || user.email;
          console.log('[API] ✅ Header x-user-id adicionado:', config.headers['x-user-id']);
        } else {
          console.warn('[API] ⚠️ Nenhum usuário encontrado no localStorage');
        }
      } catch (error) {
        console.error('[API] ❌ Erro ao parsear usuário:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log('[API] ✅ Response:', {
      status: response.status,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    console.error('[API] ❌ Erro na requisição:', {
      message: error.message,
      url: error.config?.url,
      fullURL: error.config?.baseURL ? `${error.config.baseURL}${error.config.url}` : error.config?.url,
      status: error.response?.status
    });
    
    if (error.response) {
      if (error.response.status === 401) {
        console.error('[API] ❌ Usuário não autenticado');
        if (!isServer && typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
          if (!publicRoutes.some(route => currentPath.startsWith(route))) {
            window.location.href = '/login';
          }
        }
      }

      if (error.response.status === 404) {
        console.error('[API] ❌ Rota não encontrada:', {
          tentativa: error.config?.url,
          sugestão: 'Verifique se a rota existe no backend com prefixo /api'
        });
      }
    }

    return Promise.reject(error);
  }
);

export default api;

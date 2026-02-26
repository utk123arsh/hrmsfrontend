import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

console.log('🚀 API URL:', import.meta.env.VITE_API_URL);

// Request interceptor
api.interceptors.request.use(
  config => {
    console.log('📤 [REQUEST]', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => {
    console.log('✅ [RESPONSE]', response.status, response.config.url, response.data);
    return response;
  },
  error => {
    console.error('❌ [ERROR]', {
      status: error.response?.status,
      url: error.response?.config?.url,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;

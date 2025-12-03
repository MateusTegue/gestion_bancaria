import axios, { type AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_BASE_PATH || '/api'}`
    : import.meta.env.VITE_API_BASE_PATH || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; error?: string }>) => {
    // No mostrar toast aquí - dejar que los componentes manejen los errores
    // Esto evita mensajes duplicados
    return Promise.reject(error);
  }
);

export default api;


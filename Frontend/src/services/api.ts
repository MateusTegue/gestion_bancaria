import axios, { type AxiosError } from 'axios';
import { useToast } from 'vue-toastification';

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
    const toast = useToast();
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Ha ocurrido un error inesperado';
    
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default api;


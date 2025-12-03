import api from './api';
import type { ApiResponse, Usuario } from '../types';

export const authService = {
  async login(usuario: string, password: string): Promise<Usuario> {
    const response = await api.post<ApiResponse<Usuario>>('/auth', {
      usuario,
      password,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al autenticar');
    }
    return response.data.data;
  },

  logout() {
    // El logout se maneja en el frontend limpiando el localStorage
    // No hay endpoint de logout en el backend
  },
};


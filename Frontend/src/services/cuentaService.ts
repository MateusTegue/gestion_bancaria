import api from './api';
import type { Cuenta, ApiResponse } from '../types';

export const cuentaService = {
  async create(cuenta: Omit<Cuenta, 'id'>): Promise<Cuenta> {
    const response = await api.post<ApiResponse<Cuenta>>('/cuentas', cuenta);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al crear cuenta');
    }
    return response.data.data;
  },

  async listByCliente(clienteId: number): Promise<Cuenta[]> {
    const response = await api.get<ApiResponse<Cuenta[]>>(`/cuentas/cliente/${clienteId}`);
    return response.data.data || [];
  },

  async changeEstado(cuentaId: number, nuevoEstado: string): Promise<Cuenta> {
    const response = await api.put<ApiResponse<Cuenta>>(`/cuentas/${cuentaId}/estado`, {
      estado: nuevoEstado,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al cambiar estado');
    }
    return response.data.data;
  },

  async consultarSaldo(cuentaId: number): Promise<number> {
    const response = await api.get<ApiResponse<{ saldo: number }>>(`/cuentas/${cuentaId}/saldo`);
    return response.data.data?.saldo || 0;
  },

  async validarActiva(cuentaId: number): Promise<boolean> {
    const response = await api.get<ApiResponse<{ activa: boolean }>>(`/cuentas/${cuentaId}/validar`);
    return response.data.data?.activa || false;
  },
};


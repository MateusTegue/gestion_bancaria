import api from './api';
import type { ApiResponse, DepositoData, RetiroData, TransferenciaData, HistorialTransaccion } from '../types';

export const transactionService = {
  async realizarDeposito(cuentaId: string, monto: number, usuarioId: number): Promise<DepositoData> {
    const response = await api.post<ApiResponse<DepositoData>>('/transacciones/deposito', {
      cuentaId,
      monto,
      usuarioId,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al realizar depósito');
    }
    return response.data.data;
  },

  async realizarRetiro(cuentaId: string, monto: number, usuarioId: number): Promise<RetiroData> {
    const response = await api.post<ApiResponse<RetiroData>>('/transacciones/retiro', {
      cuentaId,
      monto,
      usuarioId,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al realizar retiro');
    }
    return response.data.data;
  },

  async realizarTransferencia(
    cuentaOrigen: string,
    cuentaDestino: string,
    monto: number,
    usuarioId: number
  ): Promise<TransferenciaData> {
    const response = await api.post<ApiResponse<TransferenciaData>>('/transacciones/transferencia', {
      cuentaOrigen,
      cuentaDestino,
      monto,
      usuarioId,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al realizar transferencia');
    }
    return response.data.data;
  },

  async generarHistorial(
    cuentaId: string,
    fechaInicio: string,
    fechaFin: string
  ): Promise<HistorialTransaccion[]> {
    const response = await api.get<ApiResponse<HistorialTransaccion[]>>(
      `/transacciones/${cuentaId}/historial`,
      {
        params: {
          fechaInicio,
          fechaFin,
        },
      }
    );
    return response.data.data || [];
  },
};


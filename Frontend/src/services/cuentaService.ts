import api from './api';
import type { Cuenta, ApiResponse } from '../types';
import { getEstadoCuentaDescripcion, getTipoCuentaDescripcion, getEstadoCuentaId, getTipoCuentaId } from '../utils/tipoParametros';

interface CuentaBackend {
  cuentaId?: string;
  id?: string | number;
  clienteId: number;
  tipoCuentaId?: number;
  tipoCuenta?: string | null;
  estadoId?: number;
  estado?: string;
  saldo: number;
  numeroCuenta?: string;
}

const mapCuentaFromBackend = (data: CuentaBackend): Cuenta => {
  // El backend puede devolver datos en dos formatos diferentes
  const cuentaId = data.cuentaId || data.id || data.numeroCuenta || '';
  const numeroCuenta = data.numeroCuenta || data.cuentaId || String(data.id || '');
  
  // Mapear estado usando el helper
  let estado = data.estado;
  if (!estado && data.estadoId !== undefined && data.estadoId !== null) {
    estado = getEstadoCuentaDescripcion(data.estadoId);
  }
  
  // Mapear tipo de cuenta usando el helper
  let tipoCuenta = data.tipoCuenta;
  if (!tipoCuenta && data.tipoCuentaId !== undefined && data.tipoCuentaId !== null) {
    tipoCuenta = getTipoCuentaDescripcion(data.tipoCuentaId);
  }
  
  return {
    id: cuentaId, // Usar cuentaId como id para compatibilidad
    numeroCuenta: numeroCuenta,
    clienteId: data.clienteId,
    tipoCuenta: tipoCuenta || undefined,
    saldo: data.saldo || 0,
    estado: estado || 'N/A',
  };
};

export const cuentaService = {
  async create(cuenta: Omit<Cuenta, 'id'>): Promise<Cuenta> {
    // Convertir la descripción del tipo de cuenta a su ID numérico
    const tipoCuentaId = cuenta.tipoCuenta ? getTipoCuentaId(cuenta.tipoCuenta) : undefined;
    
    const response = await api.post<ApiResponse<CuentaBackend>>('/cuentas', {
      cuentaId: cuenta.numeroCuenta,
      clienteId: cuenta.clienteId,
      tipoCuentaId: tipoCuentaId,
      saldoInicial: cuenta.saldo || 0,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al crear cuenta');
    }
    return mapCuentaFromBackend(response.data.data);
  },

  async listByCliente(clienteId: number): Promise<Cuenta[]> {
    const response = await api.get<ApiResponse<CuentaBackend[]>>(`/cuentas/cliente/${clienteId}`);
    const data = response.data.data || [];
    return data.map(mapCuentaFromBackend);
  },

  async listAll(): Promise<Cuenta[]> {
    const response = await api.get<ApiResponse<CuentaBackend[]>>('/cuentas');
    const data = response.data.data || [];
    return data.map(mapCuentaFromBackend);
  },

  async changeEstado(cuentaId: number | string, nuevoEstado: string): Promise<Cuenta> {
    // Convertir la descripción del estado a su ID numérico
    const estadoId = getEstadoCuentaId(nuevoEstado);
    if (!estadoId) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }
    
    // Obtener usuario del localStorage
    const storedUsuario = localStorage.getItem('usuario');
    if (!storedUsuario) {
      throw new Error('Usuario no autenticado');
    }
    const usuario = JSON.parse(storedUsuario);
    const usuarioId = usuario.usuarioId;
    
    // El backend espera el cuentaId como string en algunos casos
    const cuentaIdStr = String(cuentaId);
    const response = await api.put<ApiResponse<CuentaBackend>>(`/cuentas/${cuentaIdStr}/estado`, {
      estadoId: estadoId,
      usuarioId: usuarioId,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al cambiar estado');
    }
    return mapCuentaFromBackend(response.data.data);
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


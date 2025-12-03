import api from './api';
import type { Cliente, ClienteBackend, ApiResponse } from '../types';

const mapClienteFromBackend = (data: ClienteBackend): Cliente => {
  if (data.nombre) {
    const partes = data.nombre.split(' ');
    return {
      id: Number(data.clienteId),
      identificacion: String(data.identificacion || ''),
      nombre: partes[0] || '',
      apellido: partes.slice(1).join(' ') || '',
      direccion: data.direccion || '',
    };
  }
  
  return {
    id: Number(data.clienteId),
    identificacion: String(data.identificacion || ''),
    nombre: `${data.primerNombre || ''} ${data.segundoNombre || ''}`.trim() || data.nombreCompleto || '',
    apellido: `${data.primerApellido || ''} ${data.segundoApellido || ''}`.trim() || '',
    direccion: data.direccion || '',
  };
};

const getClienteBackendData = async (id: number): Promise<ClienteBackend> => {
  const response = await api.get<ApiResponse<ClienteBackend>>(`/clientes/${id}`);
  if (!response.data.data) {
    throw new Error(response.data.message || 'Cliente no encontrado');
  }
  return response.data.data;
};

export const clienteService = {
  async listAll(): Promise<Cliente[]> {
    const response = await api.get<ApiResponse<ClienteBackend[]>>('/clientes');
    const data = response.data.data || [];
    return data.map(mapClienteFromBackend);
  },

  async getById(id: number): Promise<Cliente> {
    const response = await api.get<ApiResponse<ClienteBackend>>(`/clientes/${id}`);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Cliente no encontrado');
    }
    return mapClienteFromBackend(response.data.data);
  },

  async getByIdForForm(id: number): Promise<ClienteBackend> {
    return getClienteBackendData(id);
  },

  async create(cliente: any): Promise<Cliente> {
    const response = await api.post<ApiResponse<ClienteBackend>>('/clientes', cliente);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al crear cliente');
    }
    return mapClienteFromBackend(response.data.data);
  },

  async update(id: number, cliente: any): Promise<Cliente> {
    const response = await api.put<ApiResponse<ClienteBackend>>(`/clientes/${id}`, cliente);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar cliente');
    }
    return mapClienteFromBackend(response.data.data);
  },

  async delete(id: number, usuarioId: number): Promise<void> {
    await api.delete<ApiResponse<void>>(`/clientes/${id}`, {
      data: { usuarioId },
    });
  },

  async searchByIdentificacion(identificacion: string): Promise<Cliente | null> {
    const response = await api.get<ApiResponse<ClienteBackend>>(`/clientes/buscar/${identificacion}`);
    if (!response.data.data) {
      return null;
    }
    return mapClienteFromBackend(response.data.data);
  },
};


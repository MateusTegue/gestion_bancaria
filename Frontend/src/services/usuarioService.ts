import api from './api';
import type { Usuario, UsuarioBackend, ApiResponse } from '../types';

const mapUsuarioFromBackend = (data: UsuarioBackend): Usuario => {
  const rolNombre = String(data.rolNombre || data.ROL_NOMBRE || data.rol || data.ROL || '');
  
  // Mapear el nombre del rol al ID correspondiente
  let rolId = Number(data.rolId || data.ROL_ID);
  if (isNaN(rolId)) {
    const rolNombreUpper = rolNombre.toUpperCase();
    if (rolNombreUpper === 'ADMINISTRADOR' || rolNombreUpper === 'ADMON') {
      rolId = 1;
    } else if (rolNombreUpper === 'ANALISTA') {
      rolId = 2;
    } else if (rolNombreUpper === 'CLIENTE') {
      rolId = 3;
    } else {
      rolId = 0;
    }
  }
  
  return {
    usuarioId: Number(data.usuarioId || data.USUARIO_ID),
    usuario: String(data.usuario || data.USUARIO),
    rolId,
    rolNombre,
    clienteId: data.clienteId || data.CLIENTE_ID || null,
    nombreCliente: data.nombreCliente || data.NOMBRE_CLIENTE || null
  };
};

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const usuarioService = {
  async listAll(params?: PaginationParams): Promise<PaginatedResponse<Usuario>> {
    const response = await api.get<ApiResponse<PaginatedResponse<UsuarioBackend>>>('/usuarios', { params });
    const paginatedData = response.data.data;
    
    if (!paginatedData) {
      return {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: params?.limit || 10,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };
    }
    
    return {
      data: paginatedData.data.map(mapUsuarioFromBackend),
      pagination: paginatedData.pagination
    };
  },

  async getById(usuarioId: number): Promise<Usuario> {
    const response = await api.get<ApiResponse<UsuarioBackend>>(`/usuarios/${usuarioId}`);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Usuario no encontrado');
    }
    return mapUsuarioFromBackend(response.data.data);
  },

  async create(userData: {
    rolId: number;
    clienteId?: string | null;
    usuario: string;
    password: string;
  }): Promise<Usuario> {
    const response = await api.post<ApiResponse<UsuarioBackend>>('/usuarios', userData);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al crear usuario');
    }
    return mapUsuarioFromBackend(response.data.data);
  },

  async update(usuarioId: number, userData: {
    rolId: number;
    clienteId?: string | null;
    usuario: string;
  }): Promise<Usuario> {
    const response = await api.put<ApiResponse<UsuarioBackend>>(`/usuarios/${usuarioId}`, userData);
    if (!response.data.data) {
      throw new Error(response.data.message || 'Error al actualizar usuario');
    }
    return mapUsuarioFromBackend(response.data.data);
  },

  async delete(usuarioId: number, adminId: number): Promise<void> {
    await api.delete(`/usuarios/${usuarioId}`, {
      data: { adminId }
    });
  },

  async changePassword(passwordData: {
    usuarioId: number;
    passwordActual: string;
    passwordNuevo: string;
  }): Promise<void> {
    await api.put('/usuarios/cambiar-password', passwordData);
  },

  async resetPassword(resetData: {
    usuarioId: number;
    passwordNuevo: string;
    adminId: number;
  }): Promise<void> {
    await api.put('/usuarios/resetear-password', resetData);
  },

  async listByRole(rolId: number): Promise<Usuario[]> {
    const response = await api.get<ApiResponse<UsuarioBackend[]>>(`/usuarios/rol/${rolId}`);
    const data = response.data.data || [];
    return data.map(mapUsuarioFromBackend);
  },

  async searchByUsername(usuario: string): Promise<Usuario[]> {
    const response = await api.get<ApiResponse<UsuarioBackend[]>>(`/usuarios/buscar`, {
      params: { usuario }
    });
    const data = response.data.data || [];
    return data.map(mapUsuarioFromBackend);
  }
};

export default usuarioService;

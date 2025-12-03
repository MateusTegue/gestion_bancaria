import { ref, computed } from 'vue';
import type { Usuario } from '../types';
import { ROLES, getRolNombre } from '../utils/roles';

const usuario = ref<Usuario | null>(null);
const isAuthenticated = computed(() => usuario.value !== null);

// Cargar usuario del localStorage al inicializar
const loadUsuarioFromStorage = () => {
  const stored = localStorage.getItem('usuario');
  if (stored) {
    try {
      usuario.value = JSON.parse(stored);
    } catch (error) {
      console.error('Error al cargar usuario del localStorage:', error);
      localStorage.removeItem('usuario');
    }
  }
};

// Inicializar al cargar el módulo
loadUsuarioFromStorage();

export const useAuth = () => {
  const setUsuario = (user: Usuario) => {
    // Asegurar que el nombre del rol esté presente
    if (!user.rolNombre && user.rolId) {
      user.rolNombre = getRolNombre(user.rolId);
    }
    usuario.value = user;
    localStorage.setItem('usuario', JSON.stringify(user));
  };

  const clearUsuario = () => {
    usuario.value = null;
    localStorage.removeItem('usuario');
  };

  const getUsuario = () => {
    return usuario.value;
  };

  const isAdmin = computed(() => {
    return usuario.value?.rolId === ROLES.ADMON;
  });

  const isAnalista = computed(() => {
    return usuario.value?.rolId === ROLES.ANALISTA;
  });

  const isCliente = computed(() => {
    return usuario.value?.rolId === ROLES.CLIENTE;
  });

  const rolNombre = computed(() => {
    if (!usuario.value) return '';
    return usuario.value.rolNombre || getRolNombre(usuario.value.rolId);
  });

  return {
    usuario: computed(() => usuario.value),
    isAuthenticated,
    isAdmin,
    isAnalista,
    isCliente,
    rolNombre,
    setUsuario,
    clearUsuario,
    getUsuario,
  };
};


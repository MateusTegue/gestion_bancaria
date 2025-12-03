import { ref, computed } from 'vue';
import type { Usuario } from '../types';
import { ROLES, getRolNombre } from '../utils/roles';

const usuario = ref<Usuario | null>(null);
const isAuthenticated = computed(() => usuario.value !== null);

const loadUsuarioFromStorage = () => {
  const stored = localStorage.getItem('usuario');
  if (stored) {
    try {
      usuario.value = JSON.parse(stored);
    } catch (error) {
      localStorage.removeItem('usuario');
    }
  }
};

loadUsuarioFromStorage();

export const useAuth = () => {
  const setUsuario = (user: Usuario) => {
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


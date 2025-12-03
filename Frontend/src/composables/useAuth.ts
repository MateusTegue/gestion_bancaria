import { ref, computed } from 'vue';
import type { Usuario } from '../types';

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
    return usuario.value?.rolId === 1;
  });

  return {
    usuario: computed(() => usuario.value),
    isAuthenticated,
    isAdmin,
    setUsuario,
    clearUsuario,
    getUsuario,
  };
};


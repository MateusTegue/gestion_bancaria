// Mapeo de roles
export const ROLES = {
  ADMON: 1,
  ANALISTA: 2,
  CLIENTE: 3,
} as const;

export const ROL_NAMES: Record<number, string> = {
  1: 'ADMON',
  2: 'ANALISTA',
  3: 'CLIENTE',
};

// Función para obtener el nombre del rol
export const getRolNombre = (rolId: number): string => {
  return ROL_NAMES[rolId] || 'Desconocido';
};

// Función para obtener la ruta de redirección según el rol
export const getRedirectPathByRole = (rolId: number, redirectQuery?: string): string => {
  // Si hay una ruta de redirección específica y el usuario tiene acceso, usarla
  if (redirectQuery && redirectQuery !== '/login') {
    return redirectQuery;
  }

  // Redirección basada en rol
  switch (rolId) {
    case ROLES.ADMON: // Administrador - acceso completo
      return '/';
    case ROLES.ANALISTA: // Analista - acceso a consultas y transacciones
      return '/transacciones';
    case ROLES.CLIENTE: // Cliente - acceso limitado
      return '/cuentas';
    default:
      return '/';
  }
};

// Función para verificar si un rol tiene acceso a una ruta
export const hasAccessToRoute = (rolId: number, routeName: string): boolean => {
  switch (rolId) {
    case ROLES.ADMON: // Administrador - acceso completo
      return true;
    case ROLES.ANALISTA: // Analista - acceso a transacciones y consultas
      return [
        'home',
        'transacciones',
        'cuentas',
        'cliente-detalle', // Solo lectura
      ].includes(routeName);
    case ROLES.CLIENTE: // Cliente - acceso a cuentas y transacciones
      return [
        'home',
        'cuentas',
        'transacciones',
        'cliente-detalle', // Solo su propia información
      ].includes(routeName);
    default:
      return false;
  }
};


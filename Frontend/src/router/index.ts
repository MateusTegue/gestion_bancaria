import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { hasAccessToRoute, getRedirectPathByRole } from '../utils/roles';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/ClientesView.vue'),
    meta: { requiresAuth: true, allowedRoles: [1] }, // Solo ADMON
  },
  {
    path: '/clientes/nuevo',
    name: 'cliente-nuevo',
    component: () => import('../views/ClienteFormView.vue'),
    meta: { requiresAuth: true, allowedRoles: [1] }, // Solo ADMON
  },
  {
    path: '/clientes/:id',
    name: 'cliente-detalle',
    component: () => import('../views/ClienteDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/clientes/:id/editar',
    name: 'cliente-editar',
    component: () => import('../views/ClienteFormView.vue'),
    meta: { requiresAuth: true, allowedRoles: [1] }, // Solo ADMON
  },
  {
    path: '/cuentas',
    name: 'cuentas',
    component: () => import('../views/CuentasView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/transacciones',
    name: 'transacciones',
    component: () => import('../views/TransaccionesView.vue'),
    meta: { requiresAuth: true, allowedRoles: [1, 2, 3] }, // ADMON, ANALISTA y CLIENTE
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: () => import('../views/UsuariosView.vue'),
    meta: { requiresAuth: true, allowedRoles: [1] }, // Solo ADMON
  },
  {
    path: '/perfil',
    name: 'perfil',
    component: () => import('../views/PerfilView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const { isAuthenticated, usuario } = useAuth();
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirigir al login con la ruta de destino como query param
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
    return;
  }
  
  // Si el usuario está autenticado y trata de ir al login
  if (to.path === '/login' && isAuthenticated.value) {
    // Redirigir según el rol
    const redirectTo = getRedirectPathByRole(usuario.value?.rolId || 1);
    next(redirectTo);
    return;
  }
  
  // Verificar permisos de rol si la ruta tiene restricciones
  if (to.meta.requiresAuth && to.meta.allowedRoles && usuario.value) {
    const allowedRoles = to.meta.allowedRoles as number[];
    if (!allowedRoles.includes(usuario.value.rolId)) {
      // Verificar si tiene acceso usando la función de utilidad
      if (!hasAccessToRoute(usuario.value.rolId, to.name as string)) {
        // Redirigir a una ruta permitida según el rol
        const redirectTo = getRedirectPathByRole(usuario.value.rolId);
        next(redirectTo);
        return;
      }
    }
  }
  
  next();
});

export default router;


import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuth } from '../composables/useAuth';

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
    meta: { requiresAuth: true },
  },
  {
    path: '/clientes/nuevo',
    name: 'cliente-nuevo',
    component: () => import('../views/ClienteFormView.vue'),
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Redirigir al login con la ruta de destino como query param
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } 
  // Si el usuario está autenticado y trata de ir al login
  else if (to.path === '/login' && isAuthenticated.value) {
    // Redirigir al home
    next('/');
  } 
  else {
    next();
  }
});

export default router;


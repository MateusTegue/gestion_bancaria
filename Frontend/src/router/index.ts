import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/ClientesView.vue'),
  },
  {
    path: '/clientes/nuevo',
    name: 'cliente-nuevo',
    component: () => import('../views/ClienteFormView.vue'),
  },
  {
    path: '/clientes/:id',
    name: 'cliente-detalle',
    component: () => import('../views/ClienteDetailView.vue'),
  },
  {
    path: '/clientes/:id/editar',
    name: 'cliente-editar',
    component: () => import('../views/ClienteFormView.vue'),
  },
  {
    path: '/cuentas',
    name: 'cuentas',
    component: () => import('../views/CuentasView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


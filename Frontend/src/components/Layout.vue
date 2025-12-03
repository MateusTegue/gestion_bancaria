<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <RouterLink to="/" class="text-2xl font-bold text-blue-600">
                Gestión Bancaria
              </RouterLink>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <RouterLink
                to="/"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Inicio
              </RouterLink>
              <RouterLink
                to="/clientes"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Clientes
              </RouterLink>
              <RouterLink
                to="/cuentas"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Cuentas
              </RouterLink>
              <RouterLink
                to="/transacciones"
                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-blue-500 text-gray-900"
              >
                Transacciones
              </RouterLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div v-if="usuario" class="flex items-center space-x-3">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-gray-900">{{ usuario.usuario }}</p>
                <p class="text-xs text-gray-500">
                  {{ usuario.rolId === 1 ? 'Administrador' : 'Usuario' }}
                </p>
              </div>
              <Button
                variant="secondary"
                @click="handleLogout"
                class="text-sm px-3 py-1.5"
              >
                Cerrar Sesión
              </Button>
            </div>
            <RouterLink
              v-else
              to="/login"
              class="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Iniciar Sesión
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import Button from './Button.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const router = useRouter();
const { usuario, clearUsuario } = useAuth();
const { success } = useToast();

const handleLogout = () => {
  clearUsuario();
  success('Sesión cerrada exitosamente');
  router.push('/login');
};
</script>


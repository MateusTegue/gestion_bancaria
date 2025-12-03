<template>
  <Layout>
    <div>
      <!-- Welcome Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {{ usuario?.usuario }}
        </h2>
        <p class="text-gray-600">
          Sistema de Gestión Bancaria - {{ rolNombre }}
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Clientes Card (Solo ADMON) -->
        <div v-if="isAdmin" class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Clientes</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalClientes || '-' }}</p>
            </div>
            <div class="bg-blue-100 rounded-full p-4">
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <RouterLink
            to="/clientes"
            class="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos →
          </RouterLink>
        </div>

        <!-- Cuentas Card -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Cuentas</p>
            </div>
            <div class="bg-green-100 rounded-full p-4">
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          <RouterLink
            to="/cuentas"
            class="mt-4 inline-block text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Ver todas →
          </RouterLink>
        </div>

        <!-- Transacciones Card (Todos los roles) -->
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Transacciones Hoy</p>
            </div>
            <div class="bg-purple-100 rounded-full p-4">
              <svg
                class="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>
          <RouterLink
            to="/transacciones"
            class="mt-4 inline-block text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            Ver todas →
          </RouterLink>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-if="isAdmin"
            to="/clientes/nuevo"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="bg-blue-100 rounded-lg p-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Nuevo Cliente</p>
              <p class="text-sm text-gray-500">Registrar nuevo cliente</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/cuentas"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="bg-green-100 rounded-lg p-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Nueva Cuenta</p>
              <p class="text-sm text-gray-500">Crear nueva cuenta</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/transacciones"
            class="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="bg-purple-100 rounded-lg p-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-gray-900">Realizar Transacción</p>
              <p class="text-sm text-gray-500">Depósito, retiro o transferencia</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import Layout from '../components/Layout.vue';
import { useAuth } from '../composables/useAuth';

const { usuario, rolNombre, isAdmin } = useAuth();

const stats = ref({
  totalClientes: null as number | null,
  totalCuentas: null as number | null,
  transaccionesHoy: null as number | null,
});

onMounted(() => {
  // TODO: Cargar estadísticas desde el backend
  // Por ahora, valores placeholder
  stats.value = {
    totalClientes: null,
    totalCuentas: null,
    transaccionesHoy: null,
  };
});
</script>


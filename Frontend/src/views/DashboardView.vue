<template>
  <Layout>
    <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Bienvenido, {{ usuario?.usuario }}
      </h1>
      <p class="text-gray-600 text-lg">
        Sistema de Gestión Bancaria - {{ rolNombre }}
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Clientes Card (Solo ADMON) -->
      <div
        v-if="isAdmin"
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ loading ? '...' : stats.totalClientes ?? '-' }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-md">
            <svg
              class="w-8 h-8 text-white"
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
          class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Ver todos
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>

      <!-- Cuentas Card -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">Total Cuentas</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ loading ? '...' : stats.totalCuentas ?? '-' }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-md">
            <svg
              class="w-8 h-8 text-white"
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
          class="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          Ver todas
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>

      <!-- Transacciones Card -->
      <div
        class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 mb-1">Transacciones Hoy</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ loading ? '...' : stats.transaccionesHoy ?? '-' }}
            </p>
          </div>
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-md">
            <svg
              class="w-8 h-8 text-white"
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
          class="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          Ver todas
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nueva Cuenta (Solo ADMON) -->
        <RouterLink
          v-if="isAdmin"
          to="/cuentas"
          class="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4"
        >
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-md group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Nueva Cuenta</h3>
            <p class="text-sm text-gray-600">Crear nueva cuenta bancaria</p>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>

        <!-- Realizar Transacción -->
        <RouterLink
          to="/transacciones"
          class="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4"
        >
          <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-md group-hover:scale-110 transition-transform">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">Realizar Transacción</h3>
            <p class="text-sm text-gray-600">Depósito, retiro o transferencia</p>
          </div>
          <svg class="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
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
import { clienteService } from '../services/clienteService';
import { cuentaService } from '../services/cuentaService';
import { transactionService } from '../services/transactionService';
import { useToast } from '../composables/useToast';

const { usuario, rolNombre, isAdmin, isCliente } = useAuth();
const { error: showError } = useToast();

const loading = ref(false);
const stats = ref({
  totalClientes: null as number | null,
  totalCuentas: null as number | null,
  transaccionesHoy: null as number | null,
});

const loadStats = async () => {
  loading.value = true;
  try {
    if (isAdmin.value) {
      const clientes = await clienteService.listAll();
      stats.value.totalClientes = clientes.length;
    }

    if (isCliente.value && usuario.value?.clienteId) {
      const cuentas = await cuentaService.listByCliente(Number(usuario.value.clienteId));
      stats.value.totalCuentas = cuentas.length;
    } else if (isAdmin.value) {
      const cuentas = await cuentaService.listAll();
      stats.value.totalCuentas = cuentas.length;
    }

    if (usuario.value?.usuarioId) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const hoyStr = hoy.toISOString().split('T')[0];
      
      const transacciones = await transactionService.listarHistorialUsuario(
        usuario.value.usuarioId,
        hoyStr,
        hoyStr
      );
      stats.value.transaccionesHoy = transacciones.length;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
    showError(errorMessage);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStats();
});
</script>

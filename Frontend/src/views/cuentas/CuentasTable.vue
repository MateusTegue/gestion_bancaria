<template>
  <div v-if="cuentas.length === 0" class="text-center py-12">
    <p class="text-gray-600 text-lg">No se encontraron cuentas</p>
  </div>

  <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Número de Cuenta
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Cliente ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tipo
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Saldo
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Estado
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="cuenta in cuentas" :key="cuenta.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ cuenta.numeroCuenta }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ cuenta.clienteId }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ cuenta.tipoCuenta || '-' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${{ cuenta.saldo?.toLocaleString() || '0' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                cuenta.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
              ]"
            >
              {{ cuenta.estado || 'N/A' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              v-if="cuenta.id"
              class="text-blue-600 hover:text-blue-900 mr-4"
              @click="handleConsultarSaldo(cuenta.id)"
            >
              Ver Saldo
            </button>
            <button
              v-if="cuenta.id"
              class="text-indigo-600 hover:text-indigo-900"
              @click="handleCambiarEstado(cuenta)"
            >
              {{ cuenta.estado === 'ACTIVA' ? 'Desactivar' : 'Activar' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Cuenta } from '../../types';

interface Props {
  cuentas: Cuenta[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  consultarSaldo: [cuentaId: number];
  cambiarEstado: [cuenta: Cuenta];
}>();

const handleConsultarSaldo = (cuentaId: number) => {
  emit('consultarSaldo', cuentaId);
};

const handleCambiarEstado = (cuenta: Cuenta) => {
  emit('cambiarEstado', cuenta);
};
</script>


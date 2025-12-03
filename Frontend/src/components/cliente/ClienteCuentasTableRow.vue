<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {{ cuenta.numeroCuenta }}
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
    <ClienteCuentasTableActions
      :cuenta-id="cuenta.id"
      :estado="cuenta.estado"
      @consultar-saldo="handleConsultarSaldo"
      @cambiar-estado="handleCambiarEstado"
    />
  </tr>
</template>

<script setup lang="ts">
import type { Cuenta } from '../../types';
import ClienteCuentasTableActions from './ClienteCuentasTableActions.vue';

interface Props {
  cuenta: Cuenta;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  consultarSaldo: [cuentaId: number];
  cambiarEstado: [cuenta: Cuenta];
}>();

const handleConsultarSaldo = () => {
  if (props.cuenta.id) {
    emit('consultarSaldo', props.cuenta.id);
  }
};

const handleCambiarEstado = () => {
  emit('cambiarEstado', props.cuenta);
};
</script>


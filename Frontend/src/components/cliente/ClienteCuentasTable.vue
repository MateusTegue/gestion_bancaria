<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold text-gray-900">Cuentas</h2>
      <slot name="actions" />
    </div>

    <ClienteCuentasTableLoading v-if="loading" />

    <ClienteCuentasTableEmpty v-else-if="cuentas.length === 0" />

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <ClienteCuentasTableHeader />
        <tbody class="bg-white divide-y divide-gray-200">
          <ClienteCuentasTableRow
            v-for="cuenta in cuentas"
            :key="cuenta.id"
            :cuenta="cuenta"
            @consultar-saldo="handleConsultarSaldo"
            @cambiar-estado="handleCambiarEstado"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cuenta } from '../../types';
import ClienteCuentasTableHeader from './ClienteCuentasTableHeader.vue';
import ClienteCuentasTableRow from './ClienteCuentasTableRow.vue';
import ClienteCuentasTableLoading from './ClienteCuentasTableLoading.vue';
import ClienteCuentasTableEmpty from './ClienteCuentasTableEmpty.vue';

interface Props {
  cuentas: Cuenta[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

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


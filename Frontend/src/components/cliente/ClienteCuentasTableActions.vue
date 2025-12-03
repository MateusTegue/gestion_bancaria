<template>
  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <button
      v-if="cuentaId"
      class="text-blue-600 hover:text-blue-900 mr-4"
      @click="handleConsultarSaldo"
    >
      Ver Saldo
    </button>
    <button
      v-if="cuentaId"
      class="text-indigo-600 hover:text-indigo-900"
      @click="handleCambiarEstado"
    >
      {{ estado === 'ACTIVA' ? 'Desactivar' : 'Activar' }}
    </button>
  </td>
</template>

<script setup lang="ts">
interface Props {
  cuentaId?: number | string;
  estado?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  consultarSaldo: [];
  cambiarEstado: [];
}>();

const handleConsultarSaldo = () => {
  emit('consultarSaldo');
};

const handleCambiarEstado = () => {
  emit('cambiarEstado');
};
</script>


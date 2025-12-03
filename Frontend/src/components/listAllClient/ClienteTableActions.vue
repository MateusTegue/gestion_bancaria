<template>
  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    <RouterLink
      :to="`/clientes/${clienteId}`"
      class="text-blue-600 hover:text-blue-900 mr-4"
    >
      Ver
    </RouterLink>
    <RouterLink
      :to="`/clientes/${clienteId}/editar`"
      class="text-indigo-600 hover:text-indigo-900 mr-4"
    >
      Editar
    </RouterLink>
    <button
      class="text-red-600 hover:text-red-900"
      @click="handleDelete"
    >
      Eliminar
    </button>
  </td>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
  clienteId: string | number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  delete: [];
}>();

const handleDelete = () => {
  emit('delete');
};
</script>


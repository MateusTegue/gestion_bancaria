<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {{ cliente.id || '-' }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {{ cliente.identificacion }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ cliente.nombre }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ cliente.apellido }}
    </td>
    <ClienteTableActions
      :cliente-id="cliente.id"
      @delete="handleDelete"
    />
  </tr>
</template>

<script setup lang="ts">
import type { Cliente } from '../../types';
import ClienteTableActions from './ClienteTableActions.vue';

interface Props {
  cliente: Cliente;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  delete: [cliente: Cliente];
}>();

const handleDelete = () => {
  emit('delete', props.cliente);
};
</script>


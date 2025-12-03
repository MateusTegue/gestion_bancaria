<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <ClienteTableHeader />
      <tbody class="bg-white divide-y divide-gray-200">
        <ClienteTableRow
          v-for="cliente in clientes"
          :key="cliente.id"
          :cliente="cliente"
          @delete="handleDelete"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Cliente } from '../../types';
import ClienteTableHeader from './ClienteTableHeader.vue';
import ClienteTableRow from './ClienteTableRow.vue';

interface Props {
  clientes: Cliente[];
}

defineProps<Props>();

const emit = defineEmits<{
  delete: [cliente: Cliente];
}>();

const handleDelete = (cliente: Cliente) => {
  emit('delete', cliente);
};
</script>


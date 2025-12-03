<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Identificación
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nombre
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Apellido
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="cliente in clientes" :key="cliente.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ cliente.identificacion }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ cliente.nombre }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ cliente.apellido }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <RouterLink
              :to="`/clientes/${cliente.id}`"
              class="text-blue-600 hover:text-blue-900 mr-4"
            >
              Ver
            </RouterLink>
            <RouterLink
              :to="`/clientes/${cliente.id}/editar`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Editar
            </RouterLink>
            <button
              class="text-red-600 hover:text-red-900"
              @click="handleDeleteClick(cliente)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Cliente } from '../../types';

interface Props {
  clientes: Cliente[];
}

defineProps<Props>();

const emit = defineEmits<{
  delete: [cliente: Cliente];
}>();

const handleDeleteClick = (cliente: Cliente) => {
  emit('delete', cliente);
};
</script>


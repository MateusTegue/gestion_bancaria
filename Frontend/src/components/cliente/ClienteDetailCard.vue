<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Identificación</label>
        <p class="text-lg text-gray-900">{{ cliente.identificacion }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
        <p class="text-lg text-gray-900">{{ cliente.nombre }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Apellido</label>
        <p class="text-lg text-gray-900">{{ cliente.apellido }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-500 mb-1">Dirección</label>
        <p class="text-lg text-gray-900">{{ cliente.direccion || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cliente } from '../../types';

interface Props {
  cliente: Cliente;
}

defineProps<Props>();
</script>


<template>
  <div>
    <p>
      ¿Estás seguro de que deseas eliminar al cliente
      <strong>{{ cliente?.nombre }} {{ cliente?.apellido }}</strong>?
    </p>
    <p class="mt-2 text-sm text-gray-500">
      Esta acción no se puede deshacer.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Cliente } from '../../types';

interface Props {
  cliente: Cliente | null;
}

defineProps<Props>();
</script>


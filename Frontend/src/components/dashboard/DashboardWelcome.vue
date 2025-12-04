<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-2">
      Bienvenido, {{ usuario }}
    </h1>
    <p class="text-gray-600 text-lg">
      Sistema de Gestión Bancaria - {{ rolNombre }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  usuario?: string;
  rolNombre?: string;
}

withDefaults(defineProps<Props>(), {
  usuario: '',
  rolNombre: '',
});
</script>


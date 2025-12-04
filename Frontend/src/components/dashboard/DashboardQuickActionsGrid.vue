<template>
  <div class="mb-8">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h2>
    <div 
      :class="[
        'grid gap-6',
        isCliente ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isCliente?: boolean;
}

withDefaults(defineProps<Props>(), {
  isCliente: false,
});
</script>


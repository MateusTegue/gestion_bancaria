<template>
  <div 
    :class="[
      'grid gap-6 mb-8',
      isCliente ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    ]"
  >
    <slot />
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


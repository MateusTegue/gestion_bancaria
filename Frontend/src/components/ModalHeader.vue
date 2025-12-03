<template>
  <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
    {{ title }}
  </h3>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>


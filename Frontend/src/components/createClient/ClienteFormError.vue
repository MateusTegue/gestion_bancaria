<template>
  <div v-if="error" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
    <p class="text-red-800">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error?: string;
}

defineProps<Props>();
</script>


<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
}

defineProps<Props>();

defineEmits<{
  close: [];
}>();
</script>


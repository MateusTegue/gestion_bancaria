<template>
  <div
    class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900">
          {{ loading ? '...' : value ?? '-' }}
        </p>
      </div>
      <div :class="iconBgClass" class="rounded-xl p-4 shadow-md">
        <component :is="iconComponent" class="w-8 h-8 text-white" />
      </div>
    </div>
    <RouterLink
      v-if="to"
      :to="to"
      :class="linkClass"
      class="inline-flex items-center text-sm font-medium transition-colors"
    >
      Ver todos
      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
  label: string;
  value: number | null;
  loading?: boolean;
  iconComponent: any;
  iconBgClass: string;
  linkClass: string;
  to?: string;
}

withDefaults(defineProps<Props>(), {
  loading: false,
  to: undefined,
});
</script>


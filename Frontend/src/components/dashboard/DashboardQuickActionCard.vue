<template>
  <RouterLink
    :to="to"
    class="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4"
  >
    <div :class="iconBgClass" class="rounded-xl p-4 shadow-md group-hover:scale-110 transition-transform">
      <component :is="iconComponent" class="w-8 h-8 text-white" />
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
      <p class="text-sm text-gray-600">{{ description }}</p>
    </div>
    <svg :class="arrowClass" class="w-5 h-5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Props {
  to: string;
  title: string;
  description: string;
  iconComponent: any;
  iconBgClass: string;
  arrowClass: string;
}

defineProps<Props>();
</script>


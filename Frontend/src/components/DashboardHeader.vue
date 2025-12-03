<template>
  <header class="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-40" :class="headerClass">
    <div class="px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <button
            @click="$emit('toggle-sidebar')"
            class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 class="ml-2 md:ml-0 text-xl font-semibold text-gray-900">
            {{ title }}
          </h1>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  isSidebarOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSidebarOpen: true,
});

defineEmits<{
  'toggle-sidebar': [];
}>();

const headerClass = computed(() => {
  return props.isSidebarOpen ? 'md:left-64' : 'md:left-20';
});
</script>


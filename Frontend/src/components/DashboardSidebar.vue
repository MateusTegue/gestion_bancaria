<template>
  <aside
    :class="[
      'bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out',
      isOpen ? 'w-64' : 'w-20',
      'fixed h-screen z-30',
      'transform',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <SidebarMenu 
      :is-collapsed="!isOpen" 
      @toggle="$emit('toggle')"
      @logout="$emit('logout')"
    />
  </aside>
</template>

<script setup lang="ts">
import SidebarMenu from './SidebarMenu.vue';

interface Props {
  isOpen: boolean;
}

defineProps<Props>();

defineEmits<{
  toggle: [];
  logout: [];
}>();
</script>


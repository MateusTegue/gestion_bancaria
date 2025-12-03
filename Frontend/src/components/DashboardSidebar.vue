<template>
  <aside
    :class="[
      'bg-white shadow-lg transition-all duration-300 ease-in-out',
      isOpen ? 'w-64' : 'w-20',
      'fixed md:static h-screen z-30',
      'transform md:transform-none',
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


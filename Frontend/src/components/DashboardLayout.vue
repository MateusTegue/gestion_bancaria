<template>
  <div class="min-h-screen bg-gray-50">
    <DashboardSidebar
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
      @logout="handleLogout"
    />

    <DashboardOverlay
      :show="isSidebarOpen"
      @close="toggleSidebar"
    />

    <div 
      class="flex flex-col transition-all duration-300 ease-in-out"
      :class="[
        isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
      ]"
    >
      <DashboardHeader
        :title="pageTitle"
        :is-sidebar-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar"
      />

      <DashboardContent>
        <slot />
      </DashboardContent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DashboardSidebar from './DashboardSidebar.vue';
import DashboardOverlay from './DashboardOverlay.vue';
import DashboardHeader from './DashboardHeader.vue';
import DashboardContent from './DashboardContent.vue';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const { usuario, rolNombre, clearUsuario } = useAuth();
const { success } = useToast();

const isSidebarOpen = ref(true);

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    home: 'Dashboard',
    clientes: 'Clientes',
    'cliente-nuevo': 'Nuevo Cliente',
    'cliente-detalle': 'Detalle del Cliente',
    'cliente-editar': 'Editar Cliente',
    cuentas: 'Cuentas',
    transacciones: 'Transacciones',
    perfil: 'Mi Perfil',
  };
  return titles[route.name as string] || 'Dashboard';
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleLogout = () => {
  clearUsuario();
  success('Sesión cerrada exitosamente');
  router.push('/login');
};

const handleRouteChange = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
  
  router.afterEach(handleRouteChange);
});

onUnmounted(() => {});
</script>


<template>
  <div class="min-h-screen bg-gray-50 flex">
    <DashboardSidebar
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
      @logout="handleLogout"
    />

    <DashboardOverlay
      :show="isSidebarOpen"
      @close="toggleSidebar"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader
        :title="pageTitle"
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

// Título de la página basado en la ruta
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

// Cerrar sidebar en móvil al cambiar de ruta
const handleRouteChange = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  // Ajustar sidebar según el tamaño de la pantalla
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false;
  }
  
  router.afterEach(handleRouteChange);
});

onUnmounted(() => {
  // Cleanup si es necesario
});
</script>


<template>
  <Layout>
    <div class="max-w-7xl mx-auto">
      <DashboardWelcome 
        :usuario="usuario?.usuario" 
        :rol-nombre="rolNombre" 
      />

      <DashboardStatsGrid :is-cliente="isCliente">
        <DashboardStatsCard
          v-if="isAdmin"
          label="Total Clientes"
          :value="stats.totalClientes"
          :loading="loading"
          :icon-component="ClientesIcon"
          icon-bg-class="bg-gradient-to-br from-blue-500 to-blue-600"
          link-class="text-blue-600 hover:text-blue-700"
          to="/clientes"
        />

        <DashboardStatsCard
          label="Total Cuentas"
          :value="stats.totalCuentas"
          :loading="loading"
          :icon-component="CuentasIcon"
          icon-bg-class="bg-gradient-to-br from-green-500 to-green-600"
          link-class="text-green-600 hover:text-green-700"
          to="/cuentas"
        />

        <DashboardStatsCard
          label="Transacciones Hoy"
          :value="stats.transaccionesHoy"
          :loading="loading"
          :icon-component="TransaccionesIcon"
          icon-bg-class="bg-gradient-to-br from-purple-500 to-purple-600"
          link-class="text-purple-600 hover:text-purple-700"
          to="/transacciones"
        />
      </DashboardStatsGrid>

      <DashboardQuickActionsGrid :is-cliente="isCliente">
        <DashboardQuickActionCard
          v-if="isCliente"
          to="/cuentas"
          title="Mis Cuentas"
          description="Consultar mis cuentas bancarias"
          :icon-component="CuentasIcon"
          icon-bg-class="bg-gradient-to-br from-blue-500 to-blue-600"
          arrow-class="text-gray-400 group-hover:text-blue-600"
        />

        <DashboardQuickActionCard
          to="/transacciones"
          title="Realizar Transacción"
          description="Depósito, retiro o transferencia"
          :icon-component="TransaccionesIcon"
          icon-bg-class="bg-gradient-to-br from-purple-500 to-purple-600"
          arrow-class="text-gray-400 group-hover:text-purple-600"
        />

        <DashboardQuickActionCard
          v-if="isCliente"
          to="/perfil"
          title="Mi Perfil"
          description="Ver y editar mi información"
          :icon-component="PerfilIcon"
          icon-bg-class="bg-gradient-to-br from-indigo-500 to-indigo-600"
          arrow-class="text-gray-400 group-hover:text-indigo-600"
        />

        <DashboardQuickActionCard
          v-if="isAdmin"
          to="/cuentas"
          title="Nueva Cuenta"
          description="Crear nueva cuenta bancaria"
          :icon-component="NuevaCuentaIcon"
          icon-bg-class="bg-gradient-to-br from-green-500 to-green-600"
          arrow-class="text-gray-400 group-hover:text-green-600"
        />
      </DashboardQuickActionsGrid>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Layout from '../components/Layout.vue';
import DashboardWelcome from '../components/dashboard/DashboardWelcome.vue';
import DashboardStatsGrid from '../components/dashboard/DashboardStatsGrid.vue';
import DashboardStatsCard from '../components/dashboard/DashboardStatsCard.vue';
import DashboardQuickActionsGrid from '../components/dashboard/DashboardQuickActionsGrid.vue';
import DashboardQuickActionCard from '../components/dashboard/DashboardQuickActionCard.vue';
import ClientesIcon from '../components/dashboard/icons/ClientesIcon.vue';
import CuentasIcon from '../components/dashboard/icons/CuentasIcon.vue';
import TransaccionesIcon from '../components/dashboard/icons/TransaccionesIcon.vue';
import PerfilIcon from '../components/dashboard/icons/PerfilIcon.vue';
import NuevaCuentaIcon from '../components/dashboard/icons/NuevaCuentaIcon.vue';
import { useAuth } from '../composables/useAuth';
import { clienteService } from '../services/clienteService';
import { cuentaService } from '../services/cuentaService';
import { transactionService } from '../services/transactionService';
import { useToast } from '../composables/useToast';

const { usuario, rolNombre, isAdmin, isCliente } = useAuth();
const { error: showError } = useToast();

const loading = ref(false);
const stats = ref({
  totalClientes: null as number | null,
  totalCuentas: null as number | null,
  transaccionesHoy: null as number | null,
});

const loadStats = async () => {
  loading.value = true;
  try {
    if (isAdmin.value) {
      const clientes = await clienteService.listAll();
      stats.value.totalClientes = clientes.length;
    }

    if (isCliente.value && usuario.value?.clienteId) {
      const cuentas = await cuentaService.listByCliente(Number(usuario.value.clienteId));
      stats.value.totalCuentas = cuentas.length;
    } else if (isAdmin.value) {
      const cuentas = await cuentaService.listAll();
      stats.value.totalCuentas = cuentas.length;
    }

    if (usuario.value?.usuarioId) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const hoyStr = hoy.toISOString().split('T')[0];
      
      const transacciones = await transactionService.listarHistorialUsuario(
        usuario.value.usuarioId,
        hoyStr,
        hoyStr
      );
      stats.value.transaccionesHoy = transacciones.length;
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
    showError(errorMessage);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadStats();
});
</script>

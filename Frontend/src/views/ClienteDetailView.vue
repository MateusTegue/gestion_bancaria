<template>
  <Layout>
    <div class="px-4 py-6 max-w-4xl mx-auto">
      <div class="mb-6">
        <RouterLink to="/clientes" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Volver a Clientes
        </RouterLink>
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-gray-900">Detalle del Cliente</h1>
          <RouterLink :to="`/clientes/${clienteId}/editar`">
            <Button variant="primary">Editar</Button>
          </RouterLink>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando cliente...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <template v-else-if="cliente">
        <ClienteDetailCard :cliente="cliente" class="mb-6" />

        <div class="bg-white shadow-md rounded-lg p-6">
          <ClienteCuentasTable
            :cuentas="cuentas"
            :loading="loadingCuentas"
            @consultar-saldo="handleConsultarSaldo"
            @cambiar-estado="handleCambiarEstado"
          >
            <template #actions>
              <RouterLink :to="`/cuentas?clienteId=${clienteId}`">
                <Button variant="primary">Nueva Cuenta</Button>
              </RouterLink>
            </template>
          </ClienteCuentasTable>
        </div>
      </template>

      <SaldoModal
        :show="showSaldoModal"
        :saldo="saldoActual"
        @close="showSaldoModal = false"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import Layout from '../components/Layout.vue';
import Button from '../components/Button.vue';
import ClienteDetailCard from '../components/cliente/ClienteDetailCard.vue';
import ClienteCuentasTable from '../components/cliente/ClienteCuentasTable.vue';
import SaldoModal from './cliente/SaldoModal.vue';
import { useClienteDetail } from './cliente/useClienteDetail';

const {
  clienteId,
  cliente,
  cuentas,
  loading,
  loadingCuentas,
  error,
  showSaldoModal,
  saldoActual,
  loadCliente,
  handleConsultarSaldo,
  handleCambiarEstado,
} = useClienteDetail();

onMounted(() => {
  loadCliente();
});
</script>

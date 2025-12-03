<template>
  <Layout>
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Cuentas</h1>
        <Button variant="primary" @click="showCreateModal = true">
          <svg
            class="w-5 h-5 inline mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nueva Cuenta
        </Button>
      </div>

      <CuentaFilter
        :initial-value="clienteIdFilter"
        @filter="handleFilter"
        @clear="handleClearFilter"
      />

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando cuentas...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <CuentasTable
        v-else
        :cuentas="cuentas"
        @consultar-saldo="handleConsultarSaldo"
        @cambiar-estado="handleCambiarEstado"
      />

      <CreateCuentaModal
        :show="showCreateModal"
        :initial-cliente-id="initialClienteId"
        :submitting="creating"
        @close="showCreateModal = false"
        @confirm="handleCreateCuenta"
      />

      <SaldoModal
        :show="showSaldoModal"
        :saldo="saldoActual"
        @close="showSaldoModal = false"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Layout from '../components/Layout.vue';
import Button from '../components/Button.vue';
import CuentaFilter from './cuentas/CuentaFilter.vue';
import CuentasTable from './cuentas/CuentasTable.vue';
import CreateCuentaModal from './cuentas/CreateCuentaModal.vue';
import SaldoModal from './cuentas/SaldoModal.vue';
import { cuentaService } from '../services/cuentaService';
import { useToast } from '../composables/useToast';
import type { Cuenta } from '../types';

const route = useRoute();
const { success, error: showError, info } = useToast();

const cuentas = ref<Cuenta[]>([]);
const loading = ref(false);
const error = ref('');
const clienteIdFilter = ref('');
const showCreateModal = ref(false);
const showSaldoModal = ref(false);
const saldoActual = ref<number | null>(null);
const creating = ref(false);

const initialClienteId = computed(() => Number(route.query.clienteId) || 0);

const loadCuentas = async (clienteId?: number) => {
  loading.value = true;
  error.value = '';
  try {
    if (clienteId) {
      cuentas.value = await cuentaService.listByCliente(clienteId);
    } else {
      error.value = 'Por favor, filtre por ID de cliente para ver las cuentas';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar cuentas';
    cuentas.value = [];
  } finally {
    loading.value = false;
  }
};

const handleFilter = (clienteId: number) => {
  clienteIdFilter.value = String(clienteId);
  loadCuentas(clienteId);
};

const handleClearFilter = () => {
  clienteIdFilter.value = '';
  cuentas.value = [];
  error.value = '';
};

const handleCreateCuenta = async (data: Omit<Cuenta, 'id'>) => {
  creating.value = true;
  error.value = '';

  try {
    await cuentaService.create(data);
    success('Cuenta creada exitosamente');
    showCreateModal.value = false;
    if (clienteIdFilter.value) {
      await loadCuentas(Number(clienteIdFilter.value));
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al crear cuenta';
    error.value = errorMessage;
    showError(errorMessage);
  } finally {
    creating.value = false;
  }
};

const handleConsultarSaldo = async (cuentaId: number) => {
  try {
    saldoActual.value = await cuentaService.consultarSaldo(cuentaId);
    showSaldoModal.value = true;
    info('Saldo consultado correctamente');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al consultar saldo';
    error.value = errorMessage;
    showError(errorMessage);
  }
};

const handleCambiarEstado = async (cuenta: Cuenta) => {
  if (!cuenta.id) return;

  const nuevoEstado = cuenta.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
  try {
    await cuentaService.changeEstado(cuenta.id, nuevoEstado);
    success(`Estado de cuenta cambiado a ${nuevoEstado}`);
    if (clienteIdFilter.value) {
      await loadCuentas(Number(clienteIdFilter.value));
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
    error.value = errorMessage;
    showError(errorMessage);
  }
};

onMounted(() => {
  const clienteId = route.query.clienteId;
  if (clienteId) {
    clienteIdFilter.value = String(clienteId);
    loadCuentas(Number(clienteId));
  }
});
</script>


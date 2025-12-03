<template>
  <Layout>
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Cuentas</h1>
        <div class="flex gap-2">
          <Button 
            v-if="isAdmin" 
            variant="secondary" 
            @click="handleListAll"
            :disabled="loading"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Listar Todas
          </Button>
          <Button 
            v-if="isAdmin" 
            variant="primary" 
            @click="showCreateModal = true"
          >
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
      </div>

      <CuentaFilter
        v-if="!isCliente"
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
        :can-change-state="isAdmin"
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
import { useAuth } from '../composables/useAuth';
import type { Cuenta } from '../types';

const route = useRoute();
const { success, error: showError, info } = useToast();
const { usuario, isAdmin, isCliente } = useAuth();

const cuentas = ref<Cuenta[]>([]);
const loading = ref(false);
const error = ref('');
const clienteIdFilter = ref('');
const showCreateModal = ref(false);
const showSaldoModal = ref(false);
const saldoActual = ref<number | null>(null);
const creating = ref(false);

const initialClienteId = computed(() => Number(route.query.clienteId) || 0);

// Obtener el clienteId del usuario autenticado si es CLIENTE
const clienteIdUsuario = computed(() => {
  if (isCliente.value && usuario.value?.clienteId) {
    // El clienteId puede venir como string o number desde el backend
    const clienteId = usuario.value.clienteId;
    // Si es string, intentar convertirlo a number
    if (typeof clienteId === 'string') {
      const numId = Number(clienteId);
      return isNaN(numId) ? null : numId;
    }
    return Number(clienteId);
  }
  return null;
});

const loadCuentas = async (clienteId?: number) => {
  loading.value = true;
  error.value = '';
  try {
    // Si es CLIENTE, usar su propio clienteId
    const idToUse = isCliente.value ? clienteIdUsuario.value : clienteId;
    
    if (idToUse) {
      cuentas.value = await cuentaService.listByCliente(idToUse);
    } else if (!isCliente.value) {
      error.value = 'Por favor, filtre por ID de cliente para ver las cuentas o use "Listar Todas"';
    } else {
      error.value = 'No se pudo obtener el ID de cliente';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar cuentas';
    cuentas.value = [];
  } finally {
    loading.value = false;
  }
};

const handleListAll = async () => {
  loading.value = true;
  error.value = '';
  clienteIdFilter.value = '';
  try {
    cuentas.value = await cuentaService.listAll();
    if (cuentas.value.length === 0) {
      error.value = 'No se encontraron cuentas';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar todas las cuentas';
    cuentas.value = [];
    showError(error.value);
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
  // Si es CLIENTE, recargar sus cuentas
  if (isCliente.value && clienteIdUsuario.value) {
    loadCuentas(clienteIdUsuario.value);
  }
};

const handleCreateCuenta = async (data: Omit<Cuenta, 'id'>) => {
  creating.value = true;
  error.value = '';

  try {
    await cuentaService.create(data);
    success('Cuenta creada exitosamente');
    showCreateModal.value = false;
    // Si hay un filtro activo, recargar con ese filtro, sino recargar todas
    if (clienteIdFilter.value) {
      await loadCuentas(Number(clienteIdFilter.value));
    } else {
      await handleListAll();
    }
  } catch (err: any) {
    let errorMessage = 'Error al crear cuenta';
    if (err.response && err.response.data) {
      errorMessage = err.response.data.message || err.response.data.error || errorMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    // Limpiar mensajes de error de Oracle que contengan trazas técnicas
    if (errorMessage.includes('ORA-') || errorMessage.includes('ORA-06512')) {
      const lines = errorMessage.split('\n');
      const usefulLines = lines.filter(line =>
        !line.includes('ORA-06512') &&
        !line.includes('Help:') &&
        !line.trim().startsWith('ORA-') &&
        line.trim().length > 0
      );
      if (usefulLines.length > 0) {
        errorMessage = usefulLines[0].trim();
      }
    }
    error.value = errorMessage;
    showError(errorMessage);
  } finally {
    creating.value = false;
  }
};

const handleConsultarSaldo = async (cuentaId: number | string) => {
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

  // Cambiar entre Activo e Inactivo
  const nuevoEstado = cuenta.estado === 'Activo' ? 'Inactivo' : 'Activo';
  try {
    await cuentaService.changeEstado(cuenta.id, nuevoEstado);
    success(`Estado de cuenta cambiado a ${nuevoEstado}`);
    // Recargar según el contexto actual
    if (clienteIdFilter.value) {
      await loadCuentas(Number(clienteIdFilter.value));
    } else if (isAdmin.value) {
      await handleListAll();
    } else if (isCliente.value && clienteIdUsuario.value) {
      await loadCuentas(clienteIdUsuario.value);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado';
    error.value = errorMessage;
    showError(errorMessage);
  }
};

onMounted(() => {
  // Si es CLIENTE, cargar automáticamente sus cuentas
  if (isCliente.value && clienteIdUsuario.value) {
    loadCuentas(clienteIdUsuario.value);
  } else {
    // Si es ADMON o ANALISTA, usar el filtro de query params si existe
    const clienteId = route.query.clienteId;
    if (clienteId) {
      clienteIdFilter.value = String(clienteId);
      loadCuentas(Number(clienteId));
    }
  }
});
</script>


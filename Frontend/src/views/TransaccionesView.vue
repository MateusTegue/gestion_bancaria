<template>
  <Layout>
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Transacciones</h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Button variant="primary" @click="showDepositoModal = true" class="w-full">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Realizar Depósito
        </Button>
        <Button variant="danger" @click="showRetiroModal = true" class="w-full">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
          Realizar Retiro
        </Button>
        <Button variant="success" @click="showTransferenciaModal = true" class="w-full">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Realizar Transferencia
        </Button>
      </div>

      <!-- Historial del Usuario Autenticado -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Mi Historial de Transacciones</h2>
          <div class="flex items-center gap-2 items-end">
            <Input
              id="fechaInicioUsuario"
              v-model="historialUsuarioForm.fechaInicio"
              label="Fecha Inicio (Opcional)"
              type="date"
              class="w-40"
            />
            <Input
              id="fechaFinUsuario"
              v-model="historialUsuarioForm.fechaFin"
              label="Fecha Fin (Opcional)"
              type="date"
              class="w-40"
            />
            <Button 
              variant="primary" 
              @click="handleCargarHistorialUsuario" 
              :disabled="loadingHistorialUsuario"
              class="ml-2"
            >
              {{ loadingHistorialUsuario ? 'Cargando...' : 'Filtrar' }}
            </Button>
            <Button 
              variant="secondary" 
              @click="handleLimpiarFiltros" 
              :disabled="loadingHistorialUsuario"
              class="ml-2"
            >
              Ver Todas
            </Button>
          </div>
        </div>
      </div>

      <!-- Consultar Historial por Cuenta (Solo para ADMON y ANALISTA) -->
      <div v-if="isAdmin || isAnalista" class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Consultar Historial por Cuenta</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
          <Input
            id="historialCuentaId"
            v-model="historialForm.cuentaId"
            label="ID de Cuenta"
            type="text"
            required
          />
          <Input
            id="fechaInicio"
            v-model="historialForm.fechaInicio"
            label="Fecha Inicio"
            type="date"
            required
          />
          <Input
            id="fechaFin"
            v-model="historialForm.fechaFin"
            label="Fecha Fin"
            type="date"
            required
          />
          <div class="flex items-end">
            <Button variant="primary" @click="handleConsultarHistorial" :disabled="loadingHistorial" class="w-full">
              {{ loadingHistorial ? 'Consultando...' : 'Consultar' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Tabla de Historial del Usuario -->
      <div v-if="loadingHistorialUsuario" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando historial...</p>
      </div>

      <div v-else-if="historialUsuario.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Mis Transacciones</h3>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Transacción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuenta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaccion in paginatedHistorialUsuario" :key="transaccion.transaccionId">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaccion.transaccionId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaccion.cuentaId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="{
                    'bg-green-100 text-green-800': transaccion.tipoTransaccion === 'Ingreso',
                    'bg-red-100 text-red-800': transaccion.tipoTransaccion === 'Retiro',
                  }"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ transaccion.tipoTransaccion }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ transaccion.monto.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaccion.fechaTransaccion) }}
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination
          v-if="historialUsuario.length > itemsPerPageUsuario"
          :current-page="currentPageUsuario"
          :items-per-page="itemsPerPageUsuario"
          :total-items="historialUsuario.length"
          @page-change="currentPageUsuario = $event"
        />
      </div>

      <div v-else-if="historialUsuarioConsultado && historialUsuario.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
        <p class="text-yellow-800">No se encontraron transacciones</p>
      </div>

      <!-- Tabla de Historial por Cuenta (Solo para ADMON y ANALISTA) -->
      <div v-if="isAdmin || isAnalista">
        <div v-if="loadingHistorial" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Cargando historial...</p>
        </div>

        <div v-else-if="historialError" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p class="text-red-800">{{ historialError }}</p>
        </div>

        <div v-else-if="historial.length > 0" class="bg-white rounded-lg shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Transacción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuenta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaccion in paginatedHistorial" :key="transaccion.transaccionId">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaccion.transaccionId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaccion.cuentaId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="{
                    'bg-green-100 text-green-800': transaccion.tipoTransaccion === 'Ingreso',
                    'bg-red-100 text-red-800': transaccion.tipoTransaccion === 'Retiro',
                  }"
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ transaccion.tipoTransaccion }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ transaccion.monto.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaccion.fechaTransaccion) }}
              </td>
            </tr>
          </tbody>
        </table>
        <Pagination
          v-if="historial.length > itemsPerPageHistorial"
          :current-page="currentPageHistorial"
          :items-per-page="itemsPerPageHistorial"
          :total-items="historial.length"
          @page-change="currentPageHistorial = $event"
        />
      </div>

        <div v-else-if="historialConsultado && historial.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p class="text-yellow-800">No se encontraron transacciones en el rango de fechas especificado</p>
        </div>
      </div>

      <DepositoModal
        :show="showDepositoModal"
        :submitting="submitting"
        @close="showDepositoModal = false"
        @confirm="handleDeposito"
      />

      <RetiroModal
        :show="showRetiroModal"
        :submitting="submitting"
        @close="showRetiroModal = false"
        @confirm="handleRetiro"
      />

      <TransferenciaModal
        :show="showTransferenciaModal"
        :submitting="submitting"
        @close="showTransferenciaModal = false"
        @confirm="handleTransferencia"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import Layout from '../components/Layout.vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import DepositoModal from './transacciones/DepositoModal.vue';
import RetiroModal from './transacciones/RetiroModal.vue';
import TransferenciaModal from './transacciones/TransferenciaModal.vue';
import { transactionService } from '../services/transactionService';
import { useToast } from '../composables/useToast';
import { useAuth } from '../composables/useAuth';
import Pagination from '../components/Pagination.vue';
import type { HistorialTransaccion } from '../types';

const { success, error: showError } = useToast();
const { usuario, isAdmin, isAnalista } = useAuth();

const showDepositoModal = ref(false);
const showRetiroModal = ref(false);
const showTransferenciaModal = ref(false);
const submitting = ref(false);
const loadingHistorial = ref(false);
const loadingHistorialUsuario = ref(false);
const historialError = ref('');
const historial = ref<HistorialTransaccion[]>([]);
const historialUsuario = ref<HistorialTransaccion[]>([]);
const historialConsultado = ref(false);
const historialUsuarioConsultado = ref(false);

const currentPageUsuario = ref(1);
const itemsPerPageUsuario = ref(10);

const currentPageHistorial = ref(1);
const itemsPerPageHistorial = ref(10);

const historialForm = ref({
  cuentaId: '',
  fechaInicio: '',
  fechaFin: '',
});

const historialUsuarioForm = ref({
  fechaInicio: '',
  fechaFin: '',
});

const getUsuarioId = (): number => {
  const usuarioStr = localStorage.getItem('usuario');
  if (usuarioStr) {
    const usuario = JSON.parse(usuarioStr);
    return usuario.usuarioId || 1;
  }
  return 1;
};

const handleDeposito = async (data: { cuentaId: string; monto: number }) => {
  submitting.value = true;
  try {
    const result = await transactionService.realizarDeposito(data.cuentaId, data.monto, getUsuarioId());
    success(`Depósito de $${data.monto.toLocaleString()} realizado exitosamente. Saldo actualizado: $${result.saldoActualizado.toLocaleString()}`);
    showDepositoModal.value = false;
  } catch (err: any) {
    let errorMessage = 'Error al realizar depósito';
    
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
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
    
    showError(errorMessage);
  } finally {
    submitting.value = false;
  }
};

const handleRetiro = async (data: { cuentaId: string; monto: number }) => {
  submitting.value = true;
  try {
    const result = await transactionService.realizarRetiro(data.cuentaId, data.monto, getUsuarioId());
    success(`Retiro de $${data.monto.toLocaleString()} realizado exitosamente. Saldo actualizado: $${result.saldoActualizado.toLocaleString()}`);
    showRetiroModal.value = false;
  } catch (err: any) {
    let errorMessage = 'Error al realizar retiro';
    
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
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
      } else if (errorMessage.includes('Fondos insuficientes')) {
        const match = errorMessage.match(/Fondos insuficientes[^ORA]*/i);
        if (match) {
          errorMessage = match[0].trim();
        }
      }
    }
    
    showError(errorMessage);
  } finally {
    submitting.value = false;
  }
};

const handleTransferencia = async (data: { cuentaOrigen: string; cuentaDestino: string; monto: number }) => {
  submitting.value = true;
  try {
    const result = await transactionService.realizarTransferencia(
      data.cuentaOrigen,
      data.cuentaDestino,
      data.monto,
      getUsuarioId()
    );
    success(
      `Transferencia de $${data.monto.toLocaleString()} realizada exitosamente. ` +
      `Saldo origen: $${result.saldoOrigen.toLocaleString()}, ` +
      `Saldo destino: $${result.saldoDestino.toLocaleString()}`
    );
    showTransferenciaModal.value = false;
  } catch (err: any) {
    let errorMessage = 'Error al realizar transferencia';
    
    if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
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
      } else if (errorMessage.includes('Fondos insuficientes')) {
        const match = errorMessage.match(/Fondos insuficientes[^ORA]*/i);
        if (match) {
          errorMessage = match[0].trim();
        }
      }
    }
    
    showError(errorMessage);
  } finally {
    submitting.value = false;
  }
};

const handleConsultarHistorial = async () => {
  if (!historialForm.value.cuentaId || !historialForm.value.fechaInicio || !historialForm.value.fechaFin) {
    showError('Todos los campos son requeridos');
    return;
  }

  loadingHistorial.value = true;
  historialError.value = '';
  historialConsultado.value = false;
  currentPageHistorial.value = 1;

  try {
    const transacciones = await transactionService.generarHistorial(
      historialForm.value.cuentaId,
      historialForm.value.fechaInicio,
      historialForm.value.fechaFin
    );
    historial.value = transacciones;
    historialConsultado.value = true;
    if (transacciones.length > 0) {
      success(`Se encontraron ${transacciones.length} transacción(es)`);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al consultar historial';
    historialError.value = errorMessage;
    historial.value = [];
    showError(errorMessage);
  } finally {
    loadingHistorial.value = false;
  }
};

const handleCargarHistorialUsuario = async () => {
  if (!usuario.value?.usuarioId) {
    showError('Usuario no autenticado');
    return;
  }

  loadingHistorialUsuario.value = true;
  historialUsuarioConsultado.value = false;
  currentPageUsuario.value = 1;

  try {
    const fechaInicio = historialUsuarioForm.value.fechaInicio || undefined;
    const fechaFin = historialUsuarioForm.value.fechaFin || undefined;
    
    const transacciones = await transactionService.listarHistorialUsuario(
      usuario.value.usuarioId,
      fechaInicio,
      fechaFin
    );
    historialUsuario.value = transacciones;
    historialUsuarioConsultado.value = true;
    if (transacciones.length > 0) {
      success(`Se encontraron ${transacciones.length} transacción(es)`);
    } else {
      success('No se encontraron transacciones');
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al cargar historial';
    historialUsuario.value = [];
    showError(errorMessage);
  } finally {
    loadingHistorialUsuario.value = false;
  }
};

const handleLimpiarFiltros = () => {
  historialUsuarioForm.value.fechaInicio = '';
  historialUsuarioForm.value.fechaFin = '';
  handleCargarHistorialUsuario();
};

const paginatedHistorialUsuario = computed(() => {
  const start = (currentPageUsuario.value - 1) * itemsPerPageUsuario.value;
  const end = start + itemsPerPageUsuario.value;
  return historialUsuario.value.slice(start, end);
});

const paginatedHistorial = computed(() => {
  const start = (currentPageHistorial.value - 1) * itemsPerPageHistorial.value;
  const end = start + itemsPerPageHistorial.value;
  return historial.value.slice(start, end);
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(() => {
  if (usuario.value?.usuarioId) {
    handleCargarHistorialUsuario();
  }
});
</script>


import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { clienteService } from '../../services/clienteService';
import { cuentaService } from '../../services/cuentaService';
import type { Cliente, Cuenta } from '../../types';

export const useClienteDetail = () => {
  const route = useRoute();
  const clienteId = computed(() => Number(route.params.id));

  const cliente = ref<Cliente | null>(null);
  const cuentas = ref<Cuenta[]>([]);
  const loading = ref(false);
  const loadingCuentas = ref(false);
  const error = ref('');
  const showSaldoModal = ref(false);
  const saldoActual = ref<number | null>(null);

  const loadCliente = async () => {
    loading.value = true;
    error.value = '';
    try {
      cliente.value = await clienteService.getById(clienteId.value);
      await loadCuentas();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar cliente';
    } finally {
      loading.value = false;
    }
  };

  const loadCuentas = async () => {
    loadingCuentas.value = true;
    try {
      cuentas.value = await cuentaService.listByCliente(clienteId.value);
    } catch (err) {
      console.error('Error al cargar cuentas:', err);
    } finally {
      loadingCuentas.value = false;
    }
  };

  const handleConsultarSaldo = async (cuentaId: number) => {
    try {
      saldoActual.value = await cuentaService.consultarSaldo(cuentaId);
      showSaldoModal.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al consultar saldo';
    }
  };

  const handleCambiarEstado = async (cuenta: Cuenta) => {
    if (!cuenta.id) return;

    const nuevoEstado = cuenta.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    try {
      await cuentaService.changeEstado(cuenta.id, nuevoEstado);
      await loadCuentas();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cambiar estado';
    }
  };

  return {
    clienteId,
    cliente,
    cuentas,
    loading,
    loadingCuentas,
    error,
    showSaldoModal,
    saldoActual,
    loadCliente,
    loadCuentas,
    handleConsultarSaldo,
    handleCambiarEstado,
  };
};


import { ref } from 'vue';
import { clienteService } from '../../services/clienteService';
import type { Cliente } from '../../types';

export const useClientesList = () => {
  const clientes = ref<Cliente[]>([]);
  const loading = ref(false);
  const error = ref('');
  const searchTerm = ref('');
  const showDeleteModal = ref(false);
  const clienteToDelete = ref<Cliente | null>(null);
  const deleting = ref(false);

  const loadClientes = async () => {
    loading.value = true;
    error.value = '';
    try {
      clientes.value = await clienteService.listAll();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar clientes';
    } finally {
      loading.value = false;
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      await loadClientes();
      return;
    }

    loading.value = true;
    error.value = '';
    try {
      const cliente = await clienteService.searchByIdentificacion(value);
      if (cliente) {
        clientes.value = [cliente];
      } else {
        clientes.value = [];
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al buscar cliente';
      clientes.value = [];
    } finally {
      loading.value = false;
    }
  };

  const handleDeleteClick = (cliente: Cliente) => {
    clienteToDelete.value = cliente;
    showDeleteModal.value = true;
  };

  const handleDeleteConfirm = async () => {
    if (!clienteToDelete.value?.id) return;

    deleting.value = true;
    try {
      await clienteService.delete(clienteToDelete.value.id);
      await loadClientes();
      showDeleteModal.value = false;
      clienteToDelete.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar cliente';
    } finally {
      deleting.value = false;
    }
  };

  return {
    clientes,
    loading,
    error,
    searchTerm,
    showDeleteModal,
    clienteToDelete,
    deleting,
    loadClientes,
    handleSearch,
    handleDeleteClick,
    handleDeleteConfirm,
  };
};


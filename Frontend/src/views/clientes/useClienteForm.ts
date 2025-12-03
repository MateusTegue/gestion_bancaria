import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clienteService } from '../../services/clienteService';
import { useToast } from '../../composables/useToast';
import type { ClienteFormData } from '../../types';

export const useClienteForm = () => {
  const route = useRoute();
  const router = useRouter();
  const { success, error: showError } = useToast();

  const isEdit = computed(() => !!route.params.id);
  const clienteId = computed(() => (route.params.id as string) || '');

  const formData = ref<ClienteFormData>({
    identificacion: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    direccion: '',
  });

  const loading = ref(false);
  const submitting = ref(false);

  const loadCliente = async () => {
    if (!isEdit.value) return;

    loading.value = true;
    try {
      const cliente = await clienteService.getByIdForForm(Number(clienteId.value));
      formData.value = {
        identificacion: String(cliente.identificacion || ''),
        primerNombre: cliente.primerNombre || '',
        segundoNombre: cliente.segundoNombre || '',
        primerApellido: cliente.primerApellido || '',
        segundoApellido: cliente.segundoApellido || '',
        direccion: cliente.direccion || '',
      };
    } catch (err) {
    } finally {
      loading.value = false;
    }
  };

  const handleCreate = async (data: ClienteFormData) => {
    submitting.value = true;
    try {
      await clienteService.create(data);
      success('Cliente creado exitosamente');
      router.push('/clientes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear cliente';
      showError(errorMessage);
    } finally {
      submitting.value = false;
    }
  };

  const handleUpdate = async (data: ClienteFormData) => {
    submitting.value = true;
    try {
      await clienteService.update(Number(clienteId.value), data);
      success('Cliente actualizado exitosamente');
      router.push('/clientes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar cliente';
      showError(errorMessage);
    } finally {
      submitting.value = false;
    }
  };

  const handleCancel = () => {
    router.push('/clientes');
  };

  return {
    isEdit,
    clienteId,
    formData,
    loading,
    submitting,
    loadCliente,
    handleCreate,
    handleUpdate,
    handleCancel,
  };
};


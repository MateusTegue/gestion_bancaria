import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { clienteService } from '../../services/clienteService';
import type { ClienteFormData } from '../../types';

export const useClienteForm = () => {
  const route = useRoute();
  const router = useRouter();

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
      console.error('Error al cargar cliente:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleCreate = async (data: ClienteFormData) => {
    submitting.value = true;
    try {
      await clienteService.create(data);
      router.push('/clientes');
    } catch (err) {
      console.error('Error al crear cliente:', err);
    } finally {
      submitting.value = false;
    }
  };

  const handleUpdate = async (data: ClienteFormData) => {
    submitting.value = true;
    try {
      await clienteService.update(Number(clienteId.value), data);
      router.push('/clientes');
    } catch (err) {
      console.error('Error al actualizar cliente:', err);
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


<template>
  <Modal
    :show="show"
    title="Nueva Cuenta"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <div class="mb-4">
      <label for="clienteId" class="block text-sm font-medium text-gray-700 mb-1">
        Cliente <span class="text-red-500">*</span>
      </label>
      <div v-if="loadingClientes" class="text-sm text-gray-500">
        Cargando clientes...
      </div>
      <select
        v-else
        id="clienteId"
        v-model="formData.clienteId"
        :class="[
          'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
          errors.clienteId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'
        ]"
        required
      >
        <option value="">Seleccione un cliente</option>
        <option
          v-for="cliente in clientes"
          :key="cliente.id"
          :value="cliente.id"
        >
          {{ cliente.id }} - {{ cliente.nombre }} {{ cliente.apellido }} ({{ cliente.identificacion }})
        </option>
      </select>
      <p v-if="errors.clienteId" class="mt-1 text-sm text-red-600">{{ errors.clienteId }}</p>
      <p v-if="errorClientes" class="mt-1 text-sm text-red-600">{{ errorClientes }}</p>
    </div>
    <Input
      id="numeroCuenta"
      v-model="formData.numeroCuenta"
      label="Número de Cuenta"
      required
      :error="errors.numeroCuenta"
    />
    <div class="mb-4">
      <label for="tipoCuenta" class="block text-sm font-medium text-gray-700 mb-1">
        Tipo de Cuenta
      </label>
      <select
        id="tipoCuenta"
        v-model="formData.tipoCuenta"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Seleccione un tipo</option>
        <option value="Ahorro">Ahorro</option>
        <option value="Corriente">Corriente</option>
      </select>
      <p v-if="errors.tipoCuenta" class="mt-1 text-sm text-red-600">{{ errors.tipoCuenta }}</p>
    </div>
    <template #footer>
      <Button
        variant="primary"
        class="w-full sm:w-auto sm:ml-3"
        :disabled="submitting"
        @click="handleConfirm"
      >
        {{ submitting ? 'Creando...' : 'Crear' }}
      </Button>
      <Button
        variant="secondary"
        class="mt-3 w-full sm:mt-0 sm:w-auto"
        @click="handleClose"
      >
        Cancelar
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Modal from '../../components/Modal.vue';
import Button from '../../components/Button.vue';
import Input from '../../components/Input.vue';
import { clienteService } from '../../services/clienteService';
import type { Cuenta, Cliente } from '../../types';

interface Props {
  show: boolean;
  initialClienteId?: number;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
  initialClienteId: 0,
});

const emit = defineEmits<{
  close: [];
  confirm: [data: Omit<Cuenta, 'id'>];
}>();

const formData = ref<Omit<Cuenta, 'id'>>({
  clienteId: props.initialClienteId,
  numeroCuenta: '',
  tipoCuenta: '',
  saldo: 0, // Valor por defecto, no se muestra en el formulario
  estado: 'Activo',
});

const errors = ref<Partial<Record<keyof Cuenta, string>>>({});
const clientes = ref<Cliente[]>([]);
const loadingClientes = ref(false);
const errorClientes = ref('');

const loadClientes = async () => {
  if (clientes.value.length > 0) return; // Ya están cargados
  
  loadingClientes.value = true;
  errorClientes.value = '';
  try {
    clientes.value = await clienteService.listAll();
  } catch (err) {
    errorClientes.value = err instanceof Error ? err.message : 'Error al cargar clientes';
    clientes.value = [];
  } finally {
    loadingClientes.value = false;
  }
};

watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = {
      clienteId: props.initialClienteId,
      numeroCuenta: '',
      tipoCuenta: '',
      saldo: 0, // Valor por defecto
      estado: 'Activo',
    };
    errors.value = {};
    // Cargar clientes cuando se abre el modal
    loadClientes();
  }
});

onMounted(() => {
  // Cargar clientes al montar el componente
  if (props.show) {
    loadClientes();
  }
});

watch(() => props.initialClienteId, (newValue) => {
  formData.value.clienteId = newValue;
});

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.clienteId || formData.value.clienteId <= 0) {
    errors.value.clienteId = 'El ID del cliente es requerido';
  }

  if (!formData.value.numeroCuenta?.trim()) {
    errors.value.numeroCuenta = 'El número de cuenta es requerido';
  }

  return Object.keys(errors.value).length === 0;
};

const handleConfirm = () => {
  if (!validateForm()) return;
  emit('confirm', {
    ...formData.value,
    clienteId: Number(formData.value.clienteId),
    saldo: Number(formData.value.saldo) || 0,
  });
};

const handleClose = () => {
  emit('close');
};
</script>


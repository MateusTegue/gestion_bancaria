<template>
  <Modal
    :show="show"
    title="Realizar Transferencia"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <Input
      id="cuentaOrigen"
      v-model="formData.cuentaOrigen"
      label="ID de Cuenta Origen"
      type="text"
      required
      :error="errors.cuentaOrigen"
    />
    <Input
      id="cuentaDestino"
      v-model="formData.cuentaDestino"
      label="ID de Cuenta Destino"
      type="text"
      required
      :error="errors.cuentaDestino"
    />
    <Input
      id="monto"
      v-model="formData.monto"
      label="Monto"
      type="number"
      step="0.01"
      min="0.01"
      required
      :error="errors.monto"
    />
    <template #footer>
      <Button
        variant="success"
        class="w-full sm:w-auto sm:ml-3"
        :disabled="submitting"
        @click="handleConfirm"
      >
        {{ submitting ? 'Procesando...' : 'Realizar Transferencia' }}
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
import { ref, watch } from 'vue';
import Modal from '../../components/Modal.vue';
import Button from '../../components/Button.vue';
import Input from '../../components/Input.vue';

interface Props {
  show: boolean;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
});

const emit = defineEmits<{
  close: [];
  confirm: [data: { cuentaOrigen: string; cuentaDestino: string; monto: number }];
}>();

const formData = ref({
  cuentaOrigen: '',
  cuentaDestino: '',
  monto: '',
});

const errors = ref<{ cuentaOrigen?: string; cuentaDestino?: string; monto?: string }>({});

watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = {
      cuentaOrigen: '',
      cuentaDestino: '',
      monto: '',
    };
    errors.value = {};
  }
});

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.cuentaOrigen?.trim()) {
    errors.value.cuentaOrigen = 'El ID de cuenta origen es requerido';
  }

  if (!formData.value.cuentaDestino?.trim()) {
    errors.value.cuentaDestino = 'El ID de cuenta destino es requerido';
  }

  if (formData.value.cuentaOrigen === formData.value.cuentaDestino) {
    errors.value.cuentaDestino = 'La cuenta origen y destino no pueden ser la misma';
  }

  const monto = parseFloat(formData.value.monto);
  if (!formData.value.monto || isNaN(monto) || monto <= 0) {
    errors.value.monto = 'El monto debe ser mayor a 0';
  }

  return Object.keys(errors.value).length === 0;
};

const handleConfirm = () => {
  if (!validateForm()) return;
  emit('confirm', {
    cuentaOrigen: formData.value.cuentaOrigen.trim(),
    cuentaDestino: formData.value.cuentaDestino.trim(),
    monto: parseFloat(formData.value.monto),
  });
};

const handleClose = () => {
  emit('close');
};
</script>


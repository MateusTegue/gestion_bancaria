<template>
  <Modal
    :show="show"
    title="Realizar Depósito"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <Input
      id="cuentaId"
      v-model="formData.cuentaId"
      label="ID de Cuenta"
      type="text"
      required
      :error="errors.cuentaId"
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
        variant="primary"
        class="w-full sm:w-auto sm:ml-3"
        :disabled="submitting"
        @click="handleConfirm"
      >
        {{ submitting ? 'Procesando...' : 'Realizar Depósito' }}
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
  confirm: [data: { cuentaId: string; monto: number }];
}>();

const formData = ref({
  cuentaId: '',
  monto: '',
});

const errors = ref<{ cuentaId?: string; monto?: string }>({});

watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = {
      cuentaId: '',
      monto: '',
    };
    errors.value = {};
  }
});

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.value.cuentaId?.trim()) {
    errors.value.cuentaId = 'El ID de cuenta es requerido';
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
    cuentaId: formData.value.cuentaId.trim(),
    monto: parseFloat(formData.value.monto),
  });
};

const handleClose = () => {
  emit('close');
};
</script>


<template>
  <Modal
    :show="show"
    title="Nueva Cuenta"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <Input
      id="clienteId"
      v-model="formData.clienteId"
      label="ID del Cliente"
      type="number"
      required
      :error="errors.clienteId"
    />
    <Input
      id="numeroCuenta"
      v-model="formData.numeroCuenta"
      label="Número de Cuenta"
      required
      :error="errors.numeroCuenta"
    />
    <Input
      id="tipoCuenta"
      v-model="formData.tipoCuenta"
      label="Tipo de Cuenta"
      placeholder="Ej: Ahorros, Corriente"
    />
    <Input
      id="saldo"
      v-model="formData.saldo"
      label="Saldo Inicial"
      type="number"
      :error="errors.saldo"
    />
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
import { ref, watch } from 'vue';
import Modal from '../../components/Modal.vue';
import Button from '../../components/Button.vue';
import Input from '../../components/Input.vue';
import type { Cuenta } from '../../types';

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
  saldo: 0,
  estado: 'ACTIVA',
});

const errors = ref<Partial<Record<keyof Cuenta, string>>>({});

watch(() => props.show, (newValue) => {
  if (newValue) {
    formData.value = {
      clienteId: props.initialClienteId,
      numeroCuenta: '',
      tipoCuenta: '',
      saldo: 0,
      estado: 'ACTIVA',
    };
    errors.value = {};
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

  if (formData.value.saldo === undefined || formData.value.saldo < 0) {
    errors.value.saldo = 'El saldo debe ser mayor o igual a 0';
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


<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <ClienteFormFields
      :form-data="form"
      :errors="errors"
    />

    <ClienteFormError :error="submitError" />

    <ClienteFormActions
      :submitting="submitting"
      :submit-label="submitLabel"
      @cancel="handleCancel"
    >
      <template #cancel>
        <slot name="cancel">
          <Button type="button" variant="secondary" @click="handleCancel">
            Cancelar
          </Button>
        </slot>
      </template>
    </ClienteFormActions>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '../Button.vue';
import ClienteFormFields from './ClienteFormFields.vue';
import ClienteFormError from './ClienteFormError.vue';
import ClienteFormActions from './ClienteFormActions.vue';
import type { ClienteFormData } from '../../types';

interface Props {
  initialData?: ClienteFormData;
  loading?: boolean;
  submitting?: boolean;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitting: false,
  submitLabel: 'Crear',
});

const emit = defineEmits<{
  submit: [data: ClienteFormData];
  cancel: [];
}>();

const form = ref<ClienteFormData>(
  props.initialData ? {
    identificacion: props.initialData.identificacion || '',
    primerNombre: props.initialData.primerNombre || '',
    segundoNombre: props.initialData.segundoNombre || '',
    primerApellido: props.initialData.primerApellido || '',
    segundoApellido: props.initialData.segundoApellido || '',
    direccion: props.initialData.direccion || '',
  } : {
    identificacion: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    direccion: '',
  }
);

const errors = ref<Partial<Record<keyof ClienteFormData, string>>>({});
const submitError = ref('');

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.identificacion.trim()) {
    errors.value.identificacion = 'La identificación es requerida';
  }

  if (!form.value.primerNombre.trim()) {
    errors.value.primerNombre = 'El primer nombre es requerido';
  }

  if (!form.value.primerApellido.trim()) {
    errors.value.primerApellido = 'El primer apellido es requerido';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  submitError.value = '';
  emit('submit', form.value as any);
};

const handleCancel = () => {
  emit('cancel');
};
</script>


<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <Input
      id="identificacion"
      v-model="form.identificacion"
      label="Identificación"
      placeholder="Ingrese la identificación"
      required
      :error="errors.identificacion"
    />

    <Input
      id="primerNombre"
      v-model="form.primerNombre"
      label="Primer Nombre"
      placeholder="Ingrese el primer nombre"
      required
      :error="errors.primerNombre"
    />

    <Input
      id="segundoNombre"
      v-model="form.segundoNombre"
      label="Segundo Nombre"
      placeholder="Ingrese el segundo nombre (opcional)"
      :error="errors.segundoNombre"
    />

    <Input
      id="primerApellido"
      v-model="form.primerApellido"
      label="Primer Apellido"
      placeholder="Ingrese el primer apellido"
      required
      :error="errors.primerApellido"
    />

    <Input
      id="segundoApellido"
      v-model="form.segundoApellido"
      label="Segundo Apellido"
      placeholder="Ingrese el segundo apellido (opcional)"
      :error="errors.segundoApellido"
    />

    <Input
      id="direccion"
      v-model="form.direccion"
      label="Dirección"
      placeholder="Ingrese la dirección"
      :error="errors.direccion"
    />

    <div v-if="submitError" class="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
      <p class="text-red-800">{{ submitError }}</p>
    </div>

    <div class="flex justify-end space-x-4">
      <slot name="cancel">
        <Button type="button" variant="secondary" @click="handleCancel">
          Cancelar
        </Button>
      </slot>
      <Button type="submit" :disabled="submitting">
        {{ submitting ? 'Guardando...' : submitLabel }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '../Input.vue';
import Button from '../Button.vue';
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


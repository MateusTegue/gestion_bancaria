<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="p-4 bg-blue-50 border border-blue-200 rounded-md">
      <p class="text-sm text-blue-800">
        Cambiando contraseña para: <strong>{{ usuario?.usuario }}</strong>
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Contraseña Actual <span class="text-red-500">*</span>
      </label>
      <Input
        v-model="form.passwordActual"
        type="password"
        placeholder="Ingrese la contraseña actual"
        :error="errors.passwordActual"
        required
      />
      <p v-if="errors.passwordActual" class="mt-1 text-sm text-red-600">{{ errors.passwordActual }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nueva Contraseña <span class="text-red-500">*</span>
      </label>
      <Input
        v-model="form.passwordNuevo"
        type="password"
        placeholder="Mínimo 6 caracteres"
        :error="errors.passwordNuevo"
        required
      />
      <p v-if="errors.passwordNuevo" class="mt-1 text-sm text-red-600">{{ errors.passwordNuevo }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Confirmar Nueva Contraseña <span class="text-red-500">*</span>
      </label>
      <Input
        v-model="form.passwordConfirm"
        type="password"
        placeholder="Confirme la nueva contraseña"
        :error="errors.passwordConfirm"
        required
      />
      <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-600">{{ errors.passwordConfirm }}</p>
    </div>

    <div v-if="submitError" class="p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-600">{{ submitError }}</p>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <Button type="button" variant="secondary" @click="handleCancel" :disabled="submitting">
        Cancelar
      </Button>
      <Button type="submit" variant="primary" :disabled="submitting">
        <span v-if="submitting" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cambiando...
        </span>
        <span v-else>Cambiar Contraseña</span>
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '../Button.vue';
import Input from '../Input.vue';
import type { Usuario } from '../../types';

interface Props {
  usuario: Usuario | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
});

const emit = defineEmits<{
  submit: [data: any];
  cancel: [];
}>();

const form = ref({
  passwordActual: '',
  passwordNuevo: '',
  passwordConfirm: '',
});

const errors = ref<Record<string, string>>({});
const submitError = ref('');

const validateForm = (): boolean => {
  errors.value = {};

  if (!form.value.passwordActual) {
    errors.value.passwordActual = 'La contraseña actual es requerida';
  }

  if (!form.value.passwordNuevo) {
    errors.value.passwordNuevo = 'La nueva contraseña es requerida';
  }

  if (form.value.passwordNuevo && form.value.passwordNuevo.length < 6) {
    errors.value.passwordNuevo = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (!form.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Debe confirmar la nueva contraseña';
  }

  if (form.value.passwordNuevo !== form.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Las contraseñas no coinciden';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm() || !props.usuario) return;
  submitError.value = '';

  const data = {
    usuarioId: props.usuario.usuarioId,
    passwordActual: form.value.passwordActual,
    passwordNuevo: form.value.passwordNuevo,
  };

  emit('submit', data);
};

const handleCancel = () => {
  emit('cancel');
};
</script>

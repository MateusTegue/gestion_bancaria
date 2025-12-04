<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div v-if="!isEditing">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        ID de Usuario <span class="text-red-500">*</span>
      </label>
      <Input
        v-model="form.usuarioId"
        type="number"
        placeholder="Ingrese el ID del usuario"
        :error="errors.usuarioId"
        required
      />
      <p v-if="errors.usuarioId" class="mt-1 text-sm text-red-600">{{ errors.usuarioId }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Nombre de Usuario <span class="text-red-500">*</span>
      </label>
      <Input
        v-model="form.usuario"
        type="text"
        placeholder="Ingrese el nombre de usuario"
        :error="errors.usuario"
        required
      />
      <p v-if="errors.usuario" class="mt-1 text-sm text-red-600">{{ errors.usuario }}</p>
    </div>

    <div v-if="!isEditing">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Contraseña <span class="text-red-500">*</span>
      </label>
      <Input
        v-model="form.password"
        type="password"
        placeholder="Mínimo 6 caracteres"
        :error="errors.password"
        required
      />
      <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Rol <span class="text-red-500">*</span>
      </label>
      <select
        v-model="form.rolId"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Seleccione un rol</option>
        <option value="1">Administrador</option>
        <option value="2">Analista</option>
        <option value="3">Cliente</option>
      </select>
      <p v-if="errors.rolId" class="mt-1 text-sm text-red-600">{{ errors.rolId }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        ID de Cliente (Opcional)
      </label>
      <Input
        v-model="form.clienteId"
        type="text"
        placeholder="Asociar con un cliente"
      />
      <p class="mt-1 text-xs text-gray-500">Solo necesario si el rol es Cliente</p>
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
          Guardando...
        </span>
        <span v-else>{{ isEditing ? 'Actualizar' : 'Crear' }}</span>
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from '../Button.vue';
import Input from '../Input.vue';
import type { Usuario } from '../../types';

interface Props {
  initialData?: Usuario | null;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
});

const emit = defineEmits<{
  submit: [data: any];
  cancel: [];
}>();

const isEditing = computed(() => !!props.initialData);

const form = ref({
  usuarioId: props.initialData?.usuarioId?.toString() || '',
  usuario: props.initialData?.usuario || '',
  password: '',
  rolId: props.initialData?.rolId?.toString() || '',
  clienteId: props.initialData?.clienteId?.toString() || '',
});

const errors = ref<Record<string, string>>({});
const submitError = ref('');

const validateForm = (): boolean => {
  errors.value = {};

  if (!isEditing.value && !form.value.usuarioId) {
    errors.value.usuarioId = 'El ID de usuario es requerido';
  }

  if (!form.value.usuario.trim()) {
    errors.value.usuario = 'El nombre de usuario es requerido';
  }

  if (!isEditing.value && !form.value.password) {
    errors.value.password = 'La contraseña es requerida';
  }

  if (!isEditing.value && form.value.password && form.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (!form.value.rolId) {
    errors.value.rolId = 'El rol es requerido';
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  submitError.value = '';

  const data: any = {
    usuario: form.value.usuario,
    rolId: Number(form.value.rolId),
    clienteId: form.value.clienteId || null,
  };

  if (!isEditing.value) {
    data.usuarioId = Number(form.value.usuarioId);
    data.password = form.value.password;
  }

  emit('submit', data);
};

const handleCancel = () => {
  emit('cancel');
};
</script>

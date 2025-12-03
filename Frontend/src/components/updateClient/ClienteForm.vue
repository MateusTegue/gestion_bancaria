<template>
  <ClienteFormBase
    :initial-data="initialData"
    :loading="loading"
    :submitting="submitting"
    submit-label="Actualizar"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import ClienteFormBase from '../createClient/ClienteForm.vue';
import type { ClienteFormData } from '../../types';

interface Props {
  initialData?: ClienteFormData;
  loading?: boolean;
  submitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  submitting: false,
});

const emit = defineEmits<{
  submit: [data: ClienteFormData];
  cancel: [];
}>();

const handleSubmit = (data: ClienteFormData) => {
  emit('submit', data);
};

const handleCancel = () => {
  emit('cancel');
};
</script>


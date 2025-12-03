<template>
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
</template>

<script setup lang="ts">
import Button from '../Button.vue';

interface Props {
  submitting?: boolean;
  submitLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  submitting: false,
  submitLabel: 'Crear',
});

const emit = defineEmits<{
  cancel: [];
}>();

const handleCancel = () => {
  emit('cancel');
};
</script>


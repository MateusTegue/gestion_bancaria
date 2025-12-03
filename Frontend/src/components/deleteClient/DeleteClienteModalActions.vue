<template>
  <Button
    variant="danger"
    class="w-full sm:w-auto sm:ml-3"
    :disabled="deleting"
    @click="handleConfirm"
  >
    {{ deleting ? 'Eliminando...' : 'Eliminar' }}
  </Button>
  <Button
    variant="secondary"
    class="mt-3 w-full sm:mt-0 sm:w-auto"
    @click="handleClose"
  >
    Cancelar
  </Button>
</template>

<script setup lang="ts">
import Button from '../Button.vue';

interface Props {
  deleting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  deleting: false,
});

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const handleClose = () => {
  emit('close');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>


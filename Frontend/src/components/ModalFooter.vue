<template>
  <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <slot>
      <Button
        variant="primary"
        class="w-full sm:w-auto sm:ml-3"
        @click="handleConfirm"
      >
        Confirmar
      </Button>
      <Button
        variant="secondary"
        class="mt-3 w-full sm:mt-0 sm:w-auto"
        @click="handleClose"
      >
        Cancelar
      </Button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import Button from './Button.vue';

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


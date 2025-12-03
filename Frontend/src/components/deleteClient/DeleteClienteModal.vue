<template>
  <Modal
    :show="show"
    title="Confirmar eliminación"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <p>
      ¿Estás seguro de que deseas eliminar al cliente
      <strong>{{ cliente?.nombre }} {{ cliente?.apellido }}</strong>?
    </p>
    <p class="mt-2 text-sm text-gray-500">
      Esta acción no se puede deshacer.
    </p>
    <template #footer>
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
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../Modal.vue';
import Button from '../Button.vue';
import type { Cliente } from '../../types';

interface Props {
  show: boolean;
  cliente: Cliente | null;
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


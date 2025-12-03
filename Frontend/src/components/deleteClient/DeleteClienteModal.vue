<template>
  <Modal
    :show="show"
    title="Confirmar eliminación"
    @close="handleClose"
    @confirm="handleConfirm"
  >
    <DeleteClienteModalContent :cliente="cliente" />
    
    <template #footer>
      <DeleteClienteModalActions
        :deleting="deleting"
        @close="handleClose"
        @confirm="handleConfirm"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../Modal.vue';
import DeleteClienteModalContent from './DeleteClienteModalContent.vue';
import DeleteClienteModalActions from './DeleteClienteModalActions.vue';
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


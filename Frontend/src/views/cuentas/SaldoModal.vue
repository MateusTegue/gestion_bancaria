<template>
  <Modal
    :show="show"
    title="Saldo de la Cuenta"
    @close="handleClose"
  >
    <div class="text-center py-4">
      <p class="text-3xl font-bold text-blue-600">
        ${{ saldo?.toLocaleString() || '0' }}
      </p>
    </div>
    <template #footer>
      <Button variant="primary" class="w-full sm:w-auto" @click="handleClose">
        Cerrar
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '../../components/Modal.vue';
import Button from '../../components/Button.vue';

interface Props {
  show: boolean;
  saldo: number | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit('close');
};
</script>


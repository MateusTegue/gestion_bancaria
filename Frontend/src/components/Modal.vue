<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleClose"
      >
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <ModalOverlay />

          <ModalContainer>
            <ModalHeader :title="title" />
            <ModalBody>
              <slot />
            </ModalBody>

            <template #footer>
              <ModalFooter
                @close="handleClose"
                @confirm="handleConfirm"
              >
                <slot name="footer">
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
              </ModalFooter>
            </template>
          </ModalContainer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import Button from './Button.vue';
import ModalOverlay from './ModalOverlay.vue';
import ModalContainer from './ModalContainer.vue';
import ModalHeader from './ModalHeader.vue';
import ModalBody from './ModalBody.vue';
import ModalFooter from './ModalFooter.vue';

interface Props {
  show: boolean;
  title: string;
}

const props = defineProps<Props>();

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

watch(
  () => props.show,
  (newValue: boolean) => {
    if (newValue) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>


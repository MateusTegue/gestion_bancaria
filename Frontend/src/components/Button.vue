<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors',
      variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
      variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
      variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
      variant === 'success' && 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300',
      'disabled:cursor-not-allowed',
      className,
    ]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  className: '',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>


<template>
  <div class="mb-4">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="[
        'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
        className,
      ]"
      @input="handleInput"
      @blur="handleBlur"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string;
  label?: string;
  type?: string;
  modelValue: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  className: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  blur: [event: FocusEvent];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};
</script>


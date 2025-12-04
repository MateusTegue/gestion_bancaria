<template>
  <div class="mb-6">
    <Input
      :model-value="searchTerm"
      placeholder="Buscar por identificación o nombre..."
      className="max-w-md"
      @update:model-value="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import Input from '../Input.vue';

interface Props {
  searchTerm: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:searchTerm': [value: string];
  search: [value: string];
}>();

const handleInput = (value: string | number) => {
  const searchValue = String(value);
  emit('update:searchTerm', searchValue);
  emit('search', searchValue);
};
</script>


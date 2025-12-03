<template>
  <div class="mb-6">
    <Input
      v-model="filterValue"
      label="Filtrar por ID de Cliente"
      type="number"
      placeholder="Ingrese el ID del cliente"
      className="max-w-md"
      @update:model-value="handleInput"
    />
    <Button variant="secondary" class="mt-2" @click="handleFilter">
      Filtrar
    </Button>
    <Button variant="secondary" class="mt-2 ml-2" @click="handleClear">
      Limpiar
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Input from '../../components/Input.vue';
import Button from '../../components/Button.vue';

interface Props {
  initialValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: '',
});

const emit = defineEmits<{
  filter: [clienteId: number];
  clear: [];
}>();

const filterValue = ref(props.initialValue);

const handleInput = (value: string | number) => {
  filterValue.value = String(value);
};

const handleFilter = () => {
  const clienteId = Number(filterValue.value);
  if (clienteId) {
    emit('filter', clienteId);
  }
};

const handleClear = () => {
  filterValue.value = '';
  emit('clear');
};
</script>


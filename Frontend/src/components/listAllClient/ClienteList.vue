<template>
  <div>
    <ClienteSearch
      :search-term="searchTerm"
      @update:search-term="handleSearchTermUpdate"
      @search="handleSearch"
    />

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Cargando clientes...</p>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <div v-else-if="clientes.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-lg">No se encontraron clientes</p>
    </div>

    <ClienteTable
      v-else
      :clientes="clientes"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import ClienteSearch from './ClienteSearch.vue';
import ClienteTable from './ClienteTable.vue';
import type { Cliente } from '../../types';

interface Props {
  clientes: Cliente[];
  loading: boolean;
  error: string;
  searchTerm: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:searchTerm': [value: string];
  search: [value: string];
  delete: [cliente: Cliente];
}>();

const handleSearchTermUpdate = (value: string) => {
  emit('update:searchTerm', value);
};

const handleSearch = (value: string) => {
  emit('search', value);
};

const handleDelete = (cliente: Cliente) => {
  emit('delete', cliente);
};
</script>


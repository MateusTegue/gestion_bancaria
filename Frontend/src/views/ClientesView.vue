<template>
  <Layout>
    <div class="px-4 py-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Clientes</h1>
        <RouterLink to="/clientes/nuevo">
          <Button variant="primary">
            <svg
              class="w-5 h-5 inline mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nuevo Cliente
          </Button>
        </RouterLink>
      </div>

      <ClienteList
        :clientes="clientes"
        :loading="loading"
        :error="error"
        :search-term="searchTerm"
        @update:search-term="searchTerm = $event"
        @search="handleSearch"
        @delete="handleDeleteClick"
      />

      <DeleteClienteModal
        :show="showDeleteModal"
        :cliente="clienteToDelete"
        :deleting="deleting"
        @close="showDeleteModal = false"
        @confirm="handleDeleteConfirm"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import Layout from '../components/Layout.vue';
import Button from '../components/Button.vue';
import ClienteList from '../components/listAllClient/ClienteList.vue';
import DeleteClienteModal from '../components/deleteClient/DeleteClienteModal.vue';
import { useClientesList } from './clientes/useClientesList';

const {
  clientes,
  loading,
  error,
  searchTerm,
  showDeleteModal,
  clienteToDelete,
  deleting,
  loadClientes,
  handleSearch,
  handleDeleteClick,
  handleDeleteConfirm,
} = useClientesList();

onMounted(() => {
  loadClientes();
});
</script>

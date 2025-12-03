<template>
  <Layout>
    <div class="px-4 py-6 max-w-2xl mx-auto">
      <div class="mb-6">
        <RouterLink to="/clientes" class="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Volver a Clientes
        </RouterLink>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h1>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Cargando...</p>
      </div>

      <CreateClienteForm
        v-else-if="!isEdit"
        :loading="loading"
        :submitting="submitting"
        @submit="handleCreate"
        @cancel="handleCancel"
      />

      <UpdateClienteForm
        v-else
        :initial-data="formData"
        :loading="loading"
        :submitting="submitting"
        @submit="handleUpdate"
        @cancel="handleCancel"
      />
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import Layout from '../components/Layout.vue';
import CreateClienteForm from '../components/createClient/ClienteForm.vue';
import UpdateClienteForm from '../components/updateClient/ClienteForm.vue';
import { useClienteForm } from './clientes/useClienteForm';

const {
  isEdit,
  formData,
  loading,
  submitting,
  loadCliente,
  handleCreate,
  handleUpdate,
  handleCancel,
} = useClienteForm();

onMounted(() => {
  if (isEdit.value) {
    loadCliente();
  }
});
</script>

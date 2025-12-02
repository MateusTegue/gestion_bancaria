<template>
  <Layout>
    <div class="px-4 py-6">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Gestión Bancaria
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Administra clientes y cuentas bancarias de manera eficiente
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-blue-100 rounded-full p-3 mr-4">
              <svg
                class="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-gray-800">Clientes</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Gestiona la información de tus clientes: crear, editar, buscar y eliminar registros.
          </p>
          <RouterLink to="/clientes">
            <Button variant="primary" class="w-full">
              Ver Clientes
            </Button>
          </RouterLink>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center mb-4">
            <div class="bg-green-100 rounded-full p-3 mr-4">
              <svg
                class="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-semibold text-gray-800">Cuentas</h2>
          </div>
          <p class="text-gray-600 mb-4">
            Administra las cuentas bancarias: crear cuentas, consultar saldos y cambiar estados.
          </p>
          <RouterLink to="/cuentas">
            <Button variant="success" class="w-full">
              Ver Cuentas
            </Button>
          </RouterLink>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import Button from '../components/Button.vue';
import { RouterLink } from 'vue-router';
</script>


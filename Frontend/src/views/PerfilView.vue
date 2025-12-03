<template>
  <Layout>
    <div>
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h2>
        <p class="text-gray-600">Información de tu cuenta de usuario</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div class="space-y-6">
          <!-- Avatar y Nombre -->
          <div class="flex items-center space-x-4 pb-6 border-b border-gray-200">
            <div class="bg-blue-600 rounded-full p-4">
              <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ usuario?.usuario }}</h3>
              <p class="text-sm text-gray-500">{{ rolNombre }}</p>
            </div>
          </div>

          <!-- Información del Usuario -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ID de Usuario
              </label>
              <p class="text-gray-900">{{ usuario?.usuarioId }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Usuario
              </label>
              <p class="text-gray-900">{{ usuario?.usuario }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <p class="text-gray-900">{{ rolNombre }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ID de Rol
              </label>
              <p class="text-gray-900">{{ usuario?.rolId }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '../components/Layout.vue';
import { useAuth } from '../composables/useAuth';

const { usuario, rolNombre } = useAuth();
</script>


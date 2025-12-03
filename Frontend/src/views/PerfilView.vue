<template>
  <Layout>
    <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
      <p class="text-gray-600">Gestiona tu información de usuario y preferencias</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tarjeta de Perfil Principal -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div class="flex items-center space-x-4">
              <div class="bg-white rounded-full p-3 shadow-lg">
                <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-white">{{ usuario?.usuario || 'Usuario' }}</h2>
                <div class="mt-2">
                  <span
                    :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                      getRolBadgeClass(usuario?.rolId)
                    ]"
                  >
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ rolNombre }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-6">
              <!-- Información Personal -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Información Personal
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      ID de Usuario
                    </label>
                    <p class="text-lg font-semibold text-gray-900">{{ usuario?.usuarioId || 'N/A' }}</p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Nombre de Usuario
                    </label>
                    <p class="text-lg font-semibold text-gray-900">{{ usuario?.usuario || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Información de Rol -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Información de Rol
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Rol
                    </label>
                    <p class="text-lg font-semibold text-gray-900">{{ rolNombre || 'N/A' }}</p>
                  </div>

                  <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      ID de Rol
                    </label>
                    <p class="text-lg font-semibold text-gray-900">{{ usuario?.rolId || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Información Adicional para Clientes -->
              <div v-if="usuario?.clienteId">
                <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Información de Cliente
                </h3>
                <div class="bg-gray-50 rounded-lg p-4">
                  <label class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    ID de Cliente
                  </label>
                  <p class="text-lg font-semibold text-gray-900">{{ usuario.clienteId }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tarjeta Lateral -->
      <div class="space-y-6">
        <!-- Estadísticas Rápidas -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Estado de la Cuenta</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Estado</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                Activo
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Tipo de Usuario</span>
              <span class="text-sm font-medium text-gray-900">{{ rolNombre }}</span>
            </div>
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
import { ROLES } from '../utils/roles';

const { usuario, rolNombre } = useAuth();

const getRolBadgeClass = (rolId?: number) => {
  if (rolId === ROLES.ADMON) {
    return 'bg-purple-100 text-purple-800';
  } else if (rolId === ROLES.ANALISTA) {
    return 'bg-blue-100 text-blue-800';
  } else if (rolId === ROLES.CLIENTE) {
    return 'bg-green-100 text-green-800';
  }
  return 'bg-gray-100 text-gray-800';
};
</script>


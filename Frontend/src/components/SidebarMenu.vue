<template>
  <div class="h-full flex flex-col">
    <!-- Logo/Brand -->
    <div class="flex items-center justify-between p-4">
      <RouterLink
        v-if="!isCollapsed"
        to="/"
        class="flex items-center space-x-3 transition-all"
      >
        <div class="bg-blue-600 rounded-lg p-2 flex-shrink-0">
          <svg
            class="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 20 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
        <span class="text-xl font-bold text-gray-900 whitespace-nowrap">Gestión Bancaria</span>
      </RouterLink>
      <div
        v-else
        class="flex items-center justify-center w-full"
      >
        <div class="bg-blue-600 rounded-lg p-2">
          <svg
            class="w-6 h-6 text-white"
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
      </div>
      <button
        @click="$emit('toggle')"
        class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
        :title="isCollapsed ? 'Expandir menú' : 'Colapsar menú'"
      >
        <svg
          v-if="!isCollapsed"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="space-y-1 px-2">
        <!-- Dashboard/Home -->
        <li>
          <RouterLink
            to="/"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              isActive('/')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            :title="isCollapsed ? 'Dashboard' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Dashboard</span>
          </RouterLink>
        </li>

        <!-- Perfil -->
        <li>
          <RouterLink
            to="/perfil"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              isActive('/perfil')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            :title="isCollapsed ? 'Perfil' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Perfil</span>
          </RouterLink>
        </li>

        <!-- Clientes (Solo ADMON) -->
        <li v-if="isAdmin">
          <RouterLink
            to="/clientes"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              isActive('/clientes')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            :title="isCollapsed ? 'Clientes' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Clientes</span>
          </RouterLink>
        </li>

        <!-- Cuentas -->
        <li>
          <RouterLink
            to="/cuentas"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              isActive('/cuentas')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            :title="isCollapsed ? 'Cuentas' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Cuentas</span>
          </RouterLink>
        </li>

        <!-- Transacciones (Todos los roles) -->
        <li>
          <RouterLink
            to="/transacciones"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
              isActive('/transacciones')
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            ]"
            :title="isCollapsed ? 'Transacciones' : ''"
          >
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            <span :class="[isCollapsed ? 'hidden' : 'block']">Transacciones</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Footer con botón de cerrar sesión -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <button
        @click="$emit('logout')"
        :class="[
          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
          isCollapsed 
            ? 'justify-center' 
            : 'justify-start',
          'text-gray-700 hover:bg-gray-200'
        ]"
        :title="isCollapsed ? 'Cerrar Sesión' : ''"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span :class="[isCollapsed ? 'hidden' : 'block']">Cerrar Sesión</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useRoute, RouterLink } from 'vue-router';
import { useAuth } from '../composables/useAuth';

interface Props {
  isCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
});

defineEmits<{
  toggle: [];
  logout: [];
}>();

const route = useRoute();
const { usuario, rolNombre, isAdmin, isAnalista } = useAuth();

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};
</script>


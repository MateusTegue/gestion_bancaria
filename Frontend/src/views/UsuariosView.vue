<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
      <Button @click="openCreateModal" variant="primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Crear Usuario
      </Button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por usuario</label>
          <Input
            v-model="searchQuery"
            placeholder="Nombre de usuario..."
            @input="handleSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por rol</label>
          <select
            v-model="selectedRole"
            @change="handleRoleFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los roles</option>
            <option value="1">Administrador</option>
            <option value="2">Analista</option>
            <option value="3">Cliente</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Registros por página</label>
          <select
            v-model="pagination.itemsPerPage"
            @change="handleItemsPerPageChange"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="p-6 text-center text-red-600">
        {{ error }}
      </div>

      <div v-else-if="usuarios.length === 0" class="p-6 text-center text-gray-500">
        No se encontraron usuarios
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente Asociado
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="usuario in usuarios" :key="usuario.usuarioId" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ usuario.usuarioId }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ usuario.usuario }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getRoleBadgeClass(usuario.rolId)" class="px-2 py-1 text-xs font-semibold rounded-full">
                {{ usuario.rolNombre }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ usuario.nombreCliente || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button
                @click="openEditModal(usuario)"
                class="text-blue-600 hover:text-blue-900"
                title="Editar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button
                @click="openChangePasswordModal(usuario)"
                class="text-yellow-600 hover:text-yellow-900"
                title="Cambiar contraseña"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                </svg>
              </button>
              <button
                @click="confirmDelete(usuario)"
                class="text-red-600 hover:text-red-900"
                title="Eliminar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <Pagination
      v-if="pagination.totalItems > 0"
      :current-page="pagination.currentPage"
      :items-per-page="pagination.itemsPerPage"
      :total-items="pagination.totalItems"
      @page-change="handlePageChange"
    />

    <!-- Modal Crear/Editar Usuario -->
    <Modal 
      :show="showUserModal" 
      :title="editingUser ? 'Editar Usuario' : 'Crear Usuario'"
      :hide-footer="true"
      @close="closeUserModal"
    >
      <CreateEditUserForm
        :initial-data="editingUser"
          :submitting="submitting"
          @submit="handleSubmit"
          @cancel="closeUserModal"
        />
    </Modal>

    <!-- Modal Cambiar Contraseña -->
    <Modal 
      :show="showPasswordModal" 
      title="Cambiar Contraseña"
      :hide-footer="true"
      @close="closePasswordModal"
    >
      <ChangePasswordForm
        :usuario="selectedUser"
          :submitting="submitting"
          @submit="handleChangePassword"
          @cancel="closePasswordModal"
        />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import Modal from '../components/Modal.vue';
import Pagination from '../components/Pagination.vue';
import CreateEditUserForm from '../components/usuario/CreateEditUserForm.vue';
import ChangePasswordForm from '../components/usuario/ChangePasswordForm.vue';
import usuarioService from '../services/usuarioService';
import type { Usuario } from '../types';

const toast = useToast();

const usuarios = ref<Usuario[]>([]);
const loading = ref(false);
const error = ref('');
const submitting = ref(false);

const showUserModal = ref(false);
const showPasswordModal = ref(false);
const editingUser = ref<Usuario | null>(null);
const selectedUser = ref<Usuario | null>(null);

const searchQuery = ref('');
const selectedRole = ref('');

const pagination = ref({
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPreviousPage: false
});

const loadUsuarios = async (page = 1) => {
  loading.value = true;
  error.value = '';
  try {
    const response = await usuarioService.listAll({ 
      page, 
      limit: pagination.value.itemsPerPage 
    });
    usuarios.value = response.data;
    pagination.value = response.pagination;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al cargar usuarios';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (page: number) => {
  pagination.value.currentPage = page;
  loadUsuarios(page);
};

const handleItemsPerPageChange = () => {
  pagination.value.currentPage = 1;
  loadUsuarios(1);
};

const handleSearch = async () => {
  if (searchQuery.value.trim()) {
    try {
      loading.value = true;
      usuarios.value = await usuarioService.searchByUsername(searchQuery.value);
      // Ocultar paginación durante búsqueda
      pagination.value = {
        currentPage: 1,
        totalPages: 1,
        totalItems: usuarios.value.length,
        itemsPerPage: usuarios.value.length,
        hasNextPage: false,
        hasPreviousPage: false
      };
    } catch (err: any) {
      toast.error('Error al buscar usuarios');
    } finally {
      loading.value = false;
    }
  } else {
    pagination.value.currentPage = 1;
    loadUsuarios(1);
  }
};

const handleRoleFilter = async () => {
  if (selectedRole.value) {
    try {
      loading.value = true;
      usuarios.value = await usuarioService.listByRole(Number(selectedRole.value));
      // Ocultar paginación durante filtro
      pagination.value = {
        currentPage: 1,
        totalPages: 1,
        totalItems: usuarios.value.length,
        itemsPerPage: usuarios.value.length,
        hasNextPage: false,
        hasPreviousPage: false
      };
    } catch (err: any) {
      toast.error('Error al filtrar usuarios');
    } finally {
      loading.value = false;
    }
  } else {
    pagination.value.currentPage = 1;
    loadUsuarios(1);
  }
};

const openCreateModal = () => {
  editingUser.value = null;
  showUserModal.value = true;
};

const openEditModal = (usuario: Usuario) => {
  console.log('Usuario a editar:', usuario);
  editingUser.value = { ...usuario };
  showUserModal.value = true;
};

const closeUserModal = () => {
  showUserModal.value = false;
  editingUser.value = null;
};

const openChangePasswordModal = (usuario: Usuario) => {
  selectedUser.value = usuario;
  showPasswordModal.value = true;
};

const closePasswordModal = () => {
  showPasswordModal.value = false;
  selectedUser.value = null;
};

const handleSubmit = async (data: any) => {
  submitting.value = true;
  try {
    if (editingUser.value) {
      await usuarioService.update(editingUser.value.usuarioId, data);
      toast.success('Usuario actualizado exitosamente');
    } else {
      await usuarioService.create(data);
      toast.success('Usuario creado exitosamente');
    }
    closeUserModal();
    loadUsuarios(pagination.value.currentPage);
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Error al guardar usuario');
  } finally {
    submitting.value = false;
  }
};

const handleChangePassword = async (data: any) => {
  submitting.value = true;
  try {
    await usuarioService.changePassword(data);
    toast.success('Contraseña actualizada exitosamente');
    closePasswordModal();
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Error al cambiar contraseña');
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = async (usuario: Usuario) => {
  if (confirm(`¿Está seguro de eliminar el usuario "${usuario.usuario}"?`)) {
    try {
      // Aquí deberías obtener el ID del admin desde el contexto de usuario logueado
      const adminId = 1; // TODO: Obtener del contexto de autenticación
      await usuarioService.delete(usuario.usuarioId, adminId);
      toast.success('Usuario eliminado exitosamente');
      loadUsuarios(pagination.value.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al eliminar usuario');
    }
  }
};

const getRoleBadgeClass = (rolId: number) => {
  switch (rolId) {
    case 1: return 'bg-red-100 text-red-800';
    case 2: return 'bg-blue-100 text-blue-800';
    case 3: return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

onMounted(() => {
  loadUsuarios(1);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistema de Gestión Bancaria
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <Input
              id="usuario"
              v-model="formData.usuario"
              label="Usuario"
              type="text"
              required
              autocomplete="username"
              :error="errors.usuario"
              class="mb-4"
            />
          </div>
          <div>
            <Input
              id="password"
              v-model="formData.password"
              label="Contraseña"
              type="password"
              required
              autocomplete="current-password"
              :error="errors.password"
            />
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <p class="text-red-800 text-sm">{{ error }}</p>
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="loading"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Input from '../components/Input.vue';
import Button from '../components/Button.vue';
import { authService } from '../services/authService';
import { useToast } from '../composables/useToast';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { success, error: showError } = useToast();
const { setUsuario } = useAuth();

const formData = ref({
  usuario: '',
  password: '',
});

const errors = ref<{ usuario?: string; password?: string }>({});
const error = ref('');
const loading = ref(false);

const validateForm = (): boolean => {
  errors.value = {};
  
  if (!formData.value.usuario.trim()) {
    errors.value.usuario = 'El usuario es requerido';
  }
  
  if (!formData.value.password) {
    errors.value.password = 'La contraseña es requerida';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const usuario = await authService.login(formData.value.usuario, formData.value.password);
    
    // Guardar información del usuario usando el composable
    setUsuario(usuario);
    
    success('Inicio de sesión exitoso');
    
    // Redirigir a la ruta original si existe, o al home
    const redirectTo = (route.query.redirect as string) || '/';
    router.push(redirectTo);
  } catch (err: any) {
    let errorMessage = 'Error al iniciar sesión';
    
    if (err.response && err.response.data) {
      errorMessage = err.response.data.message || err.response.data.error || errorMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    // Limpiar mensajes de error de Oracle que contengan trazas técnicas
    if (errorMessage.includes('ORA-') || errorMessage.includes('ORA-06512')) {
      const lines = errorMessage.split('\n');
      const usefulLines = lines.filter(line =>
        !line.includes('ORA-06512') &&
        !line.includes('Help:') &&
        !line.trim().startsWith('ORA-') &&
        line.trim().length > 0
      );
      if (usefulLines.length > 0) {
        errorMessage = usefulLines[0].trim();
      }
    }
    
    error.value = errorMessage;
    showError(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>


<template>
  <div class="space-y-4">
    <Input
      id="identificacion"
      v-model="formData.identificacion"
      label="Identificación"
      placeholder="Ingrese la identificación"
      required
      :error="errors.identificacion"
    />

    <Input
      id="primerNombre"
      v-model="formData.primerNombre"
      label="Primer Nombre"
      placeholder="Ingrese el primer nombre"
      required
      :error="errors.primerNombre"
    />

    <Input
      id="segundoNombre"
      v-model="formData.segundoNombre"
      label="Segundo Nombre"
      placeholder="Ingrese el segundo nombre (opcional)"
      :error="errors.segundoNombre"
    />

    <Input
      id="primerApellido"
      v-model="formData.primerApellido"
      label="Primer Apellido"
      placeholder="Ingrese el primer apellido"
      required
      :error="errors.primerApellido"
    />

    <Input
      id="segundoApellido"
      v-model="formData.segundoApellido"
      label="Segundo Apellido"
      placeholder="Ingrese el segundo apellido (opcional)"
      :error="errors.segundoApellido"
    />

    <Input
      id="direccion"
      v-model="formData.direccion"
      label="Dirección"
      placeholder="Ingrese la dirección"
      :error="errors.direccion"
    />
  </div>
</template>

<script setup lang="ts">
import Input from '../Input.vue';
import type { ClienteFormData } from '../../types';

interface Props {
  formData: ClienteFormData;
  errors: Partial<Record<keyof ClienteFormData, string>>;
}

defineProps<Props>();
</script>


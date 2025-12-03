<template>
  <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <slot />
        </div>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
// Componente para el contenedor principal del modal
</script>


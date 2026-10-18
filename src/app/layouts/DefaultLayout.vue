<script setup lang="ts">
import AppHeader from "../../widgets/app-header/AppHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <AppHeader />
    <main class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>

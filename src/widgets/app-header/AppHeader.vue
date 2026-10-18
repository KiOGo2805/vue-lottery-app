<script setup lang="ts">
import Logo from "./Logo.vue";
import AppNavigation from "./AppNavigation.vue";
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div
      class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
    >
      <RouterLink to="/">
        <Logo />
      </RouterLink>
      <AppNavigation />
    </div>
  </header>
</template>

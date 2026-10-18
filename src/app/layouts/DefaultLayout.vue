<script setup lang="ts">
import { AppHeader } from "../../widgets/app-header";
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <slot />
    </main>
  </div>
</template>

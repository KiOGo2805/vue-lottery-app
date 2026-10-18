<script setup lang="ts">
import ThemeToggleButton from "../../features/theme-toggle";
</script>

<template>
  <div class="auth-shell min-h-screen flex items-center justify-center p-4">
    <div class="auth-theme-toggle">
      <ThemeToggleButton />
    </div>
    <div class="max-w-md w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "../../../entities/theme";
import { AppButton } from "../../../shared/ui";

const theme = useThemeStore();
</script>

<template>
  <AppButton
    type="button"
    :aria-label="theme.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="theme.toggleTheme"
    class="theme-toggle-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors font-medium cursor-pointer"
  >
    {{ theme.isDark ? "Light theme" : "Dark theme" }}
  </AppButton>
</template>

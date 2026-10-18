<script setup lang="ts">
import { useSessionStore } from "../../../entities/session";
import { useRouter } from "vue-router";
import { LogoutButton } from "../../../features/auth";
import { UiButton } from "../../../shared/ui";
import { useThemeStore } from "../../../entities/theme";

const session = useSessionStore();
const theme = useThemeStore();
const router = useRouter();

const handleLogout = () => router.push("/login");
</script>

<template>
  <nav class="flex items-center space-x-6 font-medium text-gray-600">
    <RouterLink
      to="/"
      class="hover:text-blue-500 transition-colors"
      active-class="text-blue-600 font-bold"
      >Home</RouterLink
    >
    <RouterLink
      to="/about"
      class="hover:text-blue-500 transition-colors"
      active-class="text-blue-600 font-bold"
      >About author</RouterLink
    >
    <RouterLink
      v-if="session.isAuthenticated"
      to="/users"
      class="hover:text-blue-500 transition-colors"
      active-class="text-blue-600 font-bold"
      >Users</RouterLink
    >

    <LogoutButton v-if="session.isAuthenticated" @logout="handleLogout" />
    <RouterLink
      v-if="!session.isAuthenticated"
      to="/login"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      Login
    </RouterLink>
    <UiButton
      type="button"
      :aria-label="theme.isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="theme.toggleTheme"
      class="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
    >
      {{ theme.isDark ? "Light theme" : "Dark theme" }}
    </UiButton>
  </nav>
</template>

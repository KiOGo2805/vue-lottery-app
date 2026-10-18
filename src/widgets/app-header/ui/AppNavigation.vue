<script setup lang="ts">
import { useSessionStore } from "../../../entities/session";
import { useRouter } from "vue-router";
import { LogoutButton } from "../../../features/auth";
import ThemeToggleButton from "../../../features/theme-toggle";

const session = useSessionStore();
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
    <ThemeToggleButton />
  </nav>
</template>

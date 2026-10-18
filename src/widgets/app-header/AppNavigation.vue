<script setup lang="ts">
import { useSessionStore } from "../../entities/session/model/session.store";
import { useRouter } from "vue-router";

const auth = useSessionStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
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
      v-if="auth.isAuthenticated"
      to="/users"
      class="hover:text-blue-500 transition-colors"
      active-class="text-blue-600 font-bold"
      >Users</RouterLink
    >

    <button
      v-if="auth.isAuthenticated"
      @click="handleLogout"
      class="text-red-500 hover:text-red-700 transition-colors font-semibold cursor-pointer"
    >
      Logout
    </button>
    <RouterLink
      v-else
      to="/login"
      class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    >
      Login
    </RouterLink>
  </nav>
</template>

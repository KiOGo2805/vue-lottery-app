<script setup lang="ts">
import { useSessionStore } from "../../../entities/session";
import { UiButton } from "../../../shared/ui";

const emit = defineEmits<{ logout: [] }>();
const session = useSessionStore();

const handleLogout = () => {
  session.clearSession();
  emit("logout");
};
</script>

<template>
  <UiButton
    @click="handleLogout"
    class="logout-button bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors font-medium cursor-pointer"
  >
    Logout
  </UiButton>
</template>

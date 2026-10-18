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
    class="text-red-500 hover:text-red-700 transition-colors font-semibold cursor-pointer"
  >
    Logout
  </UiButton>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUsersStore } from "../../../entities/user";
import { UserCreateForm } from "../../../features/user-form";

const router = useRouter();
const usersStore = useUsersStore();

const handleCreated = () => {
  const lastPage = Math.max(1, Math.ceil(usersStore.total / 10));
  router.push({ name: "users", query: { page: lastPage } });
};
</script>

<template>
  <UserCreateForm @created="handleCreated" />
</template>

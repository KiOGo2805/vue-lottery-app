<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import LoginForm from "../../../features/auth";

const route = useRoute();
const router = useRouter();

const handleAuthenticated = () => {
  const redirectPath = (route.query.redirect as string) || "/users";
  router.push(redirectPath);
};
</script>

<template>
  <LoginForm @authenticated="handleAuthenticated" />
</template>

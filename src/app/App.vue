<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import AuthLayout from "./layouts/AuthLayout.vue";
import { useThemeStore } from "../entities/theme";
import { AppToast } from "../shared/ui";

const route = useRoute();
useThemeStore();

const layout = computed(() => {
  return route.meta.layout === "AuthLayout" ? AuthLayout : DefaultLayout;
});
</script>

<template>
  <AppToast />
  <component :is="layout">
    <RouterView />
  </component>
</template>

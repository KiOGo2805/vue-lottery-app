<script setup lang="ts">
import { useRouter } from "vue-router";
import { UserEditForm } from "../../../features/user-form";

const props = defineProps<{ id: string }>();

const router = useRouter();
</script>

<template>
  <UserEditForm :id="props.id" @updated="router.push('/users')" />
</template>

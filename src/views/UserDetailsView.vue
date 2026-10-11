<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ServiceProvider } from "../services/service-provider";
import type { User } from "../types/user";

const props = defineProps<{ id: string }>();
const user = ref<User | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await ServiceProvider.users.getById(Number(props.id));
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border max-w-lg mx-auto">
    <RouterLink to="/users" class="text-blue-500 mb-4 inline-block"
      >&larr; Назад до списку</RouterLink
    >

    <div v-if="isLoading" class="text-gray-500">Завантаження...</div>
    <div v-else-if="user" class="space-y-3">
      <div class="flex items-center gap-4 mb-6">
        <img
          v-if="user.image"
          :src="user.image"
          class="w-20 h-20 rounded-full bg-gray-100"
        />
        <div>
          <h1 class="text-2xl font-bold">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <p class="text-gray-500">@{{ user.username }}</p>
        </div>
      </div>
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Телефон:</b> {{ user.phone }}</p>
      <p><b>Вік:</b> {{ user.age }} ({{ user.gender }})</p>
    </div>
  </div>
</template>

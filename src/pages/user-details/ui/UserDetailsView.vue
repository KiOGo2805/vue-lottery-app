<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersStore } from "../../../entities/user";
import type { User } from "../../../entities/user";

const props = defineProps<{ id: string }>();
const usersStore = useUsersStore();
const user = ref<User | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await usersStore.fetchUser(Number(props.id));
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="user-details">
    <RouterLink to="/users" class="user-details__back-link"
      >&larr; Назад до списку</RouterLink
    >

    <div v-if="isLoading" class="user-details__loading">Завантаження...</div>
    <div v-else-if="user" class="user-details__content">
      <div class="user-details__header">
        <img
          v-if="user.image"
          :src="user.image"
          class="user-details__avatar"
        />
        <div>
          <h1 class="user-details__name">
            {{ user.firstName }} {{ user.lastName }}
          </h1>
          <p class="user-details__username">@{{ user.username }}</p>
        </div>
      </div>
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Телефон:</b> {{ user.phone }}</p>
      <p><b>Вік:</b> {{ user.age }} ({{ user.gender }})</p>
    </div>
  </div>
</template>

<style scoped>
.user-details {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.user-details__back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #3b82f6;
}

.user-details__loading,
.user-details__username {
  color: #6b7280;
}

.user-details__content > * + * {
  margin-top: 0.75rem;
}

.user-details__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.user-details__avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  background: #f3f4f6;
}

.user-details__name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2rem;
}

.user-details__username {
  margin: 0;
}
</style>

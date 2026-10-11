<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "../stores/users";
import { ServiceProvider } from "../services/service-provider";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const limit = 10;
const searchInput = ref((route.query.q as string) || "");

// Витягуємо поточну сторінку з URL
const currentPage = computed(() => Number(route.query.page) || 1);
const totalPages = computed(() => Math.ceil(usersStore.total / limit));

const updateRoute = (page: number, q: string) => {
  router.push({ query: { ...route.query, page, q: q || undefined } });
};

const handleSearch = () => {
  updateRoute(1, searchInput.value);
};

const deleteUser = async (id: number) => {
  if (confirm("Ви дійсно бажаєте видалити цього користувача?")) {
    try {
      await ServiceProvider.users.delete(id);
      usersStore.removeUser(id); // Оновлюємо локальний стан
      const currentPageUsers = usersStore.users.length;
      if (currentPageUsers === 0 && currentPage.value > 1) {
        updateRoute(currentPage.value - 1, searchInput.value);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Помилка видалення");
    }
  }
};

// Спостерігаємо за змінами query параметрів в URL і робимо запит
watch(
  () => route.query,
  (newQuery) => {
    const page = Number(newQuery.page) || 1;
    const q = (newQuery.q as string) || "";
    const skip = (page - 1) * limit;
    usersStore.fetchUsers(limit, skip, q);
    searchInput.value = q;
  },
  { immediate: true },
);
</script>

<template>
  <div class="users-view">
    <div class="users-view__header">
      <h1 class="users-view__title">Користувачі</h1>
      <div class="users-view__toolbar">
        <input
          v-model="searchInput"
          @keydown.enter="handleSearch"
          placeholder="Пошук..."
          class="users-view__search"
        />
        <button
          @click="handleSearch"
          class="users-view__search-button"
        >
          Знайти
        </button>
        <RouterLink
          to="/users/new"
          class="users-view__create-link"
        >
          Створити
        </RouterLink>
      </div>
    </div>

    <div v-if="usersStore.isLoading" class="users-view__loading">
      Завантаження...
    </div>
    <div v-else-if="usersStore.error" class="users-view__error">
      {{ usersStore.error }}
    </div>

    <div v-else>
      <table class="users-view__table">
        <thead>
          <tr class="users-view__table-heading">
            <th>ID</th>
            <th>Ім'я</th>
            <th>Email</th>
            <th class="users-view__actions-heading">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in usersStore.users"
            :key="user.id"
            class="users-view__table-row"
          >
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }} {{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td class="users-view__actions">
              <RouterLink
                :to="`/users/${user.id}`"
                class="users-view__details-link"
                >Деталі</RouterLink
              >
              <RouterLink
                :to="`/users/${user.id}/edit`"
                class="users-view__edit-link"
                >Редагувати</RouterLink
              >
              <button
                @click="deleteUser(user.id)"
                class="users-view__delete-button"
              >
                Видалити
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Пагінація -->
      <div class="users-view__pagination">
        <button
          :disabled="currentPage === 1"
          @click="updateRoute(currentPage - 1, searchInput)"
          class="users-view__page-button"
        >
          Попередня
        </button>
        <span class="users-view__page-number"
          >Сторінка {{ currentPage }} з {{ totalPages || 1 }}</span
        >
        <button
          :disabled="currentPage >= totalPages"
          @click="updateRoute(currentPage + 1, searchInput)"
          class="users-view__page-button"
        >
          Наступна
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-view {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.users-view__header,
.users-view__toolbar,
.users-view__pagination {
  display: flex;
  align-items: center;
}

.users-view__header {
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.users-view__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2rem;
}

.users-view__toolbar {
  flex-wrap: wrap;
  gap: 0.5rem;
}

.users-view__search {
  padding: 0.25rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.users-view__search:focus {
  border-color: #3b82f6;
  outline: none;
}

.users-view__search-button,
.users-view__create-link {
  padding: 0.25rem 1rem;
  border: 0;
  border-radius: 0.25rem;
  color: #fff;
  transition: background-color 150ms;
  cursor: pointer;
}

.users-view__search-button {
  background: #3b82f6;
}

.users-view__search-button:hover {
  background: #2563eb;
}

.users-view__create-link {
  background: #16a34a;
}

.users-view__create-link:hover {
  background: #15803d;
}

.users-view__loading {
  padding: 2.5rem 0;
  color: #6b7280;
  text-align: center;
}

.users-view__error {
  color: #ef4444;
}

.users-view__table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-view__table-heading,
.users-view__table-row {
  border-bottom: 1px solid #e5e7eb;
}

.users-view__table-heading {
  color: #4b5563;
  font-size: 0.875rem;
}

.users-view__table th,
.users-view__table td {
  padding: 0.5rem;
}

.users-view__table-row:hover {
  background: #f9fafb;
}

.users-view__table-row td {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.users-view__actions-heading,
.users-view__actions {
  text-align: right;
}

.users-view__actions > * + * {
  margin-left: 0.5rem;
}

.users-view__details-link,
.users-view__edit-link,
.users-view__delete-button {
  text-decoration: none;
}

.users-view__details-link {
  color: #3b82f6;
}

.users-view__edit-link {
  color: #22c55e;
}

.users-view__delete-button {
  padding: 0;
  border: 0;
  background: transparent;
  color: #ef4444;
  font: inherit;
  cursor: pointer;
}

.users-view__details-link:hover,
.users-view__edit-link:hover,
.users-view__delete-button:hover {
  text-decoration: underline;
}

.users-view__pagination {
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.users-view__page-button {
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 0.25rem;
  background: #f3f4f6;
  transition: background-color 150ms;
  cursor: pointer;
}

.users-view__page-button:hover:not(:disabled) {
  background: #e5e7eb;
}

.users-view__page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.users-view__page-number {
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .users-view__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .users-view {
    overflow-x: auto;
  }
}
</style>

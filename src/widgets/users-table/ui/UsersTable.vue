<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useUsersStore } from "../../../entities/user";
import {
  AppButton,
  AppConfirmDialog,
  AppInput,
  AppTable,
  useAppToast,
} from "../../../shared/ui";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();
const { users, total, isLoading, error } = storeToRefs(usersStore);
const toast = useAppToast();

const limit = 10;
const searchInput = ref((route.query.q as string) || "");
const currentPage = computed(() => Number(route.query.page) || 1);
const totalPages = computed(() => Math.ceil(total.value / limit));
const userToDelete = ref<{ id: number; fullName: string } | null>(null);
const columns = [
  { field: "id", header: "ID" },
  { header: "Ім'я", slot: "name" },
  { field: "email", header: "Email" },
  {
    header: "Дії",
    headerClass: "users-view__actions-heading",
    slot: "actions",
  },
];

const updateRoute = (page: number, q: string) => {
  router.push({ query: { ...route.query, page, q: q || undefined } });
};

const handleSearch = () => {
  updateRoute(1, searchInput.value);
};

const openDeleteModal = (id: number, fullName: string) => {
  userToDelete.value = { id, fullName };
};

const closeDeleteModal = () => {
  userToDelete.value = null;
};

const deleteUser = async () => {
  if (!userToDelete.value) return;

  try {
    await usersStore.removeUser(userToDelete.value.id);
    toast.success("Користувача видалено");
    closeDeleteModal();

    if (users.value.length === 0 && currentPage.value > 1) {
      updateRoute(currentPage.value - 1, searchInput.value);
    }
  } catch (error) {
    toast.error(
      "Не вдалося видалити користувача",
      error instanceof Error ? error.message : "Помилка видалення",
    );
  }
};

watch(
  () => route.query,
  (newQuery) => {
    const page = Number(newQuery.page) || 1;
    const q = (newQuery.q as string) || "";
    usersStore.fetchUsers(limit, (page - 1) * limit, q);
    searchInput.value = q;
  },
  { immediate: true },
);
</script>

<template>
  <section class="users-table">
    <div class="users-view__header">
      <h1 class="users-view__title">Користувачі</h1>
      <div class="users-view__toolbar">
        <AppInput
          v-model="searchInput"
          @keydown.enter="handleSearch"
          placeholder="Пошук..."
          class="users-view__search"
        />
        <AppButton @click="handleSearch" class="users-view__search-button">
          Знайти
        </AppButton>
        <RouterLink to="/users/new" class="users-view__create-link">
          Створити
        </RouterLink>
      </div>
    </div>

    <div v-if="isLoading" class="users-view__loading">
      Завантаження...
    </div>
    <div v-else-if="error" class="users-view__error">
      {{ error }}
    </div>

    <div v-else>
      <AppTable
        :value="users"
        :columns="columns"
        data-key="id"
        class="app-table users-view__table"
      >
        <template #name="{ data }">
            {{ data.firstName }} {{ data.lastName }}
        </template>
        <template #actions="{ data }">
            <div class="users-view__actions">
              <RouterLink
                :to="`/users/${data.id}`"
                class="users-view__details-link"
              >
                Деталі
              </RouterLink>
              <RouterLink
                :to="`/users/${data.id}/edit`"
                class="users-view__edit-link"
              >
                Редагувати
              </RouterLink>
              <AppButton
                class="users-view__delete-button"
                @click="
                  openDeleteModal(
                    data.id,
                    `${data.firstName} ${data.lastName}`,
                  )
                "
              >
                Видалити
              </AppButton>
            </div>
        </template>
      </AppTable>

      <AppConfirmDialog
        :visible="Boolean(userToDelete)"
        :message="
          userToDelete
            ? `Ви дійсно бажаєте видалити користувача ${userToDelete.fullName}?`
            : ''
        "
        header="Підтвердження видалення"
        @accept="deleteUser"
        @reject="closeDeleteModal"
      />

      <div class="users-view__pagination">
        <AppButton
          :disabled="currentPage === 1"
          @click="updateRoute(currentPage - 1, searchInput)"
          class="users-view__page-button"
        >
          Попередня
        </AppButton>
        <span class="users-view__page-number">
          Сторінка {{ currentPage }} з {{ totalPages || 1 }}
        </span>
        <AppButton
          :disabled="currentPage >= totalPages"
          @click="updateRoute(currentPage + 1, searchInput)"
          class="users-view__page-button"
        >
          Наступна
        </AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.users-table {
  min-width: 0;
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
  margin: 1.5rem 0 1rem;
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

.users-view__actions-heading {
  width: 240px;
  padding-right: 1rem;
  text-align: right;
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
}

.users-view__pagination {
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
}

.users-view__page-button {
  padding: 0.5rem 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: #fff;
  cursor: pointer;
}

.users-view__page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.users-view__actions {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.7rem;
  padding-left: 0.5rem;
  text-align: left;
}

.users-view__details-link,
.users-view__edit-link,
.users-view__delete-button {
  display: inline-flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s ease, text-decoration-color 0.2s ease;
}

.users-view__details-link {
  color: #2563eb;
}

.users-view__details-link:hover {
  text-decoration: underline;
  text-decoration-color: #2563eb;
  opacity: 0.8;
}

.users-view__edit-link {
  color: #16a34a;
}

.users-view__edit-link:hover {
  text-decoration: underline;
  text-decoration-color: #16a34a;
  opacity: 0.8;
}

.users-view__delete-button {
  border: none;
  background: transparent;
  color: #dc2626;
  cursor: pointer;
}

.users-view__delete-button:hover {
  text-decoration: underline;
  text-decoration-color: #dc2626;
  opacity: 0.8;
}

.users-view__modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(15 23 42 / 45%);
}

.users-view__modal {
  width: min(420px, calc(100vw - 2rem));
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 50px rgb(15 23 42 / 18%);
}

.users-view__modal-title {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.users-view__modal-text {
  margin: 0 0 1.5rem;
  color: #374151;
  line-height: 1.6;
}

.users-view__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.users-view__modal-cancel,
.users-view__modal-confirm {
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.users-view__modal-cancel {
  background: #e5e7eb;
  color: #111827;
}

.users-view__modal-confirm {
  background: #dc2626;
  color: #fff;
}

@media (max-width: 640px) {
  .users-view__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .users-view {
    overflow-x: auto;
  }
}
</style>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUsersStore } from "../entities/user/model/users.store";
import { ServiceProvider } from "../shared/api/service-provider";
import type { Participant } from "../shared/types";

const route = useRoute();
const router = useRouter();
const usersStore = useUsersStore();

const limit = 10;
const searchInput = ref((route.query.q as string) || "");
const currentPage = computed(() => Number(route.query.page) || 1);
const totalPages = computed(() => Math.ceil(usersStore.total / limit));
const lotteryWinners = ref<Participant[]>([]);
const userToDelete = ref<{ id: number; fullName: string } | null>(null);

const readStoredLotteryWinners = (): Participant[] => {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem("lottery_winners");
    return saved ? (JSON.parse(saved) as Participant[]) : [];
  } catch {
    return [];
  }
};

const mapUserToParticipant = (user: { id: number; firstName: string; lastName: string; email: string; phone: string }): Participant => ({
  id: String(user.id),
  name: `${user.firstName} ${user.lastName}`.trim(),
  dateOfBirth: "",
  email: user.email,
  phone: user.phone,
});

const apiParticipants = computed(() =>
  usersStore.users.map((user) => mapUserToParticipant(user)),
);

const syncLotteryWinnersWithUsers = () => {
  const participantMap = new Map(apiParticipants.value.map((participant) => [participant.id, participant]));

  lotteryWinners.value = lotteryWinners.value
    .filter((winner) => participantMap.has(winner.id))
    .map((winner) => ({
      ...winner,
      ...(participantMap.get(winner.id) ?? {}),
    }));
};

const canPickWinner = computed(
  () =>
    apiParticipants.value.length > 0 &&
    lotteryWinners.value.length < 3 &&
    lotteryWinners.value.length < apiParticipants.value.length,
);

lotteryWinners.value = readStoredLotteryWinners();

const pickLotteryWinner = () => {
  const availableParticipants = apiParticipants.value.filter(
    (participant) =>
      !lotteryWinners.value.some((winner) => winner.id === participant.id),
  );

  if (!availableParticipants.length) return;

  const randomIndex = Math.floor(Math.random() * availableParticipants.length);
  lotteryWinners.value.push(availableParticipants[randomIndex]);
};

const removeLotteryWinner = (id: string) => {
  lotteryWinners.value = lotteryWinners.value.filter((winner) => winner.id !== id);
};

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
    await ServiceProvider.users.delete(userToDelete.value.id);
    usersStore.removeUser(userToDelete.value.id);
    closeDeleteModal();

    const currentPageUsers = usersStore.users.length;
    if (currentPageUsers === 0 && currentPage.value > 1) {
      updateRoute(currentPage.value - 1, searchInput.value);
    }
  } catch (error) {
    alert(error instanceof Error ? error.message : "Помилка видалення");
  }
};

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

watch(
  lotteryWinners,
  (newValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lottery_winners", JSON.stringify(newValue));
    }
  },
  { deep: true },
);

watch(
  apiParticipants,
  () => {
    syncLotteryWinnersWithUsers();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="users-view">
    <section class="lottery-panel">
      <div class="lottery-panel__header">
        <div>
          <p class="lottery-panel__eyebrow">Lottery</p>
          <h2 class="lottery-panel__title">Participants & winners</h2>
        </div>

        <button
          type="button"
          class="lottery-button lottery-button--primary"
          :disabled="!canPickWinner"
          @click="pickLotteryWinner"
        >
          New winner
        </button>
      </div>

      <div class="winner-list">
        <span v-if="lotteryWinners.length === 0" class="winner-list__placeholder">
          No winners yet
        </span>

        <div v-for="winner in lotteryWinners" :key="winner.id" class="winner-chip">
          <span>{{ winner.name }}</span>
          <button
            type="button"
            class="winner-chip__remove"
            aria-label="Remove winner"
            @click="removeLotteryWinner(winner.id)"
          >
            ×
          </button>
        </div>
      </div>
    </section>

    <div class="users-view__header">
      <h1 class="users-view__title">Користувачі</h1>
      <div class="users-view__toolbar">
        <input
          v-model="searchInput"
          @keydown.enter="handleSearch"
          placeholder="Пошук..."
          class="users-view__search"
        />
        <button @click="handleSearch" class="users-view__search-button">
          Знайти
        </button>
        <RouterLink to="/users/new" class="users-view__create-link">
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
              <RouterLink :to="`/users/${user.id}`" class="users-view__details-link">
                Деталі
              </RouterLink>
              <RouterLink :to="`/users/${user.id}/edit`" class="users-view__edit-link">
                Редагувати
              </RouterLink>
              <button
                @click="openDeleteModal(user.id, `${user.firstName} ${user.lastName}`)"
                class="users-view__delete-button"
              >
                Видалити
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="userToDelete" class="users-view__modal-backdrop" @click="closeDeleteModal">
        <div class="users-view__modal" role="dialog" aria-modal="true" @click.stop>
          <h3 class="users-view__modal-title">Підтвердження видалення</h3>
          <p class="users-view__modal-text">
            Ви дійсно бажаєте видалити користувача
            <strong>{{ userToDelete.fullName }}</strong>?
          </p>
          <div class="users-view__modal-actions">
            <button type="button" class="users-view__modal-cancel" @click="closeDeleteModal">
              Скасувати
            </button>
            <button type="button" class="users-view__modal-confirm" @click="deleteUser">
              Видалити
            </button>
          </div>
        </div>
      </div>

      <div class="users-view__pagination">
        <button
          :disabled="currentPage === 1"
          @click="updateRoute(currentPage - 1, searchInput)"
          class="users-view__page-button"
        >
          Попередня
        </button>
        <span class="users-view__page-number">
          Сторінка {{ currentPage }} з {{ totalPages || 1 }}
        </span>
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
  text-align: right;
  padding-right: 1rem;
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
  text-align: left;
  padding-left: 0.5rem;
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

.lottery-panel {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.lottery-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lottery-panel__eyebrow {
  margin: 0 0 0.35rem;
  color: #6366f1;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lottery-panel__title {
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.lottery-button {
  border: none;
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
}

.lottery-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.lottery-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lottery-button--primary {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
}

.winner-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  min-height: 3rem;
}

.winner-list__placeholder {
  color: #6b7280;
  font-size: 0.95rem;
}

.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1d4ed8;
  border-radius: 999px;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
}

.winner-chip__remove {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
}

.users-view__modal-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1000;
}

.users-view__modal {
  width: min(420px, calc(100vw - 2rem));
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
}

.users-view__modal-title {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.users-view__modal-text {
  margin: 0 0 1.5rem;
  line-height: 1.6;
  color: #374151;
}

.users-view__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.users-view__modal-cancel,
.users-view__modal-confirm {
  border: none;
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
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
  .users-view__header,
  .lottery-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .users-view {
    overflow-x: auto;
  }
}
</style>

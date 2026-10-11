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
    } catch (e) {
      alert("Помилка видалення");
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
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Користувачі</h1>
      <div class="flex gap-2">
        <input
          v-model="searchInput"
          @keydown.enter="handleSearch"
          placeholder="Пошук..."
          class="border rounded px-3 py-1 focus:outline-none focus:border-blue-500"
        />
        <button
          @click="handleSearch"
          class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          Знайти
        </button>
      </div>
    </div>

    <div v-if="usersStore.isLoading" class="text-center py-10 text-gray-500">
      Завантаження...
    </div>
    <div v-else-if="usersStore.error" class="text-red-500">
      {{ usersStore.error }}
    </div>

    <div v-else>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b text-sm text-gray-600">
            <th class="py-2 px-2">ID</th>
            <th class="py-2 px-2">Ім'я</th>
            <th class="py-2 px-2">Email</th>
            <th class="py-2 px-2 text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in usersStore.users"
            :key="user.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="py-3 px-2">{{ user.id }}</td>
            <td class="py-3 px-2">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="py-3 px-2">{{ user.email }}</td>
            <td class="py-3 px-2 text-right space-x-2">
              <RouterLink
                :to="`/users/${user.id}`"
                class="text-blue-500 hover:underline"
                >Деталі</RouterLink
              >
              <RouterLink
                :to="`/users/${user.id}/edit`"
                class="text-green-500 hover:underline"
                >Редагувати</RouterLink
              >
              <button
                @click="deleteUser(user.id)"
                class="text-red-500 hover:underline"
              >
                Видалити
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Пагінація -->
      <div class="flex justify-between items-center mt-6">
        <button
          :disabled="currentPage === 1"
          @click="updateRoute(currentPage - 1, searchInput)"
          class="px-4 py-2 bg-gray-100 rounded transition-colors hover:bg-gray-200 disabled:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Попередня
        </button>
        <span class="text-sm"
          >Сторінка {{ currentPage }} з {{ totalPages || 1 }}</span
        >
        <button
          :disabled="currentPage >= totalPages"
          @click="updateRoute(currentPage + 1, searchInput)"
          class="px-4 py-2 bg-gray-100 rounded transition-colors hover:bg-gray-200 disabled:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Наступна
        </button>
      </div>
    </div>
  </div>
</template>

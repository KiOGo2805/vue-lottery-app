import { defineStore } from "pinia";
import { ref } from "vue";
import { ServiceProvider } from "../services/service-provider";
import type { User } from "../types/user";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref("");

  const fetchUsers = async (limit: number, skip: number, q: string) => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await ServiceProvider.users.getAll({ limit, skip, q });
      users.value = res.items;
      total.value = res.total;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  const removeUser = (id: number) => {
    users.value = users.value.filter((u) => u.id !== id);
    total.value--;
  };

  const updateUser = (updatedUser: User) => {
    const index = users.value.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = updatedUser;
    }
  };

  return { users, total, isLoading, error, fetchUsers, removeUser, updateUser };
});

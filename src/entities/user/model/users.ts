import { defineStore } from "pinia";
import { ref } from "vue";
import { ServiceProvider } from "../services/service-provider";
import type { User } from "../types/user";

export const useUsersStore = defineStore("users", () => {
  const users = ref<User[]>([]);
  const total = ref(0);
  const isLoading = ref(false);
  const error = ref("");
  const createdUsers = ref<User[]>([]);
  const updatedUsers = ref(new Map<number, User>());
  const deletedUsers = ref(new Map<number, User>());

  const matchesQuery = (user: User, q: string) =>
    [
      user.firstName,
      user.lastName,
      user.email,
      user.username,
      user.phone,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q.toLowerCase());

  const fetchUsers = async (limit: number, skip: number, q: string) => {
    isLoading.value = true;
    error.value = "";
    try {
      const res = await ServiceProvider.users.getAll({ limit, skip, q });
      const serverUsers = res.items
        .filter((user) => !deletedUsers.value.has(user.id))
        .map((user) => updatedUsers.value.get(user.id) ?? user);
      const matchingCreatedUsers = createdUsers.value.filter((user) =>
        matchesQuery(user, q),
      );
      const isLastServerPage = skip + res.items.length >= res.total;
      const visibleUsers = isLastServerPage
        ? [...serverUsers, ...matchingCreatedUsers]
        : serverUsers;

      users.value = visibleUsers
        .sort((left, right) => left.id - right.id)
        .slice(0, limit);
      total.value = Math.max(
        0,
        res.total +
          matchingCreatedUsers.length -
          [...deletedUsers.value.values()].filter((user) =>
            matchesQuery(user, q),
          ).length,
      );
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Не вдалося завантажити користувачів";
    } finally {
      isLoading.value = false;
    }
  };

  const removeUser = (id: number) => {
    const user = users.value.find((item) => item.id === id);
    if (!user) return;

    const createdIndex = createdUsers.value.findIndex(
      (item) => item.id === id,
    );
    if (createdIndex !== -1) {
      createdUsers.value.splice(createdIndex, 1);
    } else {
      deletedUsers.value.set(id, user);
    }
    updatedUsers.value.delete(id);
    users.value = users.value.filter((u) => u.id !== id);
    total.value = Math.max(0, total.value - 1);
  };

  const updateUser = (updatedUser: User) => {
    const createdIndex = createdUsers.value.findIndex(
      (user) => user.id === updatedUser.id,
    );
    const existingUser =
      createdUsers.value[createdIndex] ??
      updatedUsers.value.get(updatedUser.id) ??
      users.value.find((user) => user.id === updatedUser.id);
    const mergedUser = { ...existingUser, ...updatedUser };

    if (createdIndex !== -1) {
      createdUsers.value[createdIndex] = mergedUser;
    } else {
      updatedUsers.value.set(updatedUser.id, mergedUser);
    }

    const index = users.value.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users.value[index] = mergedUser;
    }
  };

  const addUser = (user: User) => {
    const alreadyCreated = createdUsers.value.some(
      (item) => item.id === user.id,
    );
    deletedUsers.value.delete(user.id);
    updatedUsers.value.delete(user.id);
    if (!alreadyCreated) {
      createdUsers.value = [...createdUsers.value, user];
      total.value += 1;
    }
  };

  return {
    users,
    total,
    isLoading,
    error,
    fetchUsers,
    addUser,
    removeUser,
    updateUser,
  };
});

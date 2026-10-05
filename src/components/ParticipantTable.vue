<script setup lang="ts">
import { ref, computed } from "vue";
import type { Participant } from "../types";
import SearchBar from "./SearchBar.vue";
import BaseButton from "./UI/BaseButton.vue";

const props = defineProps<{
  participants: Participant[];
}>();

const emit = defineEmits<{
  (e: "edit", participant: Participant): void;
  (e: "delete", participant: Participant): void;
}>();

const searchQuery = ref("");
const sortKey = ref<"name" | "dateOfBirth" | null>(null);
const sortOrder = ref<"asc" | "desc">("asc");

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const toggleSort = (key: "name" | "dateOfBirth") => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const filteredAndSorted = computed(() => {
  let result = props.participants.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );

  if (sortKey.value) {
    result = result.sort((a, b) => {
      let valA = a[sortKey.value as keyof Participant].toLowerCase();
      let valB = b[sortKey.value as keyof Participant].toLowerCase();

      if (valA < valB) return sortOrder.value === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder.value === "asc" ? 1 : -1;
      return 0;
    });
  }
  return result;
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
    <div class="flex justify-between items-center mb-4">
      <SearchBar @filter-by-name="handleSearch" />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-max">
        <thead>
          <tr class="border-b text-gray-600 font-semibold text-sm">
            <th class="py-3 px-4">#</th>
            <th
              class="py-3 px-4 cursor-pointer hover:bg-gray-50 select-none"
              @click="toggleSort('name')"
            >
              Name
              <span v-if="sortKey === 'name'" class="ml-1">{{
                sortOrder === "asc" ? "↑" : "↓"
              }}</span>
            </th>
            <th
              class="py-3 px-4 cursor-pointer hover:bg-gray-50 select-none"
              @click="toggleSort('dateOfBirth')"
            >
              Date of Birth
              <span v-if="sortKey === 'dateOfBirth'" class="ml-1">{{
                sortOrder === "asc" ? "↑" : "↓"
              }}</span>
            </th>
            <th class="py-3 px-4">Email</th>
            <th class="py-3 px-4">Phone number</th>
            <th class="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, index) in filteredAndSorted"
            :key="p.id"
            class="border-b hover:bg-gray-50 text-sm"
          >
            <td class="py-3 px-4">{{ index + 1 }}</td>
            <td class="py-3 px-4">{{ p.name }}</td>
            <td class="py-3 px-4">{{ p.dateOfBirth }}</td>
            <td class="py-3 px-4">{{ p.email }}</td>
            <td class="py-3 px-4">{{ p.phone }}</td>
            <td class="py-3 px-4 text-center space-x-2">
              <BaseButton variant="secondary" @click="$emit('edit', p)"
                >Edit</BaseButton
              >
              <BaseButton variant="danger" @click="$emit('delete', p)"
                >Delete</BaseButton
              >
            </td>
          </tr>
          <tr v-if="filteredAndSorted.length === 0">
            <td colspan="6" class="py-8 text-center text-gray-500">
              No participants found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

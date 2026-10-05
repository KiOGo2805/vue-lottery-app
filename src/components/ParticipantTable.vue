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
  <div class="participant-table">
    <div class="participant-table__header">
      <SearchBar @filter-by-name="handleSearch" />
    </div>

    <div class="participant-table__scroll">
      <table class="participant-table__table">
        <thead>
          <tr class="participant-table__head-row">
            <th class="participant-table__cell">#</th>
            <th
              class="participant-table__cell participant-table__sort"
              @click="toggleSort('name')"
            >
              Name
              <span v-if="sortKey === 'name'" class="participant-table__sort-indicator">{{
                sortOrder === "asc" ? "↑" : "↓"
              }}</span>
            </th>
            <th
              class="participant-table__cell participant-table__sort"
              @click="toggleSort('dateOfBirth')"
            >
              Date of Birth
              <span v-if="sortKey === 'dateOfBirth'" class="participant-table__sort-indicator">{{
                sortOrder === "asc" ? "↑" : "↓"
              }}</span>
            </th>
            <th class="participant-table__cell">Email</th>
            <th class="participant-table__cell">Phone number</th>
            <th class="participant-table__cell participant-table__cell--actions">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, index) in filteredAndSorted"
            :key="p.id"
            class="participant-table__row"
          >
            <td class="participant-table__cell">{{ index + 1 }}</td>
            <td class="participant-table__cell">{{ p.name }}</td>
            <td class="participant-table__cell">{{ p.dateOfBirth }}</td>
            <td class="participant-table__cell">{{ p.email }}</td>
            <td class="participant-table__cell">{{ p.phone }}</td>
            <td class="participant-table__cell participant-table__cell--actions">
              <BaseButton variant="secondary" @click="$emit('edit', p)"
                >Edit</BaseButton
              >
              <BaseButton variant="danger" @click="$emit('delete', p)"
                >Delete</BaseButton
              >
            </td>
          </tr>
          <tr v-if="filteredAndSorted.length === 0">
            <td colspan="6" class="participant-table__empty">
              No participants found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.participant-table {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.participant-table__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.participant-table__scroll {
  overflow-x: auto;
}

.participant-table__table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: max-content;
}

.participant-table__head-row {
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 600;
}

.participant-table__cell {
  padding: 0.75rem 1rem;
}

.participant-table__sort {
  cursor: pointer;
  user-select: none;
}

.participant-table__sort:hover {
  background: #f9fafb;
}

.participant-table__sort-indicator {
  margin-left: 0.25rem;
}

.participant-table__row {
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.participant-table__row:hover {
  background: #f9fafb;
}

.participant-table__cell--actions {
  text-align: center;
}

.participant-table__cell--actions :deep(button + button) {
  margin-left: 0.5rem;
}

.participant-table__empty {
  padding: 2rem 1rem;
  text-align: center;
  color: #6b7280;
}
</style>

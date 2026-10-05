<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (e: "filter-by-name", value: string): void;
}>();

const query = ref("");
let timeout: ReturnType<typeof setTimeout>;

watch(query, (newValue) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit("filter-by-name", newValue);
  }, 300);
});
</script>

<template>
  <div class="search-bar">
    <input
      v-model="query"
      type="text"
      placeholder="Search by name..."
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 28rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #3b82f6;
}
</style>

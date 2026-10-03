<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (e: "filter-by-name", value: string): void;
}>();

const query = ref("");
let timeout: ReturnType<typeof setTimeout>;

// Реалізація debounce за допомогою watch з затримкою 300 мс
watch(query, (newValue) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    emit("filter-by-name", newValue);
  }, 300);
});
</script>

<template>
  <div class="mb-4">
    <input
      v-model="query"
      type="text"
      placeholder="Search by name..."
      class="border border-gray-300 rounded px-4 py-2 w-full max-w-md focus:outline-none focus:border-blue-500"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "./UI/BaseButton.vue";
import type { Participant } from "../types";

const props = defineProps<{
  winners: Participant[];
  participants: Participant[];
}>();

const emit = defineEmits<{
  (e: "pick-winner"): void;
  (e: "remove-winner", id: string): void;
}>();

const isNewWinnerDisabled = computed(() => {
  if (props.winners.length >= 3) return true;
  if (props.participants.length === 0) return true;
  if (props.winners.length === props.participants.length) return true;
  return false;
});
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between mb-6"
  >
    <div class="flex items-center space-x-2 overflow-x-auto w-full mr-4">
      <span
        class="text-gray-400 text-sm mr-2 select-none"
        v-if="winners.length === 0"
        >Winners</span
      >

      <div
        v-for="winner in winners"
        :key="winner.id"
        class="flex items-center bg-blue-500 text-white px-3 py-1 rounded shadow-sm text-sm"
      >
        <span>{{ winner.name }}</span>
        <button
          @click="$emit('remove-winner', winner.id)"
          class="ml-2 text-white hover:text-gray-200 focus:outline-none font-bold"
          aria-label="Remove winner"
        >
          &#x2715;
        </button>
      </div>
    </div>

    <BaseButton
      variant="primary"
      :disabled="isNewWinnerDisabled"
      @click="$emit('pick-winner')"
      class="whitespace-nowrap"
    >
      New winner
    </BaseButton>
  </div>
</template>

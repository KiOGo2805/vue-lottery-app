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
  <div class="winners-block">
    <div class="winners-block__list">
      <span v-if="winners.length === 0" class="winners-block__placeholder"
        >Winners</span
      >

      <div v-for="winner in winners" :key="winner.id" class="winner-pill">
        <span>{{ winner.name }}</span>
        <button
          @click="$emit('remove-winner', winner.id)"
          class="winner-pill__remove"
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
      class="winners-block__button"
    >
      New winner
    </BaseButton>
  </div>
</template>

<style scoped>
.winners-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  padding: 1rem;
}

.winners-block__list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  width: 100%;
  margin-right: 1rem;
}

.winners-block__placeholder {
  margin-right: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
  user-select: none;
}

.winner-pill {
  display: flex;
  align-items: center;
  background: #3b82f6;
  color: #fff;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  box-shadow: 0 1px 2px rgba(59, 130, 246, 0.2);
  font-size: 0.875rem;
}

.winner-pill__remove {
  margin-left: 0.5rem;
  border: none;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-weight: 700;
}

.winner-pill__remove:hover {
  color: #e5e7eb;
}

.winners-block__button {
  white-space: nowrap;
}
</style>

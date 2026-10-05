<script setup lang="ts">
defineProps<{
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    :class="['base-button', `base-button--${variant || 'primary'}`, { 'is-disabled': disabled }]"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  color: #fff;
  transition: background-color 0.2s ease, cursor 0.2s ease;
  cursor: pointer;
}

.base-button--primary {
  background-color: #3b82f6;
}

.base-button--primary:not(.is-disabled):hover {
  background-color: #2563eb;
}

.base-button--secondary {
  background-color: #6b7280;
}

.base-button--secondary:not(.is-disabled):hover {
  background-color: #4b5563;
}

.base-button--danger {
  background-color: #ef4444;
}

.base-button--danger:not(.is-disabled):hover {
  background-color: #dc2626;
}

.is-disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
</style>

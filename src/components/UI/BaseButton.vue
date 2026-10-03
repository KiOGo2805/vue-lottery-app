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
    class="px-4 py-2 rounded font-semibold text-white transition-colors duration-200"
    :class="{
      'bg-blue-500 hover:bg-blue-600': variant === 'primary' && !disabled,
      'bg-gray-500 hover:bg-gray-600': variant === 'secondary' && !disabled,
      'bg-red-500 hover:bg-red-600': variant === 'danger' && !disabled,
      'bg-blue-300 cursor-not-allowed': disabled,
    }"
  >
    <slot />
  </button>
</template>

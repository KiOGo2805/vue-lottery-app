<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number;
  label?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="field">
    <label v-if="label" :for="id" class="field-label">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      :class="['field-input', { 'field-input--error': error }]"
    />
    <span v-if="error" class="field-error">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field-label {
  margin-bottom: 0.25rem;
  font-weight: 700;
  color: #374151;
}

.field-input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.field-input:focus {
  border-color: #3b82f6;
}

.field-input--error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.field-error {
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.875rem;
}
</style>

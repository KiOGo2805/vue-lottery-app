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
  <div class="flex flex-col mb-4">
    <label v-if="label" :for="id" class="mb-1 font-bold text-gray-700">
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type || 'text'"
      :value="modelValue"
      @input="updateValue"
      :placeholder="placeholder"
      class="border rounded px-3 py-2 outline-none transition-colors"
      :class="{
        'border-red-500 bg-red-50': error,
        'border-gray-300 focus:border-blue-500': !error,
      }"
    />
    <span v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </span>
  </div>
</template>

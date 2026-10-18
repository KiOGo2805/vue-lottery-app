<script setup lang="ts">
import InputText from "primevue/inputtext";

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    errorMessage?: string;
    as?: "input" | "select";
  }>(),
  { as: "input" },
);

const model = defineModel<string | null>();
</script>

<template>
  <div class="app-input">
    <InputText
      v-if="as === 'input'"
      v-model="model"
      v-bind="$attrs"
      unstyled
      :aria-invalid="Boolean(errorMessage)"
      :aria-describedby="errorMessage ? `${$attrs.id ?? $attrs.name}-error` : undefined"
    />
    <select
      v-else
      v-bind="$attrs"
      :value="model ?? ''"
      :aria-invalid="Boolean(errorMessage)"
      :aria-describedby="errorMessage ? `${$attrs.id ?? $attrs.name}-error` : undefined"
      @change="model = ($event.target as HTMLSelectElement).value"
    >
      <slot />
    </select>
    <small
      v-if="errorMessage"
      :id="`${$attrs.id ?? $attrs.name}-error`"
      class="app-input__error"
      role="alert"
    >
      {{ errorMessage }}
    </small>
  </div>
</template>

<style scoped>
.app-input {
  display: grid;
  gap: 0.25rem;
}

.app-input__error {
  color: #dc2626;
  font-size: 0.75rem;
}
</style>

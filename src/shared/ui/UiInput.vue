<script setup lang="ts">
import InputText from "primevue/inputtext";

defineOptions({ inheritAttrs: false });

const model = defineModel<string | null>();
</script>

<template>
  <InputText v-model="model" v-bind="$attrs" unstyled />
</template>

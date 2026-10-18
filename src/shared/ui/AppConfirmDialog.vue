<script setup lang="ts">
import { watch } from "vue";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    message: string;
    header?: string;
  }>(),
  { header: "Підтвердження дії" },
);

const emit = defineEmits<{
  accept: [];
  reject: [];
}>();

const confirm = useConfirm();

watch(
  () => props.visible,
  (visible) => {
    if (!visible) return;

    confirm.require({
      group: "app-confirm",
      header: props.header,
      message: props.message,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Підтвердити",
      rejectLabel: "Скасувати",
      accept: () => emit("accept"),
      reject: () => emit("reject"),
    });
  },
);
</script>

<template>
  <ConfirmDialog group="app-confirm" />
</template>

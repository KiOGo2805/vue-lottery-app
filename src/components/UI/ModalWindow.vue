<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
  isOpen: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("close");
  }
};

onMounted(() => document.addEventListener("keydown", handleKeydown));
onUnmounted(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative"
        >
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            &#x2715;
          </button>

          <h3 v-if="title" class="text-xl font-bold mb-4">{{ title }}</h3>

          <div class="mb-6">
            <slot></slot>
          </div>

          <div class="flex justify-end space-x-2">
            <slot name="footer">
              <BaseButton variant="secondary" @click="$emit('close')"
                >Cancel</BaseButton
              >
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

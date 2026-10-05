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
      <div v-if="isOpen" class="modal-backdrop">
        <div class="modal-window">
          <button @click="$emit('close')" class="modal-close" aria-label="Close">
            &#x2715;
          </button>

          <h3 v-if="title" class="modal-title">{{ title }}</h3>

          <div class="modal-content">
            <slot></slot>
          </div>

          <div class="modal-footer">
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
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-window {
  position: relative;
  width: 100%;
  max-width: 28rem;
  margin: 0 1rem;
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 20px 30px rgba(15, 23, 42, 0.15);
  padding: 1.5rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.125rem;
}

.modal-close:hover {
  color: #374151;
}

.modal-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.modal-content {
  margin-bottom: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

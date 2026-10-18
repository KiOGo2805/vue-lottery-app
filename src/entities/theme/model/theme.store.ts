import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const isDark = ref(false);

    watch(
      isDark,
      (dark) => {
        document.documentElement.classList.toggle("app-dark", dark);
      },
      { immediate: true },
    );

    const toggleTheme = () => {
      isDark.value = !isDark.value;
    };

    return { isDark, toggleTheme };
  },
  { persist: true },
);

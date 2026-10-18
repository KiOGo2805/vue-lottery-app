import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AuthService } from "../api/auth.service";
import { ServiceProvider } from "../../../shared/api";
import type { LoginCredentials } from "./auth";
import type { User } from "../../../shared/model";
import type { AuthResponse } from "./auth";

const sessionStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => {
    if (!value || value === "null") {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, value);
  },
};

export const useSessionStore = defineStore("session", () => {
  const authService = ServiceProvider.get<AuthService>("auth");
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  const setSession = (session: AuthResponse) => {
    accessToken.value = session.accessToken;
    refreshToken.value = session.refreshToken;
    user.value = session;
  };

  const clearSession = () => {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    setSession(response);
  };

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    setSession,
    clearSession,
    login,
  };
}, {
  persist: [
    {
      key: "accessToken",
      storage: sessionStorage,
      pick: ["accessToken"],
      serializer: {
        serialize: (state) => String(state.accessToken ?? ""),
        deserialize: (value) => ({ accessToken: value || null }),
      },
    },
    {
      key: "refreshToken",
      storage: sessionStorage,
      pick: ["refreshToken"],
      serializer: {
        serialize: (state) => String(state.refreshToken ?? ""),
        deserialize: (value) => ({ refreshToken: value || null }),
      },
    },
    {
      key: "user",
      storage: sessionStorage,
      pick: ["user"],
      serializer: {
        serialize: (state) =>
          JSON.stringify(
            state.user && {
              id: state.user.id,
              firstName: state.user.firstName,
              lastName: state.user.lastName,
              email: state.user.email,
              image: state.user.image,
            },
          ),
        deserialize: (value) => ({ user: JSON.parse(value) as User | null }),
      },
    },
  ],
});

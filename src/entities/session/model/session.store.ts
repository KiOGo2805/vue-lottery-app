import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { AuthService } from "../api/auth.service";
import type { LoginCredentials } from "./auth";
import type { User } from "../../../shared/model";

export const useSessionStore = defineStore("session", () => {
  const authService = new AuthService();
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(localStorage.getItem("accessToken"));

  const isAuthenticated = computed(() => !!accessToken.value);

  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    user.value = JSON.parse(savedUser);
  }

  const login = async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);

    accessToken.value = response.accessToken;
    user.value = response;

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        image: response.image,
      }),
    );
  };

  const logout = () => {
    accessToken.value = null;
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
  };
});

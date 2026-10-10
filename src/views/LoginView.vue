<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const apiError = ref("");
const isLoading = ref(false);

// Схема валідації yup
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const handleLogin = async (values: any) => {
  apiError.value = "";
  isLoading.value = true;

  try {
    await auth.login({
      username: values.username,
      password: values.password,
    });

    // Повертаємо юзера туди, куди він хотів зайти, або на /users
    const redirectPath = (route.query.redirect as string) || "/users";
    router.push(redirectPath);
  } catch (error: any) {
    apiError.value = error.message || "Invalid username or password";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-8 rounded-lg shadow-md">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Welcome Back</h1>
      <p class="text-gray-500 text-sm mt-2">Sign in to access the users list</p>
      <!-- Тестові дані для зручності -->
      <p class="text-xs text-blue-500 mt-1">
        Hint: use <b>emilys</b> / <b>emilyspass</b>
      </p>
    </div>

    <!-- Компонент Form з vee-validate -->
    <Form @submit="handleLogin" :validation-schema="schema" class="space-y-4">
      <div>
        <label for="username" class="block font-semibold mb-1 text-gray-700"
          >Username</label
        >
        <Field
          name="username"
          type="text"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter username"
        />
        <ErrorMessage name="username" class="text-red-500 text-sm mt-1 block" />
      </div>

      <div>
        <label for="password" class="block font-semibold mb-1 text-gray-700"
          >Password</label
        >
        <Field
          name="password"
          type="password"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter password"
        />
        <ErrorMessage name="password" class="text-red-500 text-sm mt-1 block" />
      </div>

      <div
        v-if="apiError"
        class="bg-red-50 text-red-500 p-3 rounded text-sm text-center"
      >
        {{ apiError }}
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300 flex justify-center"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Login</span>
      </button>
    </Form>

    <div class="mt-6 text-center">
      <RouterLink to="/" class="text-sm text-gray-500 hover:text-blue-500">
        &larr; Back to Home
      </RouterLink>
    </div>
  </div>
</template>

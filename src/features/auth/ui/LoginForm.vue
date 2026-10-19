<script setup lang="ts">
import { ref } from "vue";
import { Form, Field, type GenericObject } from "vee-validate";
import * as yup from "yup";
import { useSessionStore } from "../../../entities/session";
import { AppButton, AppInput, useAppToast } from "../../../shared/ui";

const emit = defineEmits<{ authenticated: [] }>();
const auth = useSessionStore();
const toast = useAppToast();

const apiError = ref("");
const isLoading = ref(false);

const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const handleLogin = async (values: GenericObject) => {
  apiError.value = "";
  isLoading.value = true;

  try {
    const credentials = await schema.validate(values);
    await auth.login(credentials);
    emit("authenticated");
  } catch (error) {
    apiError.value =
      error instanceof Error ? error.message : "Invalid username or password";
    toast.error("Помилка авторизації", apiError.value);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="login-view">
    <div class="login-view__intro">
      <h1 class="login-view__title">Welcome Back</h1>
      <p class="login-view__subtitle">Sign in to access the users list</p>
      <p class="login-view__hint">
        Hint: use <b>emilys</b> / <b>emilyspass</b>
      </p>
    </div>

    <Form
      @submit="handleLogin"
      :validation-schema="schema"
      class="login-view__form"
    >
      <div class="login-view__field-group">
        <label for="username" class="login-view__label">Username</label>
        <Field name="username" v-slot="{ field, errorMessage }">
          <AppInput
            v-bind="field"
            type="text"
            class="login-view__input"
            placeholder="Enter username"
            :error-message="errorMessage"
          />
        </Field>
      </div>

      <div class="login-view__field-group">
        <label for="password" class="login-view__label">Password</label>
        <Field name="password" v-slot="{ field, errorMessage }">
          <AppInput
            v-bind="field"
            type="password"
            class="login-view__input"
            placeholder="Enter password"
            :error-message="errorMessage"
          />
        </Field>
      </div>

      <div v-if="apiError" class="login-view__api-error">
        {{ apiError }}
      </div>

      <AppButton type="submit" :disabled="isLoading" class="login-view__submit">
        <span v-if="isLoading">Loading...</span>
        <span v-else>Login</span>
      </AppButton>
    </Form>

    <div class="login-view__footer">
      <RouterLink to="/" class="login-view__home-link">
        &larr; Back to Home
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  padding: 2rem;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 10%);
}

.login-view__intro {
  margin-bottom: 2rem;
  text-align: center;
}

.login-view__title {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2rem;
}

.login-view__subtitle {
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.login-view__hint {
  margin: 0.25rem 0 0;
  color: #3b82f6;
  font-size: 0.75rem;
}

.login-view :deep(.login-view__form) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-view__label {
  display: block;
  margin-bottom: 0.25rem;
  color: #374151;
  font-weight: 600;
}

.login-view :deep(.login-view__input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.login-view :deep(.login-view__input:focus) {
  border-color: #3b82f6;
  outline: none;
}

.login-view :deep(.login-view__field-error) {
  display: block;
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.login-view__api-error {
  padding: 0.75rem;
  border-radius: 0.25rem;
  background: #fef2f2;
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
}

.login-view__submit {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 0.25rem;
  background: #3b82f6;
  color: #fff;
  font-weight: 700;
  transition: background-color 150ms;
  cursor: pointer;
}

.login-view__submit:hover {
  background: #2563eb;
}

.login-view__submit:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.login-view__footer {
  margin-top: 1.5rem;
  text-align: center;
}

.login-view__home-link {
  color: #6b7280;
  font-size: 0.875rem;
}

.login-view__home-link:hover {
  color: #3b82f6;
}
</style>

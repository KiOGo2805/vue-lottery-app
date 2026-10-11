<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ErrorMessage, Field, Form, type GenericObject } from "vee-validate";
import { ServiceProvider } from "../services/service-provider";
import { useUsersStore } from "../stores/users";
import { userSchema } from "../validation/user";

const router = useRouter();
const usersStore = useUsersStore();
const apiError = ref("");
const isSaving = ref(false);
const usersPerPage = 10;

const onSubmit = async (values: GenericObject) => {
  apiError.value = "";
  isSaving.value = true;
  try {
    const validatedValues = await userSchema.validate(values);
    const createdUser = await ServiceProvider.users.create(validatedValues);
    usersStore.addUser(createdUser);
    const lastPage = Math.max(1, Math.ceil(usersStore.total / usersPerPage));
    await router.push({ name: "users", query: { page: lastPage } });
  } catch (error) {
    apiError.value =
      error instanceof Error ? error.message : "Не вдалося створити користувача";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="mx-auto max-w-xl rounded border bg-white p-6 shadow-sm">
    <h1 class="mb-6 text-2xl font-bold">Створити користувача</h1>

    <Form
      :validation-schema="userSchema"
      @submit="onSubmit"
      class="space-y-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="mb-1 block text-sm font-semibold"
            >Ім'я</label
          >
          <Field
            id="firstName"
            name="firstName"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage
            name="firstName"
            class="mt-1 text-xs text-red-500"
          />
        </div>
        <div>
          <label for="lastName" class="mb-1 block text-sm font-semibold"
            >Прізвище</label
          >
          <Field
            id="lastName"
            name="lastName"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage name="lastName" class="mt-1 text-xs text-red-500" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="email" class="mb-1 block text-sm font-semibold"
            >Email</label
          >
          <Field
            id="email"
            name="email"
            type="email"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage name="email" class="mt-1 text-xs text-red-500" />
        </div>
        <div>
          <label for="phone" class="mb-1 block text-sm font-semibold"
            >Телефон</label
          >
          <Field
            id="phone"
            name="phone"
            type="tel"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage name="phone" class="mt-1 text-xs text-red-500" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label for="username" class="mb-1 block text-sm font-semibold"
            >Username</label
          >
          <Field
            id="username"
            name="username"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage name="username" class="mt-1 text-xs text-red-500" />
        </div>
        <div>
          <label for="password" class="mb-1 block text-sm font-semibold"
            >Пароль</label
          >
          <Field
            id="password"
            name="password"
            type="password"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage name="password" class="mt-1 text-xs text-red-500" />
        </div>
        <div>
          <label for="age" class="mb-1 block text-sm font-semibold">Вік</label>
          <Field
            id="age"
            name="age"
            type="number"
            class="w-full rounded border px-3 py-2"
          />
          <ErrorMessage name="age" class="mt-1 text-xs text-red-500" />
        </div>
      </div>

      <div>
        <label for="gender" class="mb-1 block text-sm font-semibold"
          >Стать</label
        >
        <Field
          id="gender"
          name="gender"
          as="select"
          class="w-full rounded border px-3 py-2"
        >
          <option value="" disabled>Оберіть стать</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Field>
        <ErrorMessage name="gender" class="mt-1 text-xs text-red-500" />
      </div>

      <div
        v-if="apiError"
        role="alert"
        class="rounded bg-red-50 p-3 text-sm text-red-600"
      >
        {{ apiError }}
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <RouterLink
          to="/users"
          class="rounded border px-4 py-2 hover:bg-gray-50"
          >Скасувати</RouterLink
        >
        <button
          type="submit"
          :disabled="isSaving"
          class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isSaving ? "Створення..." : "Створити" }}
        </button>
      </div>
    </Form>
  </div>
</template>

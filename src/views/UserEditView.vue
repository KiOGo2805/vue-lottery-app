<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Form,
  Field,
  ErrorMessage,
  type GenericObject,
} from "vee-validate";
import { ServiceProvider } from "../services/service-provider";
import { useUsersStore } from "../stores/users";
import type { User } from "../types/user";
import { userSchema } from "../validation/user";

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();

const initialData = ref<Partial<User>>({});
const isLoading = ref(true);
const isSaving = ref(false);
const apiError = ref("");

onMounted(async () => {
  try {
    const user = await ServiceProvider.users.getById(Number(props.id));
    initialData.value = user;
  } catch (error) {
    apiError.value =
      error instanceof Error
        ? error.message
        : "Не вдалося завантажити користувача";
  } finally {
    isLoading.value = false;
  }
});

const onSubmit = async (values: GenericObject) => {
  apiError.value = "";
  isSaving.value = true;
  try {
    const validatedValues = await userSchema.validate(values);
    const updatedUser = await ServiceProvider.users.update(
      Number(props.id),
      validatedValues,
    );
    usersStore.updateUser(updatedUser); // Оновлюємо кеш
    router.push("/users"); // Повертаємось до таблиці
  } catch (error) {
    apiError.value =
      error instanceof Error
        ? error.message
        : "Не вдалося зберегти користувача";
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Редагувати користувача</h1>

    <div v-if="isLoading">Завантаження...</div>
    <div
      v-else-if="apiError && !initialData.id"
      role="alert"
      class="rounded bg-red-50 p-3 text-sm text-red-600"
    >
      {{ apiError }}
    </div>

    <Form
      v-else
      @submit="onSubmit"
      :validation-schema="userSchema"
      :initial-values="initialData"
      class="space-y-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold mb-1">Ім'я</label>
          <Field name="firstName" class="w-full border rounded px-3 py-2" />
          <ErrorMessage name="firstName" class="text-red-500 text-xs mt-1" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Прізвище</label>
          <Field name="lastName" class="w-full border rounded px-3 py-2" />
          <ErrorMessage name="lastName" class="text-red-500 text-xs mt-1" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold mb-1">Email</label>
          <Field
            name="email"
            type="email"
            class="w-full border rounded px-3 py-2"
          />
          <ErrorMessage name="email" class="text-red-500 text-xs mt-1" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Телефон</label>
          <Field name="phone" class="w-full border rounded px-3 py-2" />
          <ErrorMessage name="phone" class="text-red-500 text-xs mt-1" />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold mb-1">Username</label>
          <Field name="username" class="w-full border rounded px-3 py-2" />
          <ErrorMessage name="username" class="text-red-500 text-xs mt-1" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Пароль</label>
          <Field
            name="password"
            type="password"
            class="w-full border rounded px-3 py-2"
          />
          <ErrorMessage name="password" class="text-red-500 text-xs mt-1" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Вік</label>
          <Field
            name="age"
            type="number"
            class="w-full border rounded px-3 py-2"
          />
          <ErrorMessage name="age" class="text-red-500 text-xs mt-1" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">Стать</label>
          <Field
            name="gender"
            as="select"
            class="w-full border rounded px-3 py-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Field>
          <ErrorMessage name="gender" class="text-red-500 text-xs mt-1" />
        </div>
      </div>

      <div
        v-if="apiError"
        role="alert"
        class="rounded bg-red-50 p-3 text-sm text-red-600"
      >
        {{ apiError }}
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <RouterLink
          to="/users"
          class="px-4 py-2 border rounded hover:bg-gray-50"
          >Скасувати</RouterLink
        >
        <button
          type="submit"
          :disabled="isSaving"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isSaving ? "Збереження..." : "Зберегти" }}
        </button>
      </div>
    </Form>
  </div>
</template>

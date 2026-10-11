<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { ServiceProvider } from "../services/service-provider";
import { useUsersStore } from "../stores/users";
import type { User } from "../types/user";

const props = defineProps<{ id: string }>();
const router = useRouter();
const usersStore = useUsersStore();

const initialData = ref<Partial<User>>({});
const isLoading = ref(true);
const isSaving = ref(false);

const schema = yup.object({
  firstName: yup.string().required("Ім'я обов'язкове"),
  lastName: yup.string().required("Прізвище обов'язкове"),
  email: yup.string().email("Некоректний email").required("Email обов'язковий"),
  username: yup.string().required("Username обов'язковий"),
  age: yup.number().typeError("Має бути числом").required("Вік обов'язковий"),
  gender: yup.string().required("Стать обов'язкова"),
  phone: yup.string().required("Телефон обов'язковий"),
});

onMounted(async () => {
  try {
    const user = await ServiceProvider.users.getById(Number(props.id));
    initialData.value = user;
  } catch (e) {
    alert("Помилка завантаження");
  } finally {
    isLoading.value = false;
  }
});

const onSubmit = async (values: any) => {
  isSaving.value = true;
  try {
    const updatedUser = await ServiceProvider.users.update(
      Number(props.id),
      values,
    );
    usersStore.updateUser(updatedUser); // Оновлюємо кеш
    router.push("/users"); // Повертаємось до таблиці
  } catch (e) {
    alert("Помилка збереження");
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="bg-white p-6 rounded shadow-sm border max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Редагувати користувача</h1>

    <div v-if="isLoading">Завантаження...</div>

    <Form
      v-else
      @submit="onSubmit"
      :validation-schema="schema"
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

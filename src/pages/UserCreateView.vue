<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ErrorMessage, Field, Form, type GenericObject } from "vee-validate";
import { ServiceProvider } from "../shared/api/service-provider";
import { useUsersStore } from "../entities/user/model/users.store";
import { userSchema } from "../entities/user/model/user.validation";
import UiButton from "../shared/ui/UiButton.vue";

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
  <div class="user-create">
    <h1 class="user-create__title">Створити користувача</h1>

    <Form
      :validation-schema="userSchema"
      @submit="onSubmit"
      class="user-create__form"
    >
      <div class="user-create__row">
        <div class="user-create__field">
          <label for="firstName" class="user-create__label"
            >Ім'я</label
          >
          <Field
            id="firstName"
            name="firstName"
            class="user-create__input"
          />
          <ErrorMessage name="firstName" class="user-create__field-error" />
        </div>
        <div class="user-create__field">
          <label for="lastName" class="user-create__label"
            >Прізвище</label
          >
          <Field
            id="lastName"
            name="lastName"
            class="user-create__input"
          />
          <ErrorMessage name="lastName" class="user-create__field-error" />
        </div>
      </div>

      <div class="user-create__row">
        <div class="user-create__field">
          <label for="email" class="user-create__label"
            >Email</label
          >
          <Field
            id="email"
            name="email"
            type="email"
            class="user-create__input"
          />
          <ErrorMessage name="email" class="user-create__field-error" />
        </div>
        <div class="user-create__field">
          <label for="phone" class="user-create__label"
            >Телефон</label
          >
          <Field
            id="phone"
            name="phone"
            type="tel"
            class="user-create__input"
          />
          <ErrorMessage name="phone" class="user-create__field-error" />
        </div>
      </div>

      <div class="user-create__row user-create__row--three">
        <div class="user-create__field">
          <label for="username" class="user-create__label"
            >Username</label
          >
          <Field
            id="username"
            name="username"
            class="user-create__input"
          />
          <ErrorMessage name="username" class="user-create__field-error" />
        </div>
        <div class="user-create__field">
          <label for="password" class="user-create__label"
            >Пароль</label
          >
          <Field
            id="password"
            name="password"
            type="password"
            class="user-create__input"
          />
          <ErrorMessage name="password" class="user-create__field-error" />
        </div>
        <div class="user-create__field">
          <label for="age" class="user-create__label">Вік</label>
          <Field
            id="age"
            name="age"
            type="number"
            class="user-create__input"
          />
          <ErrorMessage name="age" class="user-create__field-error" />
        </div>
      </div>

      <div class="user-create__field">
        <label for="gender" class="user-create__label"
          >Стать</label
        >
        <Field
          id="gender"
          name="gender"
          as="select"
          class="user-create__input"
        >
          <option value="" disabled>Оберіть стать</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Field>
        <ErrorMessage name="gender" class="user-create__field-error" />
      </div>

      <div
        v-if="apiError"
        role="alert"
        class="user-create__api-error"
      >
        {{ apiError }}
      </div>

      <div class="user-create__actions">
        <RouterLink
          to="/users"
          class="user-create__cancel"
          >Скасувати</RouterLink
        >
        <UiButton
          type="submit"
          :disabled="isSaving"
          class="user-create__submit"
        >
          {{ isSaving ? "Створення..." : "Створити" }}
        </UiButton>
      </div>
    </Form>
  </div>
</template>

<style scoped>
.user-create {
  max-width: 36rem;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.user-create__title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2rem;
}

.user-create :deep(.user-create__form) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-create__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.user-create__row--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.user-create__label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-create :deep(.user-create__input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.user-create :deep(.user-create__field-error) {
  display: block;
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
}

.user-create__api-error {
  padding: 0.75rem;
  border-radius: 0.25rem;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.875rem;
}

.user-create__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.user-create__cancel,
.user-create__submit {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  transition: background-color 150ms;
}

.user-create__cancel:hover {
  background: #f9fafb;
}

.user-create__submit {
  border-color: #3b82f6;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}

.user-create__submit:hover:not(:disabled) {
  background: #2563eb;
}

.user-create__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .user-create__row,
  .user-create__row--three {
    grid-template-columns: 1fr;
  }
}
</style>

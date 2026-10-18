<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Form,
  Field,
  type GenericObject,
} from "vee-validate";
import { useUsersStore, userSchema } from "../../../entities/user";
import type { User } from "../../../entities/user";
import { AppButton, AppInput, useAppToast } from "../../../shared/ui";

const props = defineProps<{ id: string }>();
const emit = defineEmits<{ updated: [] }>();
const usersStore = useUsersStore();
const toast = useAppToast();

const initialData = ref<Partial<User>>({});
const isLoading = ref(true);
const isSaving = ref(false);
const apiError = ref("");

onMounted(async () => {
  try {
    const user = await usersStore.fetchUser(Number(props.id));
    initialData.value = user;
  } catch (error) {
    apiError.value =
      error instanceof Error
        ? error.message
        : "Не вдалося завантажити користувача";
    toast.error("Не вдалося завантажити користувача", apiError.value);
  } finally {
    isLoading.value = false;
  }
});

const onSubmit = async (values: GenericObject) => {
  apiError.value = "";
  isSaving.value = true;
  try {
    const validatedValues = await userSchema.validate(values);
    await usersStore.updateUser(
      Number(props.id),
      validatedValues,
    );
    toast.success("Користувача оновлено");
    emit("updated");
  } catch (error) {
    apiError.value =
      error instanceof Error
        ? error.message
        : "Не вдалося зберегти користувача";
    toast.error("Не вдалося зберегти користувача", apiError.value);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="user-edit">
    <h1 class="user-edit__title">Редагувати користувача</h1>

    <div v-if="isLoading" class="user-edit__loading">Завантаження...</div>
    <div
      v-else-if="apiError && !initialData.id"
      role="alert"
      class="user-edit__api-error"
    >
      {{ apiError }}
    </div>

    <Form
      v-else
      @submit="onSubmit"
      :validation-schema="userSchema"
      :initial-values="initialData"
      class="user-edit__form"
    >
      <div class="user-edit__row">
        <div class="user-edit__field">
          <label class="user-edit__label">Ім'я</label>
          <Field name="firstName" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
        <div class="user-edit__field">
          <label class="user-edit__label">Прізвище</label>
          <Field name="lastName" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
      </div>

      <div class="user-edit__row">
        <div class="user-edit__field">
          <label class="user-edit__label">Email</label>
          <Field name="email" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              type="email"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
        <div class="user-edit__field">
          <label class="user-edit__label">Телефон</label>
          <Field name="phone" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
      </div>

      <div class="user-edit__row user-edit__row--three">
        <div class="user-edit__field">
          <label class="user-edit__label">Username</label>
          <Field name="username" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
        <div class="user-edit__field">
          <label class="user-edit__label">Пароль</label>
          <Field name="password" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              type="password"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
        <div class="user-edit__field">
          <label class="user-edit__label">Вік</label>
          <Field name="age" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              type="number"
              class="user-edit__input"
              :error-message="errorMessage"
            />
          </Field>
        </div>
        <div class="user-edit__field">
          <label class="user-edit__label">Стать</label>
          <Field name="gender" v-slot="{ field, errorMessage }">
            <AppInput
              v-bind="field"
              as="select"
              class="user-edit__input"
              :error-message="errorMessage"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </AppInput>
          </Field>
        </div>
      </div>

      <div
        v-if="apiError"
        role="alert"
        class="user-edit__api-error"
      >
        {{ apiError }}
      </div>

      <div class="user-edit__actions">
        <RouterLink
          to="/users"
          class="user-edit__cancel"
          >Скасувати</RouterLink
        >
        <AppButton
          type="submit"
          :disabled="isSaving"
          class="user-edit__submit"
        >
          {{ isSaving ? "Збереження..." : "Зберегти" }}
        </AppButton>
      </div>
    </Form>
  </div>
</template>

<style scoped>
.user-edit {
  max-width: 36rem;
  margin: 0 auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.user-edit__title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 2rem;
}

.user-edit__loading {
  color: #6b7280;
}

.user-edit :deep(.user-edit__form) {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-edit__row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.user-edit__row--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.user-edit__label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-edit :deep(.user-edit__input) {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.user-edit :deep(.user-edit__field-error) {
  display: block;
  margin-top: 0.25rem;
  color: #ef4444;
  font-size: 0.75rem;
}

.user-edit__api-error {
  padding: 0.75rem;
  border-radius: 0.25rem;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.875rem;
}

.user-edit__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.user-edit__cancel,
.user-edit__submit {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  transition: background-color 150ms;
}

.user-edit__cancel:hover {
  background: #f9fafb;
}

.user-edit__submit {
  border-color: #3b82f6;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}

.user-edit__submit:hover:not(:disabled) {
  background: #2563eb;
}

.user-edit__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .user-edit__row,
  .user-edit__row--three {
    grid-template-columns: 1fr;
  }
}
</style>

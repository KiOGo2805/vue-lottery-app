<script setup lang="ts">
import { reactive, watch } from "vue";
import BaseInput from "./UI/BaseInput.vue";
import BaseButton from "./UI/BaseButton.vue";
import type { Participant } from "../types";

const props = defineProps<{
  existingEmails: string[];
}>();

const emit = defineEmits<{
  (e: "register", participant: Omit<Participant, "id">): void;
}>();

const form = reactive({
  name: "",
  dateOfBirth: "",
  email: "",
  phone: "+380",
});

watch(
  () => form.phone,
  (newValue) => {
    if (!newValue.startsWith("+380")) {
      form.phone = "+380";
    }
  },
);

const errors = reactive({
  name: "",
  dateOfBirth: "",
  email: "",
  phone: "",
});

const validate = (): boolean => {
  let isValid = true;

  errors.name = "";
  errors.dateOfBirth = "";
  errors.email = "";
  errors.phone = "";

  if (!form.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  if (!form.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
    isValid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthDate = new Date(form.dateOfBirth);
    if (birthDate > today) {
      errors.dateOfBirth = "Date of birth cannot be in the future";
      isValid = false;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = "Invalid email format";
    isValid = false;
  } else if (props.existingEmails.includes(form.email.toLowerCase())) {
    errors.email = "This email is already registered";
    isValid = false;
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
    isValid = false;
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = "Phone must be in format +380XXXXXXXXX";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (validate()) {
    emit("register", { ...form });

    form.name = "";
    form.dateOfBirth = "";
    form.email = "";
    form.phone = "+380";
  }
};
</script>

<template>
  <div class="register-form">
    <div class="register-form__header">
      <h2 class="register-form__title">Register Form</h2>
      <p class="register-form__subtitle">Please fill in all the fields.</p>
    </div>

    <form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
      <BaseInput
        v-model="form.name"
        label="Name"
        id="name"
        placeholder="Enter user name"
        :error="errors.name"
      />

      <BaseInput
        v-model="form.dateOfBirth"
        label="Date of Birth"
        id="dob"
        type="date"
        :error="errors.dateOfBirth"
      />

      <BaseInput
        v-model="form.email"
        label="Email"
        id="email"
        type="email"
        placeholder="Enter email"
        :error="errors.email"
      />

      <BaseInput
        v-model="form.phone"
        label="Phone number"
        id="phone"
        placeholder="Enter Phone number (+380XXXXXXXXX)"
        :error="errors.phone"
      />

      <div class="register-form__actions">
        <BaseButton type="submit" variant="primary"> Save </BaseButton>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-form {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  padding: 1.5rem;
}

.register-form__header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.register-form__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  text-transform: uppercase;
}

.register-form__subtitle {
  margin: 0.25rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.register-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>

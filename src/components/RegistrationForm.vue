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
  phone: "+380", // Тепер поле зразу має код
});

// Не дасть стерти префікс
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

  // Очищення попередніх помилок
  errors.name = "";
  errors.dateOfBirth = "";
  errors.email = "";
  errors.phone = "";

  // Валідація імені
  if (!form.name.trim()) {
    errors.name = "Name is required";
    isValid = false;
  }

  // Валідація дати (не у майбутньому)
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

  // Валідація Email (RegExp та унікальність без урахування регістру)
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

  // Валідація телефону (+380XXXXXXXXX)
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
    form.phone = "+380"; // Замість порожнього рядка
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="mb-6 border-b pb-4">
      <h2 class="text-xl font-bold text-gray-800 uppercase">Register Form</h2>
      <p class="text-gray-500 text-sm">Please fill in all the fields.</p>
    </div>

    <!-- Обробник клавіші Enter висить на формі -->
    <form @submit.prevent="handleSubmit" @keydown.enter.prevent="handleSubmit">
      <BaseInput
        v-model="form.name"
        label="Name"
        id="name"
        placeholder="Enter user name"
        :error="errors.name"
      />

      <!-- Input date автоматично викликає нативний календар -->
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

      <div class="flex justify-end mt-4">
        <BaseButton type="submit" variant="primary"> Save </BaseButton>
      </div>
    </form>
  </div>
</template>

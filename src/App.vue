<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { useLottery } from "./composables/useLottery";
import type { Participant } from "./types";

import WinnersBlock from "./components/WinnersBlock.vue";
import RegistrationForm from "./components/RegistrationForm.vue";
import ParticipantTable from "./components/ParticipantTable.vue";
import ModalWindow from "./components/UI/ModalWindow.vue";
import BaseButton from "./components/UI/BaseButton.vue";
import BaseInput from "./components/UI/BaseInput.vue";

const {
  participants,
  winners,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  checkEmailExists,
  pickNewWinner,
  removeWinner,
} = useLottery();

const handleRegister = (participantData: Omit<Participant, "id">) => {
  const newParticipant: Participant = {
    ...participantData,
    id: crypto.randomUUID(),
  };
  addParticipant(newParticipant);
};

const existingEmails = computed(() => participants.value.map((p) => p.email));

const isEditModalOpen = ref(false);
const editForm = ref<Participant | null>(null);
const editErrors = reactive({
  name: "",
  dateOfBirth: "",
  email: "",
  phone: "",
});

const resetEditErrors = () => {
  editErrors.name = "";
  editErrors.dateOfBirth = "";
  editErrors.email = "";
  editErrors.phone = "";
};

const validateEditForm = (): boolean => {
  if (!editForm.value) return false;

  let isValid = true;
  resetEditErrors();

  if (!editForm.value.name.trim()) {
    editErrors.name = "Name is required";
    isValid = false;
  }

  if (!editForm.value.dateOfBirth) {
    editErrors.dateOfBirth = "Date of birth is required";
    isValid = false;
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birthDate = new Date(editForm.value.dateOfBirth);
    if (birthDate > today) {
      editErrors.dateOfBirth = "Date of birth cannot be in the future";
      isValid = false;
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!editForm.value.email.trim()) {
    editErrors.email = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(editForm.value.email)) {
    editErrors.email = "Invalid email format";
    isValid = false;
  } else if (
    checkEmailExists(editForm.value.email, editForm.value.id)
  ) {
    editErrors.email = "This email is already registered";
    isValid = false;
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!editForm.value.phone.trim()) {
    editErrors.phone = "Phone number is required";
    isValid = false;
  } else if (!phoneRegex.test(editForm.value.phone)) {
    editErrors.phone = "Phone must be in format +380XXXXXXXXX";
    isValid = false;
  }

  return isValid;
};

const openEditModal = (p: Participant) => {
  editForm.value = { ...p };
  resetEditErrors();
  isEditModalOpen.value = true;
};

watch(
  () => editForm?.value?.phone,
  (newValue) => {
    if (newValue && !newValue.startsWith("+380")) {
      editForm.value = editForm.value ? { ...editForm.value, phone: "+380" } : null;
    }
  },
);

const saveEdit = () => {
  if (!editForm.value || !validateEditForm()) {
    return;
  }

  updateParticipant(editForm.value);
  isEditModalOpen.value = false;
};

const isDeleteModalOpen = ref(false);
const participantToDelete = ref<Participant | null>(null);

const openDeleteModal = (p: Participant) => {
  participantToDelete.value = p;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (participantToDelete.value) {
    deleteParticipant(participantToDelete.value.id);
  }
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <div class="app-shell">
    <WinnersBlock
      :winners="winners"
      :participants="participants"
      @pick-winner="pickNewWinner"
      @remove-winner="removeWinner"
    />

    <RegistrationForm
      :existing-emails="existingEmails"
      @register="handleRegister"
      class="app-shell__form"
    />

    <ParticipantTable
      :participants="participants"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <ModalWindow
      :is-open="isEditModalOpen"
      title="Редагувати дані"
      @close="isEditModalOpen = false; resetEditErrors()"
    >
      <div v-if="editForm" class="edit-form">
        <BaseInput v-model="editForm.name" label="Name" :error="editErrors.name" />
        <BaseInput
          v-model="editForm.dateOfBirth"
          label="Date of Birth"
          type="date"
          :error="editErrors.dateOfBirth"
        />
        <BaseInput
          v-model="editForm.email"
          label="Email"
          type="email"
          :error="editErrors.email"
        />
        <BaseInput
          v-model="editForm.phone"
          label="Phone"
          :error="editErrors.phone"
        />
      </div>
      <template #footer>
        <BaseButton
          variant="secondary"
          @click="isEditModalOpen = false; resetEditErrors()"
          >Скасувати</BaseButton
        >
        <BaseButton variant="primary" @click="saveEdit"
          >Оновити дані</BaseButton
        >
      </template>
    </ModalWindow>

    <ModalWindow
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="isDeleteModalOpen = false"
    >
      <div v-if="participantToDelete" class="delete-confirmation">
        Ви дійсно бажаєте видалити учасника
        <span class="delete-confirmation__name">"{{ participantToDelete.name }}"</span>,
        <span class="delete-confirmation__email">"{{ participantToDelete.email }}"</span>?
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false"
          >Ні</BaseButton
        >
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </ModalWindow>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 640px) {
  .app-shell {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .app-shell {
    padding: 2rem;
  }
}

.app-shell__form {
  margin-bottom: 1.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-confirmation {
  margin-bottom: 1rem;
  color: #374151;
}

.delete-confirmation__name {
  font-weight: 700;
}

.delete-confirmation__email {
  font-style: italic;
}
</style>

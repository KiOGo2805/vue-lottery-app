<script setup lang="ts">
import { ref, computed } from "vue";
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

// --- Реєстрація ---
const handleRegister = (participantData: Omit<Participant, "id">) => {
  const newParticipant: Participant = {
    ...participantData,
    id: crypto.randomUUID(),
  };
  addParticipant(newParticipant);
};

const existingEmails = computed(() => participants.value.map((p) => p.email));

// --- Модальне вікно редагування ---
const isEditModalOpen = ref(false);
const editForm = ref<Participant | null>(null);
const editError = ref("");

const openEditModal = (p: Participant) => {
  editForm.value = { ...p };
  editError.value = "";
  isEditModalOpen.value = true;
};

const saveEdit = () => {
  if (!editForm.value) return;

  // Перевірка на унікальність email під час редагування (власний email дублікатом не вважається)
  if (checkEmailExists(editForm.value.email, editForm.value.id)) {
    editError.value = "Цей email вже зареєстровано.";
    return;
  }

  // Базова валідація для інших полів перед збереженням
  if (
    !editForm.value.name ||
    !editForm.value.dateOfBirth ||
    !editForm.value.phone
  ) {
    editError.value = "Всі поля повинні бути заповнені.";
    return;
  }

  updateParticipant(editForm.value);
  isEditModalOpen.value = false;
};

// --- Модальне вікно видалення ---
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
  <div class="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
    <WinnersBlock
      :winners="winners"
      :participants="participants"
      @pick-winner="pickNewWinner"
      @remove-winner="removeWinner"
    />

    <RegistrationForm
      :existing-emails="existingEmails"
      @register="handleRegister"
      class="mb-6"
    />

    <ParticipantTable
      :participants="participants"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <!-- Модалка редагування -->
    <ModalWindow
      :is-open="isEditModalOpen"
      title="Редагувати дані"
      @close="isEditModalOpen = false"
    >
      <div v-if="editForm" class="space-y-4">
        <BaseInput v-model="editForm.name" label="Name" />
        <BaseInput
          v-model="editForm.dateOfBirth"
          label="Date of Birth"
          type="date"
        />
        <BaseInput
          v-model="editForm.email"
          label="Email"
          type="email"
          :error="editError"
        />
        <BaseInput v-model="editForm.phone" label="Phone" />
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="isEditModalOpen = false"
          >Скасувати</BaseButton
        >
        <BaseButton variant="primary" @click="saveEdit"
          >Оновити дані</BaseButton
        >
      </template>
    </ModalWindow>

    <!-- Модалка видалення -->
    <ModalWindow
      :is-open="isDeleteModalOpen"
      title="Підтвердження видалення"
      @close="isDeleteModalOpen = false"
    >
      <div v-if="participantToDelete" class="text-gray-700 mb-4">
        Ви дійсно бажаєте видалити учасника
        <span class="font-bold">"{{ participantToDelete.name }}"</span>,
        <span class="italic">"{{ participantToDelete.email }}"</span>?
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

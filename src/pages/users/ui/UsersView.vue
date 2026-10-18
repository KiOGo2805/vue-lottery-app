<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "../../../entities/user";
import type { Participant } from "../../../shared/model";
import { AppButton } from "../../../shared/ui";
import UsersTable from "../../../widgets/users-table";

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const lotteryWinners = ref<Participant[]>([]);

const readStoredLotteryWinners = (): Participant[] => {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem("lottery_winners");
    return saved ? (JSON.parse(saved) as Participant[]) : [];
  } catch {
    return [];
  }
};

const mapUserToParticipant = (user: {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}): Participant => ({
  id: String(user.id),
  name: `${user.firstName} ${user.lastName}`.trim(),
  dateOfBirth: "",
  email: user.email,
  phone: user.phone,
});

const apiParticipants = computed(() =>
  users.value.map((user) => mapUserToParticipant(user)),
);

const syncLotteryWinnersWithUsers = () => {
  const participantMap = new Map(
    apiParticipants.value.map((participant) => [participant.id, participant]),
  );

  lotteryWinners.value = lotteryWinners.value
    .filter((winner) => participantMap.has(winner.id))
    .map((winner) => ({
      ...winner,
      ...(participantMap.get(winner.id) ?? {}),
    }));
};

const canPickWinner = computed(
  () =>
    apiParticipants.value.length > 0 &&
    lotteryWinners.value.length < 3 &&
    lotteryWinners.value.length < apiParticipants.value.length,
);

lotteryWinners.value = readStoredLotteryWinners();

const pickLotteryWinner = () => {
  const availableParticipants = apiParticipants.value.filter(
    (participant) =>
      !lotteryWinners.value.some((winner) => winner.id === participant.id),
  );

  if (!availableParticipants.length) return;

  const randomIndex = Math.floor(Math.random() * availableParticipants.length);
  lotteryWinners.value.push(availableParticipants[randomIndex]);
};

const removeLotteryWinner = (id: string) => {
  lotteryWinners.value = lotteryWinners.value.filter(
    (winner) => winner.id !== id,
  );
};

watch(
  lotteryWinners,
  (newValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lottery_winners", JSON.stringify(newValue));
    }
  },
  { deep: true },
);

watch(
  apiParticipants,
  syncLotteryWinnersWithUsers,
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="users-view">
    <section class="lottery-panel">
      <div class="lottery-panel__header">
        <div>
          <p class="lottery-panel__eyebrow">Lottery</p>
          <h2 class="lottery-panel__title">Participants & winners</h2>
        </div>

        <AppButton
          type="button"
          class="lottery-button lottery-button--primary"
          :disabled="!canPickWinner"
          @click="pickLotteryWinner"
        >
          New winner
        </AppButton>
      </div>

      <div class="winner-list">
        <span
          v-if="lotteryWinners.length === 0"
          class="winner-list__placeholder"
        >
          No winners yet
        </span>

        <div
          v-for="winner in lotteryWinners"
          :key="winner.id"
          class="winner-chip"
        >
          <span>{{ winner.name }}</span>
          <AppButton
            type="button"
            class="winner-chip__remove"
            aria-label="Remove winner"
            @click="removeLotteryWinner(winner.id)"
          >
            ×
          </AppButton>
        </div>
      </div>
    </section>

    <UsersTable />
  </div>
</template>

<style scoped>
.users-view {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.lottery-panel {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 1px 2px rgb(15 23 42 / 5%);
}

.lottery-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.lottery-panel__eyebrow {
  margin: 0 0 0.35rem;
  color: #6366f1;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lottery-panel__title {
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.lottery-button {
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.lottery-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.lottery-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lottery-button--primary {
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
}

.winner-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  min-height: 3rem;
}

.winner-list__placeholder {
  color: #6b7280;
  font-size: 0.95rem;
}

.winner-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #93c5fd;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 600;
}

.winner-chip__remove {
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
}

@media (max-width: 640px) {
  .users-view {
    overflow-x: auto;
  }

  .lottery-panel__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

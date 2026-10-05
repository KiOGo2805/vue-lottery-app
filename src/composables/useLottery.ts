import { ref, watch } from "vue";
import type { Participant } from "../types";

export function useLottery() {
  const participants = ref<Participant[]>([]);
  const winners = ref<Participant[]>([]);

  const savedParticipants = localStorage.getItem("lottery_participants");
  if (savedParticipants) {
    participants.value = JSON.parse(savedParticipants);
  }

  const savedWinners = localStorage.getItem("lottery_winners");
  if (savedWinners) {
    winners.value = JSON.parse(savedWinners);
  }

  watch(
    participants,
    (newVal) => {
      localStorage.setItem("lottery_participants", JSON.stringify(newVal));
    },
    { deep: true },
  );

  watch(
    winners,
    (newVal) => {
      localStorage.setItem("lottery_winners", JSON.stringify(newVal));
    },
    { deep: true },
  );

  const addParticipant = (participant: Participant) => {
    participants.value.push(participant);
  };

  const updateParticipant = (updated: Participant) => {
    const index = participants.value.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      participants.value[index] = updated;
    }
    const winnerIndex = winners.value.findIndex((w) => w.id === updated.id);
    if (winnerIndex !== -1) {
      winners.value[winnerIndex] = updated;
    }
  };

  const deleteParticipant = (id: string) => {
    participants.value = participants.value.filter((p) => p.id !== id);
    winners.value = winners.value.filter((w) => w.id !== id);
  };

  const checkEmailExists = (email: string, excludeId?: string): boolean => {
    return participants.value.some(
      (p) =>
        p.email.toLowerCase() === email.toLowerCase() && p.id !== excludeId,
    );
  };

  const pickNewWinner = () => {
    const availableParticipants = participants.value.filter(
      (p) => !winners.value.some((w) => w.id === p.id),
    );

    if (availableParticipants.length > 0 && winners.value.length < 3) {
      const randomIndex = Math.floor(
        Math.random() * availableParticipants.length,
      );
      winners.value.push(availableParticipants[randomIndex]);
    }
  };

  const removeWinner = (id: string) => {
    winners.value = winners.value.filter((w) => w.id !== id);
  };

  return {
    participants,
    winners,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    checkEmailExists,
    pickNewWinner,
    removeWinner,
  };
}

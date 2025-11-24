"use client";
import React, { useState } from "react";
import type { Room } from "@/types/game";
import { UiModal } from "@/components/ui/UiModal";
import { UiButton } from "@/components/ui/UiButton";
import { texasPokerAPI } from "@/lib/texas-poker-api";
import { useRouter } from 'next/navigation';

export function EnterRoomForm({ id, selectedRoom }: { id: string, selectedRoom: Room | null }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirmEnterRoom() {
    try {
      const playerData = localStorage.getItem('player');

      console.log("Selected room inside modal:", selectedRoom);

      if (!playerData) {
        setError("Usuário não autenticado.");
        return;
      }

      console.log("Entrando na sala:", selectedRoom, "com jogador:", playerData);
      const player = JSON.parse(playerData);
      await texasPokerAPI.joinRoom({ roomId: selectedRoom!.id, playerId: player.id });

      router.push(`/room/${selectedRoom!.id}/game`);
    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
      setError("Não foi possível entrar na sala. Tente novamente.");
    }
  }

  return (
    <UiModal 
      className="flex flex-col items-center"
      id={id}
    >
      <h2 className="text-2xl font-bold mb-4">Deseja entrar na sala {selectedRoom?.name}?</h2>
      <p className="mb-4">Are you sure you want to enter this room?</p>
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      <UiButton
        onClick={handleConfirmEnterRoom}
      >
        Confirmar
      </UiButton>
    </UiModal>
  );
}
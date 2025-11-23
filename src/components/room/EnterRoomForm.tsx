"use client";
import React from "react";
import type { Room } from "@/types/game";
import { UiModal } from "@/components/ui/UiModal";

export function EnterRoomForm({ selectedRoom, id }: { selectedRoom: Room | null, id: string }) {
  return (
    <UiModal 
      className="flex flex-col items-center"
      id={id}
    >
      <h2 className="text-2xl font-bold mb-4">Deseja entrar na sala {selectedRoom?.name}?</h2>
      <p className="mb-4">Are you sure you want to enter this room?</p>
      <button
      
      >
        Confirmar
      </button>
    </UiModal>
  );
}
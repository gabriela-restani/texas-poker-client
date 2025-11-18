import React from "react";
import { PlayerHand } from "@/components/game/PlayerHand";
import type { PlayerProps } from "@/types/game";

export function Player({ playerName, playerHand }: PlayerProps) {
  return (
    <div className="relative flex flex-col items-center w-52 h-36">
      <PlayerHand 
        cards={playerHand} 
        className="mb-4"
      />
      <div className="absolute min-w-48 w-fit bg-blue-600 rounded-full 
        flex items-center justify-center 
        text-white font-bold text-2xl p-2
        bottom-0
      ">
        { playerName }
      </div>
    </div>
  );
}
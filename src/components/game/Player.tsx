import React from "react";
import { PlayerHand } from "@/components/game/PlayerHand";
import type { PlayerProps } from "@/types/game";

export function Player({ player, isCurrentTurn }: PlayerProps) {
  return (
    <div className="relative inline-block w-52 h-36">
      {player && (
        <div className="flex justify-center">
          <PlayerHand 
            cards={player.cards} 
            className="mb-4"
          />
          <div className="absolute min-w-48 w-fit bg-blue-600 rounded-full 
            flex items-center justify-center 
          text-white font-bold text-2xl p-2
            bottom-0"
          >
            {player.name}
          </div>
          <div className="absolute bottom-6 left-0 bg-green-400 
            text-black font-bold text-sm px-3 py-3 rounded-full
            border-2 border-green-200 animate-pulse
            "
            style={{ display: isCurrentTurn ? 'block' : 'none' }}
          />
        </div>
      )}
      {!player && (
        <div className="absolute min-w-48 w-fit bg-gray-600 rounded-full 
          flex items-center justify-center 
        text-white font-bold text-2xl p-2
          bottom-0"
        >
          Vaga
        </div>
      )}
    </div>
  );
}
import React from "react";
import { Card } from "@/components/game/Card";
import type { PlayerHandProps } from "@/types/game";

export function PlayerHand({ 
  cards,
  className = "",
}: PlayerHandProps) {
  return (
    <div className={`relative ${className} left-2 top-2`}>
      <Card 
        className="inline-block transform -rotate-12"
        cardKey={cards[0]} 
        width={80}
        height={116}
      />
      <Card 
        className="inline-block relative transform rotate-12 -left-4"
        cardKey={cards[1]} 
        width={80}
        height={116}
      />
    </div>
  );
}
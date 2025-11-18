import React from "react";
import { Card } from "@/components/game/Card";
import type { CardProps } from "@/types/game";

export function CommunityCards({ cards }: { cards: CardProps["cardKey"][] }) {
  return (
    <div className="flex gap-x-4 justify-center py-4">
      {cards.map((cardKey, index) => (
        <Card 
          key={index} 
          className="outline-2 outline-dashed outline-yellow-200 outline-offset-2 rounded-md"
          cardKey={cardKey} 
          width={80}
          height={116}
        />
      ))}
    </div>
  );
}
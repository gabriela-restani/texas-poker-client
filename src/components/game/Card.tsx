import React from "react";
import Image from "next/image";
import { DECK_SVG_MAP } from "@/lib/constants";
import type { CardProps } from "@/types/game";

export function Card({ 
  cardKey, 
  width = 100, 
  height = 145,
  className = "",
}: CardProps) {
  return (
    <Image
      className={className}
      src={`/cards/${DECK_SVG_MAP[cardKey as keyof typeof DECK_SVG_MAP]}`}
      alt={cardKey}
      width={width}
      height={height}
    />
  );
}
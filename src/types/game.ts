import { DECK_SVG_MAP } from "@/lib/constants";

export interface CardProps {
  cardKey: keyof typeof DECK_SVG_MAP;
  width?: number;
  height?: number;
  className?: string;
}

export interface PlayerHandProps {
  cards: CardProps["cardKey"][];
  className?: string;
}

export interface PlayerProps {
  playerName: string;
  playerHand: PlayerHandProps[];
}
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

type Player = {
  id: string;
  name: string;
  chips: number;
}

export interface PlayerProps {
  player: {
    id: string;
    name: string;
    cards: CardProps["cardKey"][];
  }
  isCurrentTurn: boolean;
}

export interface Room {
  id: number;
  name: string;
  max_players: number;
  current_players: Player[];
  has_game: boolean;
  game_status: string | null;
}
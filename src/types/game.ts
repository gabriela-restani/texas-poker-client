import { DECK_SVG_MAP } from "@/lib/constants";

export interface CardProps {
  cardKey: keyof typeof DECK_SVG_MAP;
  width?: number;
  height?: number;
  className?: string;
}
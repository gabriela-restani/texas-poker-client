import React from "react";
import { UiModal } from "@/components/ui/UiModal";
import type { HandsRankingModalProps } from "@/types/modals";
import { Card } from "@/components/game/Card";
import { HANDS_RANKINGS, DECK_SVG_MAP} from "@/lib/constants";
export function HandsRankingModal({ id }: HandsRankingModalProps) {
  return (
    <UiModal 
      id={id}
    >
      <h2 className="text-xl font-bold mb-4">Hand Rankings</h2>
      <ol className="list-decimal list-inside gap-4 columns-2 font-bold">
        <li>
          Royal Flush
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.ROYAL_FLUSH.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          Straight Flush
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.STRAIGHT_FLUSH.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          Four of a Kind
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.FOUR_OF_A_KIND.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          Full House
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.FULL_HOUSE.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          Three of a Kind
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.THREE_OF_A_KIND.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          Two Pair
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.TWO_PAIR.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          One Pair
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.ONE_PAIR.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
        <li>
          High Card
          <div className="flex mt-2 mb-4">
            {HANDS_RANKINGS.HIGH_CARD.map((card, index) => (
              <Card 
                key={index}
                cardKey={card as keyof typeof DECK_SVG_MAP}
                className="w-12 h-16 mr-1"
              />
            ))}
          </div>
        </li>
      </ol>
    </UiModal>
  );
}
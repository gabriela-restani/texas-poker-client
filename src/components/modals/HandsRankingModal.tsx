import React from "react";
import { UiModal } from "@/components/ui/UiModal";
import type { HandsRankingModalProps } from "@/types/modals";

export function HandsRankingModal({ id }: HandsRankingModalProps) {
  return (
    <UiModal 
      id={id}
    >
      <h2>Hand Rankings</h2>
      <ol>
        <li>Royal Flush</li>
        <li>Straight Flush</li>
        <li>Four of a Kind</li>
        <li>Full House</li>
        <li>Flush</li>
        <li>Straight</li>
        <li>Three of a Kind</li>
        <li>Two Pair</li>
        <li>One Pair</li>
        <li>High Card</li>
      </ol>
    </UiModal>
  );
}
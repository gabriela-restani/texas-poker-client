'use client';
import React from 'react';
import { HandsRankingModal } from '@/components/modals/HandsRankingModal';
import { UiButton } from '@/components/ui/UiButton';

export function TheHeader() {
  return (
    <header 
      className="flex flex-row items-center justify-between 
        w-full bg-green-900 text-neutral-900 px-6 py-4"
    >
      <span className="text-2xl font-bold ml-4 text-neutral-50">
        Lia Texas Poker
      </span>
      <UiButton 
        popoverTarget="hands-ranking-dialog"
      >
        Hand Ranking
      </UiButton>
      <HandsRankingModal id="hands-ranking-dialog"/>
    </header>
  );
}
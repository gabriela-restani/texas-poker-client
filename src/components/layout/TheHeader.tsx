'use client';
import React from 'react';
import { HandsRankingModal } from '@/components/modals/HandsRankingModal';
import { UiButton } from '@/components/ui/UiButton';

export function TheHeader() {
  return (
    <header 
      className="flex flex-row items-center justify-end 
        w-full bg-neutral-300 text-neutral-900"
    >
      <UiButton 
        popoverTarget="hands-ranking-dialog"
      >
        Hand Ranking
      </UiButton>
      <HandsRankingModal id="hands-ranking-dialog"/>
    </header>
  );
}
'use client';
import React from 'react';
import { HandsRankingModal } from '@/components/modals/HandsRankingModal';
export function TheHeader() {
  return (
    <header 
      className="flex flex-row items-center justify-end 
        w-full bg-neutral-300 text-neutral-900"
    >
      <button 
        popoverTarget="hands-ranking-dialog"
      >
        Hand Ranking
      </button>
      <HandsRankingModal id="hands-ranking-dialog"/>
    </header>
  );
}
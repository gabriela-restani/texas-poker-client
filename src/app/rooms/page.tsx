"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RoomsList } from '@/components/room/RoomsList';
import { CreateRoomForm } from '@/components/room/CreateRoomForm';
import { UiButton } from '@/components/ui/UiButton';

export default function RoomsPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('player');

      if (!user) {
        router.push('/');
      }
    }
  }, [router]);

  return (
    <main className="bg-neutral-100 w-full min-h-svh text-neutral-900 flex flex-col justify-center items-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Salas de Poker</h1>
        <UiButton 
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          popoverTarget='create-room-modal'
        >
          Criar Nova Sala
        </UiButton>
        <CreateRoomForm 
          id="create-room-modal"
        />
        <RoomsList />    
      </div>
    </main>
  );
}

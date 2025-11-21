"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="bg-neutral-100 w-full min-h-svh text-neutral-900 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Salas de Poker</h1>
        <p className="text-gray-600">Lista de salas disponíveis aparecerá aqui.</p>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Criar Nova Sala</button>
      </div>
    </main>
  );
}

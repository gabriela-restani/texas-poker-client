"use client";
import React, { useEffect, useState } from "react";
import { texasPokerAPI } from "@/lib/texas-poker-api";
import type { Room } from "@/types/game";
import { UiModal } from "@/components/ui/UiModal";

export function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]); // Lista de salas
  const [isLoading, setIsLoading] = useState(true); // Indicador de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  async function handleConfirmEnterRoom() {
    try {
      const playerData = localStorage.getItem('player');
      if (!playerData) {
        setError("Usuário não autenticado.");
        return;
      }

      console.log("Entrando na sala:", selectedRoom, "com jogador:", playerData);
      const player = JSON.parse(playerData);
      await texasPokerAPI.joinRoom({ roomId: selectedRoom!.id, playerId: player.id });
      setSelectedRoom(null);
    } catch (err) {
      console.error("Erro ao entrar na sala:", err);
      setError("Não foi possível entrar na sala. Tente novamente.");
    }
  }
  

  function handleRoomSelect(room: Room) {
    setSelectedRoom(room);
  }

  useEffect(() => {
    const fetchRooms = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setIsLoading(true);
        }
        setError(null);
        
        const roomsData = await texasPokerAPI.getRooms();
        console.log("Salas buscadas:", roomsData);
        setRooms(roomsData);
      } catch (err) {
        console.error("Erro ao buscar salas:", err);
        setError("Não foi possível carregar as salas. Tente novamente.");
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
        }
      }
    };

    fetchRooms(true);

    const intervalId = setInterval(() => fetchRooms(false), 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full">
      {isLoading && (
        <p className="text-gray-600">Carregando salas...</p>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isLoading && !error && (
        <><ul className="space-y-4">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="p-4 border border-gray-300 rounded-md hover:shadow-md transition"
            >
              <button
                className="w-full text-left cursor-pointer disabled:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={room.current_players >= room.max_players || room.game_status === "in_progress"}
                onClick={() => handleRoomSelect(room)}
                popoverTarget="enter-room-modal"
              >
                <div className="flex flex-row gap-1.5 items-center">
                  <h2 className="text-xl font-bold">{room.name}</h2>
                  <span className="text-sm font-bold text-neutral-400">(#{room.id})</span>
                </div>
                <p>
                  Jogadores: {room.current_players} / {room.max_players}
                </p>
                <p>
                  Status do Jogo: {room.has_game ? room.game_status : "Nenhum jogo em andamento"}
                </p>
              </button>
            </li>
          ))}
        </ul>
        <UiModal
          id="enter-room-modal"
        >
          Deseja entrar na sala {selectedRoom?.name}?

          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirmEnterRoom}
            popoverTargetAction="hide"
            popoverTarget="enter-room-modal"
          >
            Confirmar
          </button>
        </UiModal>
      </>
      )}
    </div>
  );
}
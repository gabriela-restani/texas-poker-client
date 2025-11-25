"use client";
import React, { useEffect, useState } from "react";
import { texasPokerAPI } from "@/lib/texas-poker-api";
import type { Room } from "@/types/game";
import { EnterRoomForm } from "@/components/room/EnterRoomForm";
import { UiButton } from "@/components/ui/UiButton";

export function RoomsList() {
  const [rooms, setRooms] = useState<Room[]>([]); // Lista de salas
  const [isLoading, setIsLoading] = useState(true); // Indicador de carregamento
  const [error, setError] = useState<string | null>(null); // Mensagens de erro
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);  

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

    console.log(rooms)

    const intervalId = setInterval(() => fetchRooms(false), 5000);
    return () => clearInterval(intervalId);
  }, [rooms.length]);

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
       <>
        <ul className="space-y-4 gap-2">
          {rooms.map((room) => (
            <li
              key={room.id}
              className="border border-gray-300 rounded-lg hover:shadow-md transition"
            >
              <UiButton
                className="w-full p-4 text-left cursor-pointer text-neutral-900
                  disabled:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed
                  bg-green-300 hover:bg-green-400
                "
                disabled={room.current_players.length >= room.max_players || room.game_status === "in_progress"}
                onClick={() => handleRoomSelect(room)}
                popoverTarget="enter-room-modal"
              >
                <div className="flex flex-row gap-1.5 items-center text-neutral-900">
                  <h2 className="text-xl font-bold ">{room.name}</h2>
                  <span className="text-sm font-bold">(#{room.id})</span>
                </div>
                <p className="text-neutral-900">
                  Jogadores: {room.current_players.length} / {room.max_players}
                </p>
                <p className="text-neutral-900">
                  Status do Jogo: {room.has_game ? room.game_status : "Nenhum jogo em andamento"}
                </p>
              </UiButton>
            </li>
          ))}
        </ul>
        <EnterRoomForm 
          id="enter-room-modal" 
          selectedRoom={selectedRoom}
        />
      </>
      )}
    </div>
  );
}
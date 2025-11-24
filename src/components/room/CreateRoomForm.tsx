import React from "react";
import { UiModal } from "@/components/ui/UiModal";
import { UiButton } from "@/components/ui/UiButton";
import { texasPokerAPI } from "@/lib/texas-poker-api";

export function CreateRoomForm({ id }: { id: string }) {
  const createRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const roomName = formData.get("roomName") as string;
    const maxPlayers = parseInt(formData.get("maxPlayers") as string, 10);

    console.log("Creating room:", { roomName, maxPlayers });

    texasPokerAPI.createRoom({ room: { name: roomName, max_players:maxPlayers} })
      .then(() => {
        console.log("Room created successfully");
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });

    document.getElementById(id)?.hidePopover()
  }
  return (
    <UiModal 
      id={id}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4">Create a New Room</h2>
        <form 
          className="flex flex-col w-full max-w-md"
          onSubmit={(event) => createRoom(event)}
        >
          <label className="mb-2">
            Room Name:
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded mt-1" 
              name="roomName" 
              required 
            />
          </label>
          <label className="mb-4">
            Max Players:
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300 rounded mt-1" 
              name="maxPlayers" 
              min={2} 
              max={10} 
              required 
            />
          </label>
          <UiButton
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create Room
          </UiButton>
        </form>

      </div>
    </UiModal>
  );
}
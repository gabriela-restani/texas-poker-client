"use client";
import React, { useState } from "react";
import { texasPokerAPI } from "@/lib/texas-poker-api";
import { UiButton } from "@/components/ui/UiButton";

interface LoginFormProps {
  onLoginSuccess?: (playerData: { id: number; name: string }) => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    
    try {
      const response = await texasPokerAPI.addPlayer({ name: username });
      console.log("Player added:", response);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem("player", JSON.stringify(response));
      }
      
      onLoginSuccess?.(response);
    } catch (err) {
      console.error("Error adding player:", err);
      setError("Erro ao entrar no jogo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      className="flex flex-col gap-4 w-80 mx-auto mt-20 p-6
      bg-white border border-gray-300 rounded-md shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center mb-4">
        Enter game lobby
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      
      <div className="flex flex-col">
        <label htmlFor="username" className="mb-1 font-medium">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          disabled={isLoading}
          className="bg-white border border-gray-300 rounded-md 
            px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Enter your username"
        />
      </div>
      <UiButton
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white font-bold py-2 rounded-md
          hover:bg-blue-700 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Entrando..." : "Login"}
      </UiButton>
    </form>
  );
}
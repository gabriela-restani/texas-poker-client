"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/login/LoginForm';

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const savedPlayer = localStorage.getItem('player');
        if (savedPlayer) {
          try {
            const playerData = JSON.parse(savedPlayer);
            console.log('Player já autenticado:', playerData);
            router.push('/rooms');
            return;
          } catch (error) {
            console.error('Erro ao ler dados do localStorage:', error);
            localStorage.removeItem('player');
          }
        }
      }
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [router]);

  // Callback quando o login for bem-sucedido
  const handleLoginSuccess = (playerData: { id: number; name: string }) => {
    console.log('Login bem-sucedido, redirecionando...', playerData);
    router.push('/rooms');
  };

  // Mostrar loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <main className="bg-neutral-100 w-full min-h-svh text-neutral-900 flex flex-col justify-center items-center">
        <div>Carregando...</div>
      </main>
    );
  }

  return (
    <main className="bg-neutral-100 w-full min-h-svh text-neutral-900 flex flex-col justify-center items-center">
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </main>
  );
}

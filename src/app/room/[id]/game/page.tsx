'use client';
import { texasPokerAPI } from '@/lib/texas-poker-api';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Table } from '@/components/game/Table';
import { CommunityCards } from '@/components/game/CommunityCards';
import { INITIAL_COMMUNITY_CARDS } from '@/lib/constants';
import { Player } from '@/components/game/Player';
import type { PlayerProps } from '@/types/game';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const [roomState, setRoomState] = useState<any>(null);
  const [roomId] = useState<string>(React.use(params).id);
  const [isConnected, setIsConnected] = useState(false);
  const [communityCards, setCommunityCards] = useState<any[]>(INITIAL_COMMUNITY_CARDS);

  const [player] = useState<{ name: string, id: string , chips: number }>(() => {
    if (typeof window !== 'undefined') {
      const storedPlayer = localStorage.getItem('player');
      if (storedPlayer) {
        try {
          return JSON.parse(storedPlayer);
        } catch (error) {
          console.error('Erro ao parsear player do localStorage:', error);
          return null;
        }
      }
    }
    return null;
  });

  const wsRef = useRef<WebSocket | null>(null);
  const fetchGameState = useCallback(async () => {
    if (!player?.id) return;
    
    try {
      const state = await texasPokerAPI.getGameState({ 
        roomId: parseInt(roomId),
        playerId: parseInt(player.id)
      });
      console.log('Estado do Jogo:', state);
      setRoomState(state);
    } catch (error) {
      console.error('Erro ao buscar estado do jogo:', error);
    }
  }, [roomId, player]);

  const handleCheckAction = useCallback(async () => {
    try {
      const response = await texasPokerAPI.makeGameAction({
        room_id: parseInt(roomId),
        player_id: parseInt(player.id),
        action: 'check',
      });
      console.log('Ação Check realizada:', response);
      fetchGameState();
    } catch (error) {
      console.error('Erro ao realizar ação Check:', error);
    }
  }, [roomId, player, fetchGameState]);

  const handleCallAction = useCallback(async () => {
    try {
      const playerCurrentBet = roomState?.players.find((p: any) => p.id === player.id)?.current_bet || 0;
      const currentBet = roomState?.current_bet || 0;
      const amount = currentBet - playerCurrentBet;
      const response = await texasPokerAPI.makeGameAction({
        room_id: parseInt(roomId),
        player_id: parseInt(player.id),
        action: 'call',
        amount,
      });
      console.log('Ação Call realizada:', response);
    } catch (error) {
      console.error('Erro ao realizar ação Call:', error);
    }
  }, [roomId, player, roomState]);

  const handleRaiseAction = useCallback(async (amount: number) => {
    try {
      const response = await texasPokerAPI.makeGameAction({
        room_id: parseInt(roomId),
        player_id: parseInt(player.id),
        action: 'raise',
        amount,
      });
      console.log('Ação Raise realizada:', response);
    } catch (error) {
      console.error('Erro ao realizar ação Raise:', error);
    }
  }, [roomId, player]);

  const handleFoldAction = useCallback(async () => {
    try {
      const response = await texasPokerAPI.makeGameAction({
        room_id: parseInt(roomId),
        player_id: parseInt(player.id),
        action: 'fold',
      });
      console.log('Ação Fold realizada:', response);
    } catch (error) {
      console.error('Erro ao realizar ação Fold:', error);
    }
  }, [roomId, player]);

  const startGame = useCallback(async () => {
    try {
      const response = await texasPokerAPI.startGame(parseInt(roomId));
      console.log('Jogo iniciado:', response);
    } catch (error) {
      console.error('Erro ao iniciar o jogo:', error);
    }
  }, [roomId]);

  const goToNextPhase = useCallback(async () => {
    try {
      const response = await texasPokerAPI.goToNextPhase(parseInt(roomId));
      console.log('Próxima fase iniciada:', response);
    } catch (error) {
      console.error('Erro ao iniciar a próxima fase:', error);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !player?.id) {
      console.warn('RoomId ou PlayerId não disponível');
      return;
    }

    const ws = new WebSocket(`ws://localhost:3000/cable`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket conectado!')
      setIsConnected(true);

      ws.send(JSON.stringify({
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: 'RoomChannel',
          room_id: roomId,
          player_id: player.id
        })
      }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      // Ignora mensagens de controle
      if (data.type === 'ping' || data.type === 'welcome' || data.type === 'confirm_subscription') {
        return
      }

      console.log('Mensagem WebSocket:', data);
      
      if (data.message) {
        console.log('Tipo:', data.message.type)

        switch (data.message.type) {
          case 'player_connected':
            console.log('Adicionando jogador:', data.message);
          fetchGameState();
            // Atualiza o estado apenas quando um jogador entra
            break;
          case 'player_disconnected':
            console.log('Removendo jogador:', data.message);
            fetchGameState();
            break;
          case 'player_action':
            console.log('Ação do jogador:', data.message);
            
            const state = data.message?.state;
            
            if (state.betting_round_complete) {
              goToNextPhase();
            }

            fetchGameState();
            break;
          case 'phase_changed':
            console.log('Fase alterada:', data.message);
            break;
          case 'game_updated':
          case 'round_updated':
            // Atualiza o estado para eventos de jogo
            break;
          default:
            console.log('Tipo de mensagem não tratado:', data.message.type);
        }
      }
    }

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error)
      setIsConnected(false);
    }

    ws.onclose = () => {
      console.log('WebSocket desconectado')
      setIsConnected(false);
    }

    // Cleanup: fecha o WebSocket quando o componente desmonta
    return () => {
      console.log('Fechando WebSocket...');
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [roomId, player?.id, setRoomState, fetchGameState]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Game Room {roomId}</h1>
      
      <div style={{ 
        marginBottom: '10px', 
        padding: '10px', 
        backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
        borderRadius: '5px'
      }}>
        Status: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
      </div>

      <button onClick={startGame} style={{ marginBottom: '20px' }}>
        Iniciar Jogo
      </button>

      <div style={{
        border: '1px solid #ccc',
        padding: '10px',
        minHeight: '300px',
        overflowY: 'auto',
        marginBottom: '10px'
      }}>
        <h2>Estado da Sala:</h2>
        <pre>{JSON.stringify(roomState, null, 2)}</pre>
      </div>
      <div className="flex flex-col gap-2">
        <span>
          Turno de: { roomState?.players?.find((p: PlayerProps["player"]) => p.id === roomState.current_turn_player_id)?.name }
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCheckAction}
          >
            Check
          </button>
          <button
            onClick={handleCallAction}
          >
            Call
          </button>
          <button>
            Raise
          </button>
          <button>
            Fold
          </button>
          <button>
            Show down
          </button>
        </div>
      </div>
      <Table>
        <CommunityCards cards={roomState?.community_cards.length ? roomState.community_cards : INITIAL_COMMUNITY_CARDS} />
      </Table>

      <div className="flex flex-wrap gap-4 mt-4">
        {roomState && roomState.players.map((p: PlayerProps["player"]) => (
          <Player 
            key={p.id} 
            player={p} 
            isCurrentTurn={roomState.current_turn_player_id === p.id} 
          />
        ))}
      </div>
    </div>
  );
}
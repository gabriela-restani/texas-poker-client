'use client';
import { texasPokerAPI } from '@/lib/texas-poker-api';
import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table } from '@/components/game/Table';
import { CommunityCards } from '@/components/game/CommunityCards';
import { 
  INITIAL_COMMUNITY_CARDS,
  GAME_PHASES_MAP,
  DECK_SVG_MAP,
} from '@/lib/constants';
import { Player } from '@/components/game/Player';
import type { PlayerProps } from '@/types/game';
import type { GameStateWinnerData } from '@/types/lib/texas-poker-api';
import { UiModal } from '@/components/ui/UiModal';
import { UiButton } from '@/components/ui/UiButton';
import { RaiseForm } from '@/components/game/RaiseForm';
import { Card } from '@/components/game/Card';

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export default function GamePage({ params }: GamePageProps) {
  const router = useRouter();
  const [roomState, setRoomState] = useState<any>(null);
  const [roomId] = useState<string>(React.use(params).id);
  const [isConnected, setIsConnected] = useState(false);
  const [winnerData, setWinnerData] = useState<GameStateWinnerData | null>(null);
  
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

  const isPlayersTurn = useMemo(() => 
    roomState?.current_turn_player_id === player?.id, 
    [roomState?.current_turn_player_id, player?.id]
  );

  const isPlayerFolded = useMemo(() => {
    if (!roomState || !player) return false;
    const currentPlayer = roomState.players.find((p: PlayerProps["player"]) => p.id === player.id);
    return currentPlayer ? currentPlayer.has_folded : false;
  }, [roomState, player]);

  const isGameStarted = useMemo(() => {
    if (!roomState) return false;
  }, 
    [roomState]
  );

  const isGameFinished = useMemo(() => 
    roomState?.phase === 'finished', 
    [roomState?.phase]
  );


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
      setWinnerData(state.winner_data || null);
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

  const endGame = useCallback(async () => {
    try {
      const response = await texasPokerAPI.endGame(parseInt(roomId));
      console.log('Jogo finalizado:', response);
    } catch (error) {
      console.error('Erro ao finalizar o jogo:', error);
    }
  }, [roomId]);

  const leaveGame = useCallback(async () => {
    try {
      const response = await texasPokerAPI.leaveRoom({
        roomId: parseInt(roomId),
        playerId: parseInt(player.id),
      });
      console.log('Jogador saiu da sala:', response);
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
    }
  }, [roomId, player]);

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
      
      if (data.message) {
        let state;

        switch (data.message.type) {
          case 'player_connected':
          case 'player_disconnected':
            fetchGameState();
            break;
          case 'player_action':
            fetchGameState();
            
            if (data.state?.betting_round_complete) {
              goToNextPhase();
            }
            break;
          case 'phase_changed':
            state = data.message?.state;
            setRoomState(state);
            
            if (state.phase === 'finished') {
              console.log('Jogo finalizado, definindo vencedores:', state.winners);
              setWinnerData(state.winner_data || null);
              endGame();
            }
            break;
          case 'game_ended':
            state = data.message?.state;
            setRoomState(state);
            setWinnerData(state.winner_data || null);
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
  }, [
    roomId, 
    player?.id, 
    isPlayerFolded,
    setRoomState, 
    fetchGameState, 
    goToNextPhase,
    handleFoldAction,
    endGame,
  ]);

  return (
    <div className="flex flex-col gap-4 p-5">
      <h1>Game Room {roomId}</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div 
          className={`w-fit p-3 rounded-lg
            ${isConnected ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}
          `}
        >
          Status: {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
        </div>

        <div className="flex gap-2">
          <UiButton 
            disabled={isGameStarted}
            onClick={startGame}
          >
            Iniciar Jogo
          </UiButton>
          <UiButton 
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isGameStarted && !isGameFinished}
            popoverTarget='leave-game-modal'
          >
            Sair da Sala
          </UiButton>
          <UiModal id='leave-game-modal'>
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-4">Deseja sair da sala?</h2>
              <UiButton
                className="bg-red-700 hover:bg-red-800 text-white"
                onClick={() => {
                  leaveGame();

                  const modal = document.getElementById('leave-game-modal');
                  if (modal) {
                    modal.hidePopover();
                  }

                  router.push('/rooms');
                }}
              >
                Confirmar
              </UiButton>
            </div>
          </UiModal>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span>Game Phase: {GAME_PHASES_MAP[roomState?.phase]}</span>
        <span>Pot: {roomState?.pot}</span>
        <span>
          Turno de: { roomState?.players?.find((p: PlayerProps["player"]) => p.id === roomState.current_turn_player_id)?.name }
        </span>
        <div className="flex gap-2">
          <UiButton
            onClick={handleCheckAction}
            disabled={isGameFinished || !isPlayersTurn}
          >
            Check
          </UiButton>
          <UiButton
            onClick={handleCallAction}
            disabled={isGameFinished || !isPlayersTurn}
          >
            Call
          </UiButton>
          <UiButton 
            popoverTarget='raise-modal'
            disabled={isGameFinished || !isPlayersTurn}
          >
            Raise
          </UiButton>
          <UiModal id='raise-modal'>
            <RaiseForm
              onSubmit={(amount: number) => {
                handleRaiseAction(amount);
                const modal = document.getElementById('raise-modal');
                if (modal) {
                  modal.hidePopover();
                }
              }}
            />
          </UiModal>
          <UiButton
            onClick={handleFoldAction}
            disabled={isGameFinished || !isPlayersTurn}
          >
            Fold
          </UiButton>
        </div>
      </div>
      {
        !isGameFinished && (<>
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
        </>)

      }

      {isGameFinished && winnerData?.winners && (
        <div className="mt-4 p-4 border rounded w-fit" >
          <h2 className="text-xl font-bold mb-2">Winners:</h2>
          <ul>
            {winnerData.winners.map((winner) => {
              console.log('Vencedor:', winner);
              return (
              <li key={winner.id} className="text-lg">
                <div>
                  Player: {winner.name} - Hand: {winner.hand} - Winnings: {winner.amount_won}
                </div>
                <div className="flex flex-row gap-2 mt-2">
                  {winner.hand_cards.map((card: string, index: number) => (
                    <Card 
                      key={index} 
                      cardKey={card as keyof typeof DECK_SVG_MAP} 
                    />
                  ))}
                </div>
              </li>
            )})}
          </ul>
        </div>
      )}
    </div>
  );
}
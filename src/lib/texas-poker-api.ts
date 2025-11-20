import type { 
  PlayerPayload, 
  PlayerCreateResponse, 
  DefaultResponse,
  RoomPayload,
  RoomCreateResponse,
  RoomJoinLeavePayload,
  RoomJoinResponse,
  GameStateResponse,
  GameStatePayload,
  GameActionPayload,
} from '@/types/lib/texas-poker-api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// API Client
class TexasPokerAPI {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // create /players - Listar jogadores
  async addPlayer(payload: PlayerPayload): Promise<PlayerCreateResponse> {
    return this.request<PlayerCreateResponse>('/players', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async deletePlayer(id: number): Promise<DefaultResponse> {
    return this.request<DefaultResponse>(`/players/${id}`, {
      method: 'DELETE',
    });
  }


  async getRooms(): Promise<string[]> {
    return this.request<string[]>('/rooms', {
      method: 'GET',
    });
  }

  async createRoom(payload: RoomPayload): Promise<RoomCreateResponse> {
    return this.request<RoomCreateResponse>('/rooms', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async joinRoom(payload: RoomJoinLeavePayload): Promise<RoomJoinResponse> {
    const { playerId, roomId } = payload;
    return this.request<RoomJoinResponse>(`/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({
        player_id: playerId
      }),
    });
  }

  async leaveRoom(payload: RoomJoinLeavePayload): Promise<RoomJoinResponse> {
    return this.request<RoomJoinResponse>(`/rooms/leave`, {
      method: 'POST',
      body: JSON.stringify({
        player_id: payload.playerId
      }),
    });
  }

  async startGame(roomId: number): Promise<DefaultResponse> {
    return this.request<DefaultResponse>(`/rooms/${roomId}/start`, {
      method: 'POST',
    });
  }

  async getGameState(payload: GameStatePayload): Promise<GameStateResponse> {
    const { roomId, playerId } = payload;
    const query = playerId ? `?player_id=${playerId}` : '';
    return this.request<GameStateResponse>(`/rooms/${roomId}/state${query}`, {
      method: 'GET',
    });
  }

  async makeGameAction(payload: GameActionPayload): Promise<DefaultResponse> {
    return this.request<DefaultResponse>(`/game/${payload.roomId}/action`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async goToNextPhase(roomId: number): Promise<DefaultResponse> {
    return this.request<DefaultResponse>(`/rooms/${roomId}/next-phase`, {
      method: 'POST',
    });
  }

  async endGame(roomId: number): Promise<DefaultResponse> {
    return this.request<DefaultResponse>(`/rooms/${roomId}/end`, {
      method: 'POST',
    });
  }
}

export const texasPokerAPI = new TexasPokerAPI();


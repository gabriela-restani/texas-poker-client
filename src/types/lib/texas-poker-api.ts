export interface DefaultResponse {
  message?: string;
  error?: string;
}

// Player related types
export interface PlayerPayload {
  name: string;
  chips?: number;
}

export interface PlayerCreateResponse {
  id: number;
  name: string;
  chips: number;
}

// Room related types
export interface RoomPayload {
  room: {
    name: string;
    max_players: number;
  };
}

export interface RoomCreateResponse {
  id: number;
  name: string;
  maxPlayers: number;
}

export interface RoomJoinLeavePayload {
  playerId: number;
  roomId: number;
}

export interface RoomJoinResponse {
  message?: string;
  roomId?: number;
  playerId?: number;
  error?: string;
}


interface GameStatePlayer {
  id: number;
  name: string;
  chips: number;
  bet: number;
  cards: string[];
  folded: boolean;
  position: number;
}

export interface GameStatePayload {
  roomId: number;
  playerId?: number;
}

export interface GameStateWinner {
  id: number;
  name: string;
  hand: string;
  hand_cards: string[];
  amount_won: number;
  cards: string[];
}
export interface GameStateWinnerData {
  winners: GameStateWinner[];
  pot: number;
  community_cards: string[];
}
export interface GameStateResponse {
  phase: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';
  dealer_position: number;
  small_blind_position: number;
  big_blind_position: number;
  current_turn_player_id: number;
  winners_data?: GameStateWinnerData;
  community_cards: string[];
  players: GameStatePlayer[];
  pot: number;
  current_bet: number;
}

export interface GameActionPayload {
  action: 'fold' | 'check' | 'call' | 'raise';
  amount?: number;
  player_id: number;
  room_id: number;
}
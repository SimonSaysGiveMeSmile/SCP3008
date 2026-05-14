export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  id: string;
  position: Vec3;
  rotation: number;
  health: number;
  name: string;
}

export interface NPCState {
  id: string;
  position: Vec3;
  rotation: number;
  type: 'tall' | 'short' | 'normal';
  isAggressive: boolean;
  health: number;
}

export interface GameState {
  timeOfDay: number; // 0-1, 0=midnight, 0.5=noon
  isNight: boolean;
  dayCount: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export type ServerEvents = {
  'game:state': (state: GameState) => void;
  'player:joined': (player: PlayerState) => void;
  'player:left': (id: string) => void;
  'player:moved': (player: PlayerState) => void;
  'players:list': (players: PlayerState[]) => void;
  'npc:update': (npcs: NPCState[]) => void;
  'player:damaged': (data: { id: string; health: number; attackerId: string }) => void;
  'chat:message': (msg: ChatMessage) => void;
};

export type ClientEvents = {
  'player:move': (data: { position: Vec3; rotation: number }) => void;
  'player:join': (name: string) => void;
  'chat:send': (text: string) => void;
};

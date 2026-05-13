import { create } from 'zustand';
import { PlayerState, NPCState, GameState, ChatMessage } from '../../../shared/types';

interface GameStore {
  // Connection
  connected: boolean;
  playerName: string;
  joined: boolean;
  setConnected: (v: boolean) => void;
  setPlayerName: (name: string) => void;
  setJoined: (v: boolean) => void;

  // Game state
  gameState: GameState;
  setGameState: (state: GameState) => void;

  // Players
  localPlayer: PlayerState | null;
  remotePlayers: Map<string, PlayerState>;
  setLocalPlayer: (p: PlayerState) => void;
  updateRemotePlayer: (p: PlayerState) => void;
  removeRemotePlayer: (id: string) => void;
  setRemotePlayers: (players: PlayerState[]) => void;

  // NPCs
  npcs: NPCState[];
  setNPCs: (npcs: NPCState[]) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;

  // Player health
  health: number;
  setHealth: (h: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  connected: false,
  playerName: '',
  joined: false,
  setConnected: (v) => set({ connected: v }),
  setPlayerName: (name) => set({ playerName: name }),
  setJoined: (v) => set({ joined: v }),

  gameState: { timeOfDay: 0.25, isNight: false, dayCount: 1 },
  setGameState: (state) => set({ gameState: state }),

  localPlayer: null,
  remotePlayers: new Map(),
  setLocalPlayer: (p) => set({ localPlayer: p }),
  updateRemotePlayer: (p) => set((state) => {
    const newMap = new Map(state.remotePlayers);
    newMap.set(p.id, p);
    return { remotePlayers: newMap };
  }),
  removeRemotePlayer: (id) => set((state) => {
    const newMap = new Map(state.remotePlayers);
    newMap.delete(id);
    return { remotePlayers: newMap };
  }),
  setRemotePlayers: (players) => set((state) => {
    const newMap = new Map();
    players.forEach(p => {
      if (p.id !== state.localPlayer?.id) {
        newMap.set(p.id, p);
      }
    });
    return { remotePlayers: newMap };
  }),

  npcs: [],
  setNPCs: (npcs) => set({ npcs }),

  messages: [],
  addMessage: (msg) => set((state) => ({
    messages: [...state.messages.slice(-50), msg]
  })),

  health: 100,
  setHealth: (h) => set({ health: h }),
}));

import { create } from 'zustand';
import { PlayerState, NPCState, GameState, ChatMessage } from '../../../shared/types';

export interface GameSettings {
  renderDistance: number;
  mouseSensitivity: number;
  fov: number;
  showFps: boolean;
}

export interface Weapon {
  name: string;
  damage: number;
  range: number;
  cooldown: number;
  icon: string;
}

export const WEAPONS: Weapon[] = [
  { name: 'Fists', damage: 5, range: 1.5, cooldown: 500, icon: 'fist' },
  { name: 'Chair Leg', damage: 12, range: 2.0, cooldown: 600, icon: 'club' },
  { name: 'Shelf Plank', damage: 18, range: 2.5, cooldown: 800, icon: 'plank' },
  { name: 'Table Leg', damage: 25, range: 2.2, cooldown: 700, icon: 'bat' },
];

interface GameStore {
  connected: boolean;
  playerName: string;
  joined: boolean;
  setConnected: (v: boolean) => void;
  setPlayerName: (name: string) => void;
  setJoined: (v: boolean) => void;

  gameState: GameState;
  setGameState: (state: GameState) => void;

  localPlayer: PlayerState | null;
  remotePlayers: Map<string, PlayerState>;
  setLocalPlayer: (p: PlayerState) => void;
  updateRemotePlayer: (p: PlayerState) => void;
  removeRemotePlayer: (id: string) => void;
  setRemotePlayers: (players: PlayerState[]) => void;

  npcs: NPCState[];
  setNPCs: (npcs: NPCState[]) => void;

  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;

  // Survival stats
  health: number;
  hunger: number;
  thirst: number;
  setHealth: (h: number) => void;
  setHunger: (h: number) => void;
  setThirst: (t: number) => void;

  // Weapon
  currentWeapon: number;
  lastAttackTime: number;
  setCurrentWeapon: (i: number) => void;
  setLastAttackTime: (t: number) => void;

  // Settings
  settings: GameSettings;
  setSettings: (s: Partial<GameSettings>) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;

  // Flashlight
  flashlightOn: boolean;
  toggleFlashlight: () => void;

  // Movable items displaced by player
  displacedItems: Map<string, { x: number; z: number }>;
  displaceItem: (key: string, x: number, z: number) => void;
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
  hunger: 100,
  thirst: 100,
  setHealth: (h) => set({ health: h }),
  setHunger: (h) => set({ hunger: h }),
  setThirst: (t) => set({ thirst: t }),

  currentWeapon: 0,
  lastAttackTime: 0,
  setCurrentWeapon: (i) => set({ currentWeapon: i }),
  setLastAttackTime: (t) => set({ lastAttackTime: t }),

  settings: {
    renderDistance: 3,
    mouseSensitivity: 1.0,
    fov: 75,
    showFps: false,
  },
  setSettings: (s) => set((state) => ({ settings: { ...state.settings, ...s } })),
  settingsOpen: false,
  setSettingsOpen: (v) => set({ settingsOpen: v }),

  flashlightOn: false,
  toggleFlashlight: () => set((state) => ({ flashlightOn: !state.flashlightOn })),

  displacedItems: new Map(),
  displaceItem: (key, x, z) => set((state) => {
    const newMap = new Map(state.displacedItems);
    newMap.set(key, { x, z });
    return { displacedItems: newMap };
  }),
}));

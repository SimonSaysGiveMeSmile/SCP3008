import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import { PlayerState, NPCState, GameState, ChatMessage, Vec3 } from '../../../shared/types';

let socket: Socket | null = null;

export function connectToServer() {
  if (socket) return socket;

  const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5002';
  socket = io(serverUrl);
  const store = useGameStore.getState();

  socket.on('connect', () => {
    useGameStore.getState().setConnected(true);
  });

  socket.on('disconnect', () => {
    useGameStore.getState().setConnected(false);
  });

  socket.on('game:state', (state: GameState) => {
    useGameStore.getState().setGameState(state);
  });

  socket.on('players:list', (players: PlayerState[]) => {
    const myId = socket!.id;
    const me = players.find(p => p.id === myId);
    if (me) {
      useGameStore.getState().setLocalPlayer(me);
      useGameStore.getState().setHealth(me.health);
    }
    useGameStore.getState().setRemotePlayers(players);
  });

  socket.on('player:joined', (player: PlayerState) => {
    useGameStore.getState().updateRemotePlayer(player);
  });

  socket.on('player:left', (id: string) => {
    useGameStore.getState().removeRemotePlayer(id);
  });

  socket.on('player:moved', (player: PlayerState) => {
    useGameStore.getState().updateRemotePlayer(player);
  });

  socket.on('npc:update', (npcs: NPCState[]) => {
    useGameStore.getState().setNPCs(npcs);
  });

  socket.on('player:damaged', (data: { id: string; health: number; attackerId: string }) => {
    if (data.id === socket!.id) {
      useGameStore.getState().setHealth(data.health);
    }
  });

  socket.on('chat:message', (msg: ChatMessage) => {
    useGameStore.getState().addMessage(msg);
  });

  return socket;
}

export function joinGame(name: string) {
  if (socket) {
    socket.emit('player:join', name);
    useGameStore.getState().setJoined(true);
  }
}

export function sendMovement(position: Vec3, rotation: number) {
  if (socket) {
    socket.emit('player:move', { position, rotation });
  }
}

export function sendChat(text: string) {
  if (socket) {
    socket.emit('chat:send', text);
  }
}

export function getSocket() {
  return socket;
}

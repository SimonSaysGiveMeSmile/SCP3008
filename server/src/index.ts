import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PlayerState, NPCState, GameState, Vec3 } from '../../shared/types';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const players = new Map<string, PlayerState>();
const npcs: NPCState[] = [];
const gameState: GameState = {
  timeOfDay: 0.333,
  isNight: false,
  dayCount: 1
};

const DAY_DURATION = 240000; // 4 minutes real time = 1 game day
const NIGHT_START = 0.75;
const NIGHT_END = 0.25;
const NPC_COUNT = 40;
const MAP_SIZE = 200;

function initNPCs() {
  for (let i = 0; i < NPC_COUNT; i++) {
    const types: Array<'tall' | 'short' | 'normal'> = ['tall', 'short', 'normal'];
    npcs.push({
      id: `npc-${i}`,
      position: {
        x: (Math.random() - 0.5) * MAP_SIZE,
        y: 0,
        z: (Math.random() - 0.5) * MAP_SIZE
      },
      rotation: Math.random() * Math.PI * 2,
      type: types[Math.floor(Math.random() * types.length)],
      isAggressive: false
    });
  }
}

function getClosestPlayer(npcPos: Vec3): PlayerState | null {
  let closest: PlayerState | null = null;
  let minDist = Infinity;
  for (const player of players.values()) {
    const dx = player.position.x - npcPos.x;
    const dz = player.position.z - npcPos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < minDist) {
      minDist = dist;
      closest = player;
    }
  }
  return minDist < 50 ? closest : null;
}

function updateNPCs() {
  const isNight = gameState.isNight;
  const NPC_RADIUS = 0.3;

  for (const npc of npcs) {
    npc.isAggressive = isNight;

    let moveX = 0;
    let moveZ = 0;

    if (isNight) {
      const target = getClosestPlayer(npc.position);
      if (target) {
        const dx = target.position.x - npc.position.x;
        const dz = target.position.z - npc.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist > 1.5) {
          const speed = 0.08;
          moveX = (dx / dist) * speed;
          moveZ = (dz / dist) * speed;
          npc.rotation = Math.atan2(dx, dz);
        } else {
          target.health = Math.max(0, target.health - 0.5);
          io.emit('player:damaged', {
            id: target.id,
            health: target.health,
            attackerId: npc.id
          });
        }
      }
    } else {
      npc.rotation += (Math.random() - 0.5) * 0.1;
      moveX = Math.sin(npc.rotation) * 0.02;
      moveZ = Math.cos(npc.rotation) * 0.02;
    }

    // NPC-NPC collision avoidance
    const newX = npc.position.x + moveX;
    const newZ = npc.position.z + moveZ;
    let blocked = false;
    for (const other of npcs) {
      if (other.id === npc.id) continue;
      const dx = newX - other.position.x;
      const dz = newZ - other.position.z;
      if (dx * dx + dz * dz < (NPC_RADIUS * 2) * (NPC_RADIUS * 2)) {
        blocked = true;
        break;
      }
    }

    // NPC-Player collision
    if (!blocked) {
      for (const player of players.values()) {
        const dx = newX - player.position.x;
        const dz = newZ - player.position.z;
        if (dx * dx + dz * dz < (NPC_RADIUS + 0.3) * (NPC_RADIUS + 0.3)) {
          blocked = true;
          break;
        }
      }
    }

    if (!blocked) {
      npc.position.x = newX;
      npc.position.z = newZ;
    } else if (isNight) {
      // Try to slide around obstacle
      npc.rotation += (Math.random() - 0.5) * 0.5;
    }

    // Keep within bounds
    if (Math.abs(npc.position.x) > MAP_SIZE / 2) npc.position.x *= 0.99;
    if (Math.abs(npc.position.z) > MAP_SIZE / 2) npc.position.z *= 0.99;
  }
}

function updateGameTime() {
  const increment = 1 / (DAY_DURATION / 50); // 50ms tick
  gameState.timeOfDay = (gameState.timeOfDay + increment) % 1;

  const wasNight = gameState.isNight;
  gameState.isNight = gameState.timeOfDay >= NIGHT_START || gameState.timeOfDay < NIGHT_END;

  if (wasNight && !gameState.isNight) {
    gameState.dayCount++;
  }
}

initNPCs();

setInterval(() => {
  updateGameTime();
  updateNPCs();
  io.emit('game:state', gameState);
  io.emit('npc:update', npcs);
}, 50);

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('player:join', (name: string) => {
    const player: PlayerState = {
      id: socket.id,
      name,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      health: 100
    };
    players.set(socket.id, player);

    socket.emit('players:list', Array.from(players.values()));
    socket.emit('game:state', gameState);
    socket.broadcast.emit('player:joined', player);
  });

  socket.on('player:move', (data: { position: Vec3; rotation: number }) => {
    const player = players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
      socket.broadcast.emit('player:moved', player);
    }
  });

  socket.on('chat:send', (text: string) => {
    const player = players.get(socket.id);
    if (player) {
      io.emit('chat:message', {
        id: `${Date.now()}-${socket.id}`,
        sender: player.name,
        text,
        timestamp: Date.now()
      });
    }
  });

  socket.on('attack:npc', (data: { npcId: string; damage: number }) => {
    const npc = npcs.find(n => n.id === data.npcId);
    if (npc) {
      // NPCs become aggressive when attacked
      npc.isAggressive = true;
    }
  });

  socket.on('attack:player', (data: { targetId: string; damage: number }) => {
    const target = players.get(data.targetId);
    if (target) {
      const dmg = Math.min(data.damage, 30); // cap damage to prevent cheating
      target.health = Math.max(0, target.health - dmg);
      io.emit('player:damaged', {
        id: data.targetId,
        health: target.health,
        attackerId: socket.id
      });
    }
  });

  socket.on('disconnect', () => {
    players.delete(socket.id);
    io.emit('player:left', socket.id);
    console.log(`Player disconnected: ${socket.id}`);
  });
});

const PORT = 5002;
httpServer.listen(PORT, () => {
  console.log(`SCP-3008 server running on port ${PORT}`);
});

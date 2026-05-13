import { useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getChunkData, CHUNK_SIZE } from '../utils/worldGen';

const MINIMAP_SIZE = 180;
const MINIMAP_RANGE = 80;

const SECTION_COLORS: Record<string, string> = {
  bathroom: '#4488cc',
  kitchen: '#cc8844',
  living: '#44aa44',
  bedroom: '#aa44aa',
  lighting: '#cccc44',
  gardening: '#22aa22',
  furniture: '#aa6633',
  workspace: '#6666cc',
  productivity: '#44cccc'
};

export default function Minimap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameStore(s => s.gameState);
  const npcs = useGameStore(s => s.npcs);
  const remotePlayers = useGameStore(s => s.remotePlayers);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    const ctx = canvas.getContext('2d')!;

    function draw() {
      const playerPos = { x: 0, z: 0 };
      // Read from the Three.js camera position via a global
      if ((window as any).__playerPos) {
        playerPos.x = (window as any).__playerPos.x;
        playerPos.z = (window as any).__playerPos.z;
      }

      ctx.fillStyle = gameState.isNight ? '#0a0a15' : '#1a1a1a';
      ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

      const scale = MINIMAP_SIZE / (MINIMAP_RANGE * 2);

      // Draw chunk sections as colored backgrounds
      const cx = Math.floor(playerPos.x / CHUNK_SIZE);
      const cz = Math.floor(playerPos.z / CHUNK_SIZE);
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          const chunk = getChunkData(cx + dx, cz + dz);
          const chunkWorldX = (cx + dx) * CHUNK_SIZE;
          const chunkWorldZ = (cz + dz) * CHUNK_SIZE;

          const screenX = MINIMAP_SIZE / 2 + (chunkWorldX - playerPos.x) * scale;
          const screenZ = MINIMAP_SIZE / 2 + (chunkWorldZ - playerPos.z) * scale;
          const chunkScreenSize = CHUNK_SIZE * scale;

          ctx.fillStyle = SECTION_COLORS[chunk.section] || '#333333';
          ctx.globalAlpha = 0.25;
          ctx.fillRect(
            screenX - chunkScreenSize / 2,
            screenZ - chunkScreenSize / 2,
            chunkScreenSize,
            chunkScreenSize
          );
          ctx.globalAlpha = 1;

          // Draw furniture dots
          ctx.fillStyle = '#555555';
          for (const item of chunk.items) {
            const ix = MINIMAP_SIZE / 2 + (item.position[0] - playerPos.x) * scale;
            const iz = MINIMAP_SIZE / 2 + (item.position[2] - playerPos.z) * scale;
            if (ix >= 0 && ix <= MINIMAP_SIZE && iz >= 0 && iz <= MINIMAP_SIZE) {
              ctx.fillRect(ix - 1, iz - 1, 2, 2);
            }
          }

          // Draw settlements
          for (const s of chunk.settlements) {
            const sx = MINIMAP_SIZE / 2 + (s.position[0] - playerPos.x) * scale;
            const sz = MINIMAP_SIZE / 2 + (s.position[2] - playerPos.z) * scale;
            if (sx >= -20 && sx <= MINIMAP_SIZE + 20 && sz >= -20 && sz <= MINIMAP_SIZE + 20) {
              ctx.strokeStyle = '#ffaa00';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(sx, sz, s.radius * scale, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // Draw NPCs
      const currentNpcs = useGameStore.getState().npcs;
      for (const npc of currentNpcs) {
        const nx = MINIMAP_SIZE / 2 + (npc.position.x - playerPos.x) * scale;
        const nz = MINIMAP_SIZE / 2 + (npc.position.z - playerPos.z) * scale;
        if (nx >= 0 && nx <= MINIMAP_SIZE && nz >= 0 && nz <= MINIMAP_SIZE) {
          ctx.fillStyle = npc.isAggressive ? '#ff3333' : '#ffcc00';
          ctx.beginPath();
          ctx.arc(nx, nz, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw remote players
      const players = useGameStore.getState().remotePlayers;
      for (const [, p] of players) {
        const px = MINIMAP_SIZE / 2 + (p.position.x - playerPos.x) * scale;
        const pz = MINIMAP_SIZE / 2 + (p.position.z - playerPos.z) * scale;
        if (px >= 0 && px <= MINIMAP_SIZE && pz >= 0 && pz <= MINIMAP_SIZE) {
          ctx.fillStyle = '#44ff44';
          ctx.beginPath();
          ctx.arc(px, pz, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw player (center)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(MINIMAP_SIZE / 2, MINIMAP_SIZE / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Player direction indicator
      const dir = (window as any).__playerRot || 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(MINIMAP_SIZE / 2, MINIMAP_SIZE / 2);
      ctx.lineTo(
        MINIMAP_SIZE / 2 + Math.sin(dir) * 10,
        MINIMAP_SIZE / 2 - Math.cos(dir) * 10
      );
      ctx.stroke();

      // Border
      ctx.strokeStyle = '#444444';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [gameState.isNight]);

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '2px solid #333',
      opacity: 0.85
    }}>
      <canvas
        ref={canvasRef}
        width={MINIMAP_SIZE}
        height={MINIMAP_SIZE}
        style={{ display: 'block' }}
      />
      <div style={{
        position: 'absolute', bottom: '4px', left: '4px',
        color: '#888', fontSize: '9px', fontFamily: 'Courier New'
      }}>
        MAP
      </div>
    </div>
  );
}

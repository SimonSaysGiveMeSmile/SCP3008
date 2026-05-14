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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    const ctx = canvas.getContext('2d')!;
    const center = MINIMAP_SIZE / 2;

    function rotatePoint(x: number, z: number, angle: number): [number, number] {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [x * cos - z * sin, x * sin + z * cos];
    }

    function draw() {
      const playerPos = { x: 0, z: 0 };
      if ((window as any).__playerPos) {
        playerPos.x = (window as any).__playerPos.x;
        playerPos.z = (window as any).__playerPos.z;
      }
      const playerRot = (window as any).__playerRot || 0;

      ctx.fillStyle = gameState.isNight ? '#0a0a15' : '#1a1a1a';
      ctx.fillRect(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);

      const scale = MINIMAP_SIZE / (MINIMAP_RANGE * 2);

      const cx = Math.floor(playerPos.x / CHUNK_SIZE);
      const cz = Math.floor(playerPos.z / CHUNK_SIZE);
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          const chunk = getChunkData(cx + dx, cz + dz);
          const chunkWorldX = (cx + dx) * CHUNK_SIZE;
          const chunkWorldZ = (cz + dz) * CHUNK_SIZE;

          const relX = (chunkWorldX - playerPos.x) * scale;
          const relZ = (chunkWorldZ - playerPos.z) * scale;
          const [rx, rz] = rotatePoint(relX, relZ, playerRot);
          const screenX = center + rx;
          const screenZ = center + rz;
          const chunkScreenSize = CHUNK_SIZE * scale;

          ctx.save();
          ctx.translate(screenX, screenZ);
          ctx.rotate(playerRot);
          ctx.fillStyle = SECTION_COLORS[chunk.section] || '#333333';
          ctx.globalAlpha = 0.25;
          ctx.fillRect(-chunkScreenSize / 2, -chunkScreenSize / 2, chunkScreenSize, chunkScreenSize);
          ctx.globalAlpha = 1;
          ctx.restore();

          ctx.fillStyle = '#555555';
          for (const item of chunk.items) {
            const ix = (item.position[0] - playerPos.x) * scale;
            const iz = (item.position[2] - playerPos.z) * scale;
            const [rix, riz] = rotatePoint(ix, iz, playerRot);
            const sx = center + rix;
            const sz = center + riz;
            if (sx >= 0 && sx <= MINIMAP_SIZE && sz >= 0 && sz <= MINIMAP_SIZE) {
              ctx.fillRect(sx - 1, sz - 1, 2, 2);
            }
          }

          for (const s of chunk.settlements) {
            const sx = (s.position[0] - playerPos.x) * scale;
            const sz = (s.position[2] - playerPos.z) * scale;
            const [rsx, rsz] = rotatePoint(sx, sz, playerRot);
            const scrX = center + rsx;
            const scrZ = center + rsz;
            if (scrX >= -20 && scrX <= MINIMAP_SIZE + 20 && scrZ >= -20 && scrZ <= MINIMAP_SIZE + 20) {
              ctx.strokeStyle = '#ffaa00';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(scrX, scrZ, s.radius * scale, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      // NPCs
      const currentNpcs = useGameStore.getState().npcs;
      for (const npc of currentNpcs) {
        const nx = (npc.position.x - playerPos.x) * scale;
        const nz = (npc.position.z - playerPos.z) * scale;
        const [rnx, rnz] = rotatePoint(nx, nz, playerRot);
        const sx = center + rnx;
        const sz = center + rnz;
        if (sx >= 0 && sx <= MINIMAP_SIZE && sz >= 0 && sz <= MINIMAP_SIZE) {
          ctx.fillStyle = npc.isAggressive ? '#ff3333' : '#ffcc00';
          ctx.beginPath();
          ctx.arc(sx, sz, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Remote players
      const players = useGameStore.getState().remotePlayers;
      for (const [, p] of players) {
        const px = (p.position.x - playerPos.x) * scale;
        const pz = (p.position.z - playerPos.z) * scale;
        const [rpx, rpz] = rotatePoint(px, pz, playerRot);
        const sx = center + rpx;
        const sz = center + rpz;
        if (sx >= 0 && sx <= MINIMAP_SIZE && sz >= 0 && sz <= MINIMAP_SIZE) {
          ctx.fillStyle = '#44ff44';
          ctx.beginPath();
          ctx.arc(sx, sz, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Player dot (fixed center)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(center, center, 4, 0, Math.PI * 2);
      ctx.fill();

      // Direction indicator (always points up)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center, center - 12);
      ctx.stroke();

      // North indicator
      ctx.fillStyle = '#ff4444';
      ctx.font = '9px Courier New';
      ctx.textAlign = 'center';
      const [nxr, nzr] = rotatePoint(0, -1, playerRot);
      ctx.fillText('N', center + nxr * 82, center + nzr * 82 + 3);

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
      position: 'absolute', bottom: '20px', right: '20px',
      borderRadius: '4px', overflow: 'hidden', border: '2px solid #333', opacity: 0.85
    }}>
      <canvas ref={canvasRef} width={MINIMAP_SIZE} height={MINIMAP_SIZE} style={{ display: 'block' }} />
      <div style={{ position: 'absolute', bottom: '4px', left: '4px', color: '#888', fontSize: '9px', fontFamily: 'Courier New' }}>
        MAP
      </div>
    </div>
  );
}

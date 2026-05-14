import { Vec3 } from '../../../shared/types';

export interface AABB {
  minX: number;
  minZ: number;
  maxX: number;
  maxZ: number;
}

export interface FurnitureItem {
  type: string;
  position: [number, number, number];
  rotation: number;
  scale?: [number, number, number];
  collider: AABB;
}

export interface Settlement {
  position: [number, number, number];
  radius: number;
  name: string;
  population: number;
}

export interface ChunkData {
  items: FurnitureItem[];
  section: string;
  settlements: Settlement[];
}

export const CHUNK_SIZE = 40;
export const RENDER_DISTANCE = 3;
export const CEILING_HEIGHT = 9;

const SECTIONS = [
  'bathroom', 'kitchen', 'living', 'bedroom', 'lighting',
  'gardening', 'furniture', 'workspace', 'productivity'
];

const SECTION_DISPLAY: Record<string, string> = {
  bathroom: 'BADRUM',
  kitchen: 'KÖK',
  living: 'VARDAGSRUM',
  bedroom: 'SOVRUM',
  lighting: 'BELYSNING',
  gardening: 'TRÄDGÅRD',
  furniture: 'MÖBLER',
  workspace: 'ARBETSPLATS',
  productivity: 'KONTOR'
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

class SeededRNG {
  private seed: number;
  constructor(seed: number) { this.seed = seed; }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (this.seed >>> 0) / 0xFFFFFFFF;
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max));
  }
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length)];
  }
}

function makeCollider(x: number, z: number, w: number, d: number, rot: number): AABB {
  const hw = w / 2;
  const hd = d / 2;
  if (rot % Math.PI === 0) {
    return { minX: x - hw, minZ: z - hd, maxX: x + hw, maxZ: z + hd };
  }
  return { minX: x - hd, minZ: z - hw, maxX: x + hd, maxZ: z + hw };
}

function generateSectionItems(rng: SeededRNG, section: string, baseX: number, baseZ: number): FurnitureItem[] {
  const items: FurnitureItem[] = [];
  const density = 90;
  const isSpawnChunk = baseX === 0 && baseZ === 0;

  for (let i = 0; i < density; i++) {
    const x = baseX + rng.range(-CHUNK_SIZE / 2 + 2, CHUNK_SIZE / 2 - 2);
    const z = baseZ + rng.range(-CHUNK_SIZE / 2 + 2, CHUNK_SIZE / 2 - 2);
    const rot = rng.int(0, 4) * (Math.PI / 2);

    // Keep spawn area clear
    if (isSpawnChunk && x * x + z * z < 16) continue;

    switch (section) {
      case 'bathroom':
        if (i < 10) items.push({ type: 'bathtub', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.8, 0.8, rot) });
        else if (i < 20) items.push({ type: 'sink', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.6, 0.5, rot) });
        else if (i < 30) items.push({ type: 'mirror_cabinet', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.8, 0.3, rot) });
        else if (i < 38) items.push({ type: 'towel_rack', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.8, 0.2, rot) });
        else items.push({ type: 'toilet', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.5, 0.7, rot) });
        break;
      case 'kitchen':
        if (i < 12) items.push({ type: 'kitchen_counter', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 2.0, 0.6, rot) });
        else if (i < 22) items.push({ type: 'kitchen_table', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.4, 0.9, rot) });
        else if (i < 30) items.push({ type: 'kitchen_chair', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.45, 0.45, rot) });
        else if (i < 38) items.push({ type: 'cabinet_tall', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.6, 0.4, rot) });
        else items.push({ type: 'kitchen_island', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.8, 0.9, rot) });
        break;
      case 'living':
        if (i < 10) items.push({ type: 'sofa', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 2.2, 0.9, rot) });
        else if (i < 18) items.push({ type: 'coffee_table', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.2, 0.6, rot) });
        else if (i < 25) items.push({ type: 'tv_stand', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.6, 0.4, rot) });
        else if (i < 32) items.push({ type: 'bookshelf', position: [x, 0, z], rotation: rot, scale: [1.2, 2.2, 0.4], collider: makeCollider(x, z, 1.2, 0.4, rot) });
        else if (i < 38) items.push({ type: 'armchair', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.9, 0.9, rot) });
        else items.push({ type: 'floor_lamp', position: [x, 0, z], rotation: 0, collider: makeCollider(x, z, 0.3, 0.3, 0) });
        break;
      case 'bedroom':
        if (i < 12) items.push({ type: 'bed', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 2.0, 1.6, rot) });
        else if (i < 20) items.push({ type: 'wardrobe', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.5, 0.6, rot) });
        else if (i < 28) items.push({ type: 'nightstand', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.5, 0.4, rot) });
        else if (i < 35) items.push({ type: 'dresser', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.2, 0.5, rot) });
        else items.push({ type: 'floor_lamp', position: [x, 0, z], rotation: 0, collider: makeCollider(x, z, 0.3, 0.3, 0) });
        break;
      case 'lighting':
        if (i < 15) items.push({ type: 'floor_lamp', position: [x, 0, z], rotation: 0, collider: makeCollider(x, z, 0.4, 0.4, 0) });
        else if (i < 28) items.push({ type: 'lamp_display', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.0, 0.6, rot) });
        else if (i < 38) items.push({ type: 'chandelier_display', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.8, 0.8, rot) });
        else items.push({ type: 'shelf', position: [x, 0, z], rotation: rot, scale: [2, 1.8, 0.5], collider: makeCollider(x, z, 2, 0.5, rot) });
        break;
      case 'gardening':
        if (i < 12) items.push({ type: 'plant_pot', position: [x, 0, z], rotation: 0, collider: makeCollider(x, z, 0.5, 0.5, 0) });
        else if (i < 22) items.push({ type: 'garden_shelf', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.5, 0.5, rot) });
        else if (i < 32) items.push({ type: 'outdoor_table', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.2, 1.2, rot) });
        else if (i < 40) items.push({ type: 'outdoor_chair', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.6, 0.6, rot) });
        else items.push({ type: 'planter_box', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.0, 0.4, rot) });
        break;
      case 'furniture':
        if (i < 10) items.push({ type: 'shelf', position: [x, 0, z], rotation: rot, scale: [3, 3, 0.6], collider: makeCollider(x, z, 3, 0.6, rot) });
        else if (i < 18) items.push({ type: 'display_table', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.8, 0.9, rot) });
        else if (i < 26) items.push({ type: 'wardrobe', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.5, 0.6, rot) });
        else if (i < 34) items.push({ type: 'bookshelf', position: [x, 0, z], rotation: rot, scale: [1.0, 2.5, 0.4], collider: makeCollider(x, z, 1.0, 0.4, rot) });
        else items.push({ type: 'cabinet_tall', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.8, 0.5, rot) });
        break;
      case 'workspace':
        if (i < 12) items.push({ type: 'desk', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.6, 0.8, rot) });
        else if (i < 22) items.push({ type: 'office_chair', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.6, 0.6, rot) });
        else if (i < 30) items.push({ type: 'bookshelf', position: [x, 0, z], rotation: rot, scale: [0.8, 2.0, 0.35], collider: makeCollider(x, z, 0.8, 0.35, rot) });
        else if (i < 38) items.push({ type: 'filing_cabinet', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.5, 0.6, rot) });
        else items.push({ type: 'desk_lamp', position: [x, 0, z], rotation: 0, collider: makeCollider(x, z, 0.3, 0.3, 0) });
        break;
      case 'productivity':
        if (i < 12) items.push({ type: 'standing_desk', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.4, 0.7, rot) });
        else if (i < 20) items.push({ type: 'shelf', position: [x, 0, z], rotation: rot, scale: [1.5, 1.8, 0.4], collider: makeCollider(x, z, 1.5, 0.4, rot) });
        else if (i < 28) items.push({ type: 'whiteboard', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 1.5, 0.1, rot) });
        else if (i < 36) items.push({ type: 'office_chair', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.6, 0.6, rot) });
        else items.push({ type: 'storage_box', position: [x, 0, z], rotation: rot, collider: makeCollider(x, z, 0.5, 0.4, rot) });
        break;
    }
  }

  // Add aisle divider shelves (tall warehouse-style)
  for (let i = 0; i < 7; i++) {
    const x = baseX + rng.range(-CHUNK_SIZE / 2 + 3, CHUNK_SIZE / 2 - 3);
    const z = baseZ + rng.range(-CHUNK_SIZE / 2 + 3, CHUNK_SIZE / 2 - 3);
    if (isSpawnChunk && x * x + z * z < 25) continue;
    const rot = rng.int(0, 2) * Math.PI;
    items.push({
      type: 'warehouse_shelf',
      position: [x, 0, z],
      rotation: rot,
      scale: [5, 4, 0.8],
      collider: makeCollider(x, z, 5, 0.8, rot)
    });
    // Items on top of shelves
    for (let j = 0; j < 3; j++) {
      const ox = rng.range(-1.5, 1.5);
      items.push({
        type: 'storage_box',
        position: [x + ox, 4.2, z + rng.range(-0.2, 0.2)],
        rotation: rng.range(0, Math.PI * 2),
        scale: [0.5, 0.4, 0.4],
        collider: { minX: 0, minZ: 0, maxX: 0, maxZ: 0 }
      });
    }
  }

  // Maze walls — create narrow corridor-like structure
  if (!isSpawnChunk) {
  const wallCount = 5 + rng.int(0, 4);
  for (let i = 0; i < wallCount; i++) {
    const horizontal = rng.next() > 0.5;
    const wallLen = rng.range(8, 18);
    const gapPos = rng.range(0.2, 0.8);
    const gapSize = rng.range(1.2, 2.5);

    if (horizontal) {
      const z = baseZ + rng.range(-CHUNK_SIZE / 2 + 4, CHUNK_SIZE / 2 - 4);
      const startX = baseX + rng.range(-CHUNK_SIZE / 2 + 2, CHUNK_SIZE / 2 - wallLen);
      // First segment
      const seg1Len = wallLen * gapPos - gapSize / 2;
      if (seg1Len > 1) {
        const wx = startX + seg1Len / 2;
        items.push({
          type: 'wall', position: [wx, 0, z], rotation: 0,
          scale: [seg1Len, 3.5, 0.2],
          collider: makeCollider(wx, z, seg1Len, 0.2, 0)
        });
        items.push({
          type: 'wall_top', position: [wx, 3.5, z], rotation: 0,
          scale: [seg1Len, 0.3, 0.25],
          collider: { minX: 0, minZ: 0, maxX: 0, maxZ: 0 }
        });
      }
      // Second segment
      const seg2Start = startX + wallLen * gapPos + gapSize / 2;
      const seg2Len = wallLen - wallLen * gapPos - gapSize / 2;
      if (seg2Len > 1) {
        const wx = seg2Start + seg2Len / 2;
        items.push({
          type: 'wall', position: [wx, 0, z], rotation: 0,
          scale: [seg2Len, 3.5, 0.2],
          collider: makeCollider(wx, z, seg2Len, 0.2, 0)
        });
        items.push({
          type: 'wall_top', position: [wx, 3.5, z], rotation: 0,
          scale: [seg2Len, 0.3, 0.25],
          collider: { minX: 0, minZ: 0, maxX: 0, maxZ: 0 }
        });
      }
    } else {
      const x = baseX + rng.range(-CHUNK_SIZE / 2 + 4, CHUNK_SIZE / 2 - 4);
      const startZ = baseZ + rng.range(-CHUNK_SIZE / 2 + 2, CHUNK_SIZE / 2 - wallLen);
      const seg1Len = wallLen * gapPos - gapSize / 2;
      if (seg1Len > 1) {
        const wz = startZ + seg1Len / 2;
        items.push({
          type: 'wall', position: [x, 0, wz], rotation: Math.PI / 2,
          scale: [seg1Len, 3.5, 0.2],
          collider: makeCollider(x, wz, 0.2, seg1Len, Math.PI / 2)
        });
        items.push({
          type: 'wall_top', position: [x, 3.5, wz], rotation: Math.PI / 2,
          scale: [seg1Len, 0.3, 0.25],
          collider: { minX: 0, minZ: 0, maxX: 0, maxZ: 0 }
        });
      }
      const seg2Start = startZ + wallLen * gapPos + gapSize / 2;
      const seg2Len = wallLen - wallLen * gapPos - gapSize / 2;
      if (seg2Len > 1) {
        const wz = seg2Start + seg2Len / 2;
        items.push({
          type: 'wall', position: [x, 0, wz], rotation: Math.PI / 2,
          scale: [seg2Len, 3.5, 0.2],
          collider: makeCollider(x, wz, 0.2, seg2Len, Math.PI / 2)
        });
        items.push({
          type: 'wall_top', position: [x, 3.5, wz], rotation: Math.PI / 2,
          scale: [seg2Len, 0.3, 0.25],
          collider: { minX: 0, minZ: 0, maxX: 0, maxZ: 0 }
        });
      }
    }
  }
  } // end if (!isSpawnChunk)

  return items;
}

const WORLD_SEED = 30081337;

const chunkCache = new Map<string, ChunkData>();

export function getChunkData(chunkX: number, chunkZ: number): ChunkData {
  const key = `${chunkX},${chunkZ}`;
  if (chunkCache.has(key)) return chunkCache.get(key)!;

  const seed = WORLD_SEED + chunkX * 73856093 + chunkZ * 19349663;
  const rng = new SeededRNG(seed);

  const section = SECTIONS[Math.abs(seed) % SECTIONS.length];
  const baseX = chunkX * CHUNK_SIZE;
  const baseZ = chunkZ * CHUNK_SIZE;

  const items = generateSectionItems(rng, section, baseX, baseZ);

  // Settlements appear in some chunks
  const settlements: Settlement[] = [];
  const settlementChance = seededRandom(seed + 999);
  if (settlementChance > 0.85) {
    const names = ['Haven', 'The Bunker', 'Shelf City', 'Fort Kallax', 'Lamplight', 'The Exchange', 'Meatball Station', 'Outpost Billy'];
    settlements.push({
      position: [baseX + rng.range(-5, 5), 0, baseZ + rng.range(-5, 5)],
      radius: rng.range(4, 8),
      name: rng.pick(names),
      population: rng.int(3, 12)
    });
  }

  const data: ChunkData = { items, section, settlements };
  chunkCache.set(key, data);
  return data;
}

export function getSectionDisplay(section: string): string {
  return SECTION_DISPLAY[section] || 'IKEA';
}

export function getColliders(chunkX: number, chunkZ: number): AABB[] {
  const data = getChunkData(chunkX, chunkZ);
  return data.items
    .map(item => item.collider)
    .filter(c => c.maxX - c.minX > 0.01 && c.maxZ - c.minZ > 0.01);
}

export function checkCollision(px: number, pz: number, radius: number, chunks: Array<{x: number; z: number}>): boolean {
  for (const chunk of chunks) {
    const colliders = getColliders(chunk.x, chunk.z);
    for (const c of colliders) {
      const closestX = Math.max(c.minX, Math.min(px, c.maxX));
      const closestZ = Math.max(c.minZ, Math.min(pz, c.maxZ));
      const dx = px - closestX;
      const dz = pz - closestZ;
      if (dx * dx + dz * dz < radius * radius) {
        return true;
      }
    }
  }
  return false;
}

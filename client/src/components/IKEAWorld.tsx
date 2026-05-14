import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useState } from 'react';
import { Text } from '@react-three/drei';
import { getChunkData, getSectionDisplay, CHUNK_SIZE, RENDER_DISTANCE, CEILING_HEIGHT, FurnitureItem, Settlement, Restaurant } from '../utils/worldGen';
import { useGameStore } from '../store/gameStore';

const FLOOR_COLORS: Record<string, string> = {
  bathroom: '#b8ccd9',
  kitchen: '#d9ccb8',
  living: '#c4d4c4',
  bedroom: '#d4c4d4',
  lighting: '#d9d4b8',
  gardening: '#b8d9b8',
  furniture: '#d4c8b8',
  workspace: '#c4c4d9',
  productivity: '#b8d4d4'
};

const COLORS: Record<string, string> = {
  sofa: '#4a6fa5', coffee_table: '#c49a6c', bed: '#d4a574', bookshelf: '#d4a574',
  wardrobe: '#f0e6d2', nightstand: '#d4a574', dresser: '#e8dcc8', floor_lamp: '#444444',
  desk: '#f5e6d3', office_chair: '#333333', bathtub: '#ffffff', sink: '#ffffff',
  mirror_cabinet: '#aaccee', towel_rack: '#cccccc', toilet: '#ffffff',
  kitchen_counter: '#f0e6d2', kitchen_table: '#f5e6d3', kitchen_chair: '#d4a574',
  cabinet_tall: '#f0e6d2', kitchen_island: '#e8dcc8', plant_pot: '#228833',
  garden_shelf: '#8b6914', outdoor_table: '#888888', outdoor_chair: '#888888',
  planter_box: '#8b6914', shelf: '#d4a574', warehouse_shelf: '#555555',
  tv_stand: '#333333', armchair: '#8b4513', lamp_display: '#e8e0d4',
  chandelier_display: '#ccaa44', standing_desk: '#f5e6d3', whiteboard: '#ffffff',
  filing_cabinet: '#666666', storage_box: '#336699', desk_lamp: '#444444',
  display_table: '#e8dcc8', wall: '#d9d0c4', wall_top: '#c8bfb3'
};

function getItemDimensions(item: FurnitureItem): [number, number, number] {
  if (item.scale) return item.scale;
  switch (item.type) {
    case 'sofa': return [2.2, 0.7, 0.9];
    case 'coffee_table': return [1.2, 0.45, 0.6];
    case 'bed': return [2.0, 0.6, 1.6];
    case 'bookshelf': return [1.2, 2.2, 0.4];
    case 'wardrobe': return [1.5, 2.0, 0.6];
    case 'nightstand': return [0.5, 0.6, 0.4];
    case 'dresser': return [1.2, 1.0, 0.5];
    case 'floor_lamp': return [0.3, 1.8, 0.3];
    case 'desk': return [1.6, 0.78, 0.8];
    case 'office_chair': return [0.5, 1.0, 0.5];
    case 'bathtub': return [1.8, 0.55, 0.8];
    case 'sink': return [0.6, 0.9, 0.5];
    case 'mirror_cabinet': return [0.8, 0.7, 0.15];
    case 'towel_rack': return [0.8, 0.4, 0.1];
    case 'toilet': return [0.5, 0.5, 0.7];
    case 'kitchen_counter': return [2.0, 0.93, 0.6];
    case 'kitchen_table': return [1.4, 0.78, 0.9];
    case 'kitchen_chair': return [0.45, 0.9, 0.45];
    case 'cabinet_tall': return [0.6, 2.0, 0.4];
    case 'kitchen_island': return [1.8, 0.93, 0.9];
    case 'plant_pot': return [0.4, 0.7, 0.4];
    case 'garden_shelf': return [1.5, 1.6, 0.5];
    case 'outdoor_table': return [1.2, 0.72, 1.2];
    case 'outdoor_chair': return [0.5, 0.8, 0.5];
    case 'planter_box': return [1.0, 0.55, 0.4];
    case 'shelf': return [2, 1.8, 0.5];
    case 'warehouse_shelf': return [5, 4, 0.8];
    case 'tv_stand': return [1.6, 1.0, 0.4];
    case 'armchair': return [0.8, 0.8, 0.8];
    case 'lamp_display': return [1.0, 1.5, 0.6];
    case 'chandelier_display': return [0.8, 2.0, 0.8];
    case 'standing_desk': return [1.4, 1.05, 0.7];
    case 'whiteboard': return [1.5, 1.1, 0.08];
    case 'filing_cabinet': return [0.5, 1.2, 0.6];
    case 'storage_box': return [0.5, 0.42, 0.4];
    case 'desk_lamp': return [0.2, 0.3, 0.2];
    case 'display_table': return [1.8, 0.44, 0.9];
    case 'wall': return [8, 3.5, 0.2];
    case 'wall_top': return [8, 0.3, 0.25];
    default: return [1, 1, 1];
  }
}

function InstancedChunk({ items }: { items: FurnitureItem[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const frameCount = useRef(0);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(items.length * 3);
    items.forEach((item, i) => {
      const color = new THREE.Color(COLORS[item.type] || '#888888');
      arr[i * 3] = color.r;
      arr[i * 3 + 1] = color.g;
      arr[i * 3 + 2] = color.b;
    });
    return arr;
  }, [items]);

  useEffect(() => {
    if (!meshRef.current) return;
    items.forEach((item, i) => {
      const dims = getItemDimensions(item);
      dummy.position.set(item.position[0], item.position[1] + dims[1] / 2, item.position[2]);
      dummy.rotation.set(0, item.rotation, 0);
      dummy.scale.set(dims[0], dims[1], dims[2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [items, dummy]);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 15 !== 0) return;
    if (!meshRef.current) return;
    let needsUpdate = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.movable) continue;
      const dims = getItemDimensions(item);
      dummy.position.set(item.position[0], item.position[1] + dims[1] / 2, item.position[2]);
      dummy.rotation.set(0, item.rotation, 0);
      dummy.scale.set(dims[0], dims[1], dims[2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      needsUpdate = true;
    }
    if (needsUpdate) meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (items.length === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, items.length]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial vertexColors={false} />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}

function SectionSign({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[3.5, 0.9, 0.06]} />
        <meshStandardMaterial color="#003399" />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[3.2, 0.7, 0.01]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={0.05} />
      </mesh>
      <Text
        position={[0, 0, 0.05]}
        fontSize={0.22}
        color="#003399"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {text}
      </Text>
    </group>
  );
}

const ITEM_LABELS: Record<string, string> = {
  sofa: 'KLIPPAN', coffee_table: 'LACK', bed: 'MALM', bookshelf: 'BILLY',
  wardrobe: 'PAX', nightstand: 'HEMNES', dresser: 'KULLEN', desk: 'MICKE',
  office_chair: 'MARKUS', kitchen_table: 'LISABO', kitchen_counter: 'KNOXHULT',
  kitchen_island: 'VADHOLMA', bathtub: 'BETINGEN', sink: 'GODMORGON',
  cabinet_tall: 'METOD', plant_pot: 'FEJKA', outdoor_table: 'NÄMMARÖ',
  standing_desk: 'BEKANT', whiteboard: 'SVENSÅS', armchair: 'POÄNG',
  tv_stand: 'BESTÅ', shelf: 'KALLAX', warehouse_shelf: 'IVAR',
  filing_cabinet: 'ALEX', storage_box: 'SAMLA', garden_shelf: 'HYLLIS'
};

function PriceTag({ position, name, rotation }: { position: [number, number, number]; name: string; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[0.4, 0.2]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <Text
        position={[0, 0.02, 0.005]}
        fontSize={0.08}
        color="#000000"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {name}
      </Text>
      <Text
        position={[0, -0.05, 0.005]}
        fontSize={0.06}
        color="#003399"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {`${Math.floor(Math.random() * 500 + 49)} kr`}
      </Text>
    </group>
  );
}

function SettlementArea({ settlement }: { settlement: Settlement }) {
  const wallHeight = 2.5;
  const r = settlement.radius;
  return (
    <group position={settlement.position}>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        return (
          <mesh key={i} position={[x, wallHeight / 2, z]} rotation={[0, angle + Math.PI / 2, 0]}>
            <boxGeometry args={[r * 0.55, wallHeight, 0.4]} />
            <meshStandardMaterial color="#8b6914" />
          </mesh>
        );
      })}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <pointLight position={[0, 0.5, 0]} intensity={0.4} distance={6} color="#ff6600" />
      {Array.from({ length: Math.min(settlement.population, 5) }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        const dist = r * 0.4;
        return (
          <group key={i} position={[Math.cos(angle) * dist, 0, Math.sin(angle) * dist]}>
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.35, 0.6, 0.2]} />
              <meshStandardMaterial color={['#556b2f', '#8b4513', '#4a4a4a', '#2f4f4f', '#663399'][i % 5]} />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#e8c9a0" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

const MENU_ITEMS = [
  'Swedish Meatballs - 79 kr',
  'Salmon Plate - 99 kr',
  'Veggie Balls - 69 kr',
  'Chicken Schnitzel - 89 kr',
  'Kids Pasta - 29 kr',
  'Daim Cake - 35 kr',
  'Cinnamon Bun - 15 kr',
  'Hot Dog - 10 kr',
  'Soft Serve - 12 kr',
  'Coffee (free refill) - 15 kr',
  'Lingonberry Juice - 12 kr',
  'Princess Cake - 45 kr'
];

function RestaurantArea({ restaurant }: { restaurant: Restaurant }) {
  const title = restaurant.type === 'restaurant' ? 'IKEA RESTAURANT'
    : restaurant.type === 'bistro' ? 'IKEA BISTRO' : 'FOOD COURT';

  return (
    <group position={restaurant.position}>
      {/* Menu board */}
      <mesh position={[0, 3.5, -5]}>
        <boxGeometry args={[5, 2.5, 0.1]} />
        <meshStandardMaterial color="#003366" />
      </mesh>
      <Text position={[0, 4.3, -4.94]} fontSize={0.3} color="#ffcc00" anchorX="center" anchorY="middle" font={undefined}>
        {title}
      </Text>
      <Text position={[0, 3.5, -4.94]} fontSize={0.13} color="#ffffff" anchorX="center" anchorY="middle" font={undefined} maxWidth={4.5} textAlign="center">
        {MENU_ITEMS.slice(0, 8).join('\n')}
      </Text>
      {/* Overhead light */}
      <pointLight position={[0, 4, 0]} intensity={0.5} distance={12} color="#fff5e0" />
      {/* Floor marking */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      {/* Tray return sign */}
      <group position={[5, 2, 2]}>
        <mesh>
          <boxGeometry args={[1.2, 0.5, 0.05]} />
          <meshStandardMaterial color="#ffcc00" />
        </mesh>
        <Text position={[0, 0, 0.03]} fontSize={0.12} color="#003399" anchorX="center" anchorY="middle" font={undefined}>
          TRAY RETURN
        </Text>
      </group>
    </group>
  );
}

function Chunk({ chunkX, chunkZ }: { chunkX: number; chunkZ: number }) {
  const chunkData = useMemo(() => getChunkData(chunkX, chunkZ), [chunkX, chunkZ]);
  const baseX = chunkX * CHUNK_SIZE;
  const baseZ = chunkZ * CHUNK_SIZE;
  const sectionName = getSectionDisplay(chunkData.section);
  const floorColor = FLOOR_COLORS[chunkData.section] || '#c8c0b0';

  const priceTags = useMemo(() => {
    const tags: Array<{ pos: [number, number, number]; name: string; rot: number }> = [];
    for (let i = 0; i < chunkData.items.length; i += 7) {
      const item = chunkData.items[i];
      const label = ITEM_LABELS[item.type];
      if (label && item.position[1] === 0) {
        tags.push({
          pos: [item.position[0], 1.2, item.position[2] + 0.3],
          name: label,
          rot: item.rotation
        });
      }
    }
    return tags;
  }, [chunkData]);

  return (
    <group>
      <mesh position={[baseX, 0, baseZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
      <mesh position={[baseX, CEILING_HEIGHT, baseZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="#f0ece4" />
      </mesh>
      <SectionSign position={[baseX, 7.5, baseZ - CHUNK_SIZE / 2 + 1]} text={sectionName} />
      <SectionSign position={[baseX, 7.5, baseZ + CHUNK_SIZE / 2 - 1]} text={sectionName} />
      {[[-10, -10], [10, -10], [-10, 10], [10, 10], [0, 0], [-5, 5], [5, -5]].map(([ox, oz], i) => (
        <mesh key={`fl-${i}`} position={[baseX + ox, CEILING_HEIGHT - 0.05, baseZ + oz]}>
          <boxGeometry args={[2.4, 0.08, 0.15]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
        </mesh>
      ))}
      <InstancedChunk items={chunkData.items} />
      {priceTags.map((tag, i) => (
        <PriceTag key={`pt-${i}`} position={tag.pos} name={tag.name} rotation={tag.rot} />
      ))}
      {chunkData.settlements.map((s, i) => (
        <SettlementArea key={`s-${i}`} settlement={s} />
      ))}
      {chunkData.restaurant && (
        <RestaurantArea restaurant={chunkData.restaurant} />
      )}
    </group>
  );
}

export default function IKEAWorld() {
  const { camera } = useThree();
  const [chunks, setChunks] = useState<Array<{ x: number; z: number }>>([]);
  const settings = useGameStore(s => s.settings);
  const renderDist = settings?.renderDistance ?? RENDER_DISTANCE;

  useFrame(() => {
    const cx = Math.floor(camera.position.x / CHUNK_SIZE);
    const cz = Math.floor(camera.position.z / CHUNK_SIZE);

    const newChunks: Array<{ x: number; z: number }> = [];
    for (let x = cx - renderDist; x <= cx + renderDist; x++) {
      for (let z = cz - renderDist; z <= cz + renderDist; z++) {
        newChunks.push({ x, z });
      }
    }

    if (newChunks.length !== chunks.length ||
        newChunks.some((c, i) => c.x !== chunks[i]?.x || c.z !== chunks[i]?.z)) {
      setChunks(newChunks);
    }
  });

  return (
    <group>
      {chunks.map(c => (
        <Chunk key={`${c.x},${c.z}`} chunkX={c.x} chunkZ={c.z} />
      ))}
    </group>
  );
}

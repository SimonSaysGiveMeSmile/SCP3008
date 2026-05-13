import { useMemo } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

const CHUNK_SIZE = 40;
const RENDER_DISTANCE = 3;
const CEILING_HEIGHT = 9;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function Shelf({ position, rotation, scale }: {
  position: [number, number, number];
  rotation?: number;
  scale?: [number, number, number];
}) {
  return (
    <group position={position} rotation={[0, rotation || 0, 0]}>
      {/* Shelf frame */}
      <mesh position={[0, scale ? scale[1] / 2 : 1, 0]}>
        <boxGeometry args={scale || [2, 2, 0.5]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {/* Shelf boards */}
      {[0.5, 1, 1.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[(scale?.[0] || 2) - 0.1, 0.05, (scale?.[2] || 0.5)]} />
          <meshStandardMaterial color="#c49a6c" />
        </mesh>
      ))}
    </group>
  );
}

function Table({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[1.5, 0.05, 0.9]} />
        <meshStandardMaterial color="#f5e6d3" />
      </mesh>
      {[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.375, z]}>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      ))}
    </group>
  );
}

function Sofa({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.4, 0.9]} />
        <meshStandardMaterial color="#4a6fa5" />
      </mesh>
      <mesh position={[0, 0.6, -0.35]}>
        <boxGeometry args={[2, 0.5, 0.2]} />
        <meshStandardMaterial color="#3d5d8a" />
      </mesh>
      {[[-0.9, 0.5, 0], [0.9, 0.5, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.2, 0.4, 0.9]} />
          <meshStandardMaterial color="#3d5d8a" />
        </mesh>
      ))}
    </group>
  );
}

function Bed({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.3, 1.5]} />
        <meshStandardMaterial color="#e8e0d4" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.8, 0.15, 1.3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.5, -0.55]}>
        <boxGeometry args={[1.6, 0.1, 0.2]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0.7, -0.7]}>
        <boxGeometry args={[2, 0.8, 0.1]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}

function Lamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.3, 0.4, 8]} />
        <meshStandardMaterial color="#ffee88" emissive="#ffcc00" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function SectionSign({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[3, 0.8, 0.05]} />
        <meshStandardMaterial color="#003399" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[2.8, 0.6, 0.01]} />
        <meshStandardMaterial color="#ffcc00" />
      </mesh>
    </group>
  );
}

// PLACEHOLDER_CHUNK_CONTENT

function generateChunkContent(chunkX: number, chunkZ: number) {
  const items: Array<{ type: string; position: [number, number, number]; rotation: number }> = [];
  const seed = chunkX * 73856093 + chunkZ * 19349663;

  const sections = ['living', 'bedroom', 'kitchen', 'office', 'bathroom'];
  const sectionType = sections[Math.abs(seed) % sections.length];

  const baseX = chunkX * CHUNK_SIZE;
  const baseZ = chunkZ * CHUNK_SIZE;

  for (let i = 0; i < 25; i++) {
    const r = seededRandom(seed + i * 7);
    const r2 = seededRandom(seed + i * 13);
    const r3 = seededRandom(seed + i * 31);
    const x = baseX + (r - 0.5) * (CHUNK_SIZE - 4);
    const z = baseZ + (r2 - 0.5) * (CHUNK_SIZE - 4);
    const rot = Math.floor(r3 * 4) * (Math.PI / 2);

    if (sectionType === 'living') {
      if (i < 8) items.push({ type: 'sofa', position: [x, 0, z], rotation: rot });
      else if (i < 14) items.push({ type: 'table', position: [x, 0, z], rotation: rot });
      else if (i < 18) items.push({ type: 'shelf', position: [x, 0, z], rotation: rot });
      else items.push({ type: 'lamp', position: [x, 0, z], rotation: 0 });
    } else if (sectionType === 'bedroom') {
      if (i < 8) items.push({ type: 'bed', position: [x, 0, z], rotation: rot });
      else if (i < 14) items.push({ type: 'shelf', position: [x, 0, z], rotation: rot });
      else items.push({ type: 'lamp', position: [x, 0, z], rotation: 0 });
    } else {
      if (i < 10) items.push({ type: 'shelf', position: [x, 0, z], rotation: rot });
      else if (i < 16) items.push({ type: 'table', position: [x, 0, z], rotation: rot });
      else items.push({ type: 'lamp', position: [x, 0, z], rotation: 0 });
    }
  }

  // Add aisle shelving walls
  for (let i = 0; i < 4; i++) {
    const r = seededRandom(seed + 100 + i);
    const r2 = seededRandom(seed + 200 + i);
    const x = baseX + (r - 0.5) * CHUNK_SIZE * 0.8;
    const z = baseZ + (r2 - 0.5) * CHUNK_SIZE * 0.8;
    items.push({ type: 'tallshelf', position: [x, 0, z], rotation: Math.floor(r * 2) * Math.PI });
  }

  return { items, sectionType };
}

function Chunk({ chunkX, chunkZ }: { chunkX: number; chunkZ: number }) {
  const { items, sectionType } = useMemo(
    () => generateChunkContent(chunkX, chunkZ),
    [chunkX, chunkZ]
  );

  const baseX = chunkX * CHUNK_SIZE;
  const baseZ = chunkZ * CHUNK_SIZE;

  const sections = ['VARDAGSRUM', 'SOVRUM', 'KÖK', 'KONTOR', 'BADRUM'];
  const sectionNames: Record<string, string> = {
    living: 'VARDAGSRUM', bedroom: 'SOVRUM', kitchen: 'KÖK',
    office: 'KONTOR', bathroom: 'BADRUM'
  };

  return (
    <group>
      {/* Floor */}
      <mesh position={[baseX, 0, baseZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="#c8c0b0" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[baseX, CEILING_HEIGHT, baseZ]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CHUNK_SIZE, CHUNK_SIZE]} />
        <meshStandardMaterial color="#f0ece4" />
      </mesh>

      {/* Section sign */}
      <SectionSign
        position={[baseX, 7, baseZ - CHUNK_SIZE / 2 + 2]}
        text={sectionNames[sectionType] || 'IKEA'}
      />

      {/* Ceiling lights */}
      {[[-8, 8], [8, 8], [-8, -8], [8, -8]].map(([ox, oz], i) => (
        <mesh key={`light-${i}`} position={[baseX + ox, CEILING_HEIGHT - 0.1, baseZ + oz]}>
          <boxGeometry args={[2, 0.1, 0.3]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Furniture items */}
      {items.map((item, i) => {
        switch (item.type) {
          case 'shelf':
            return <Shelf key={i} position={item.position} rotation={item.rotation} />;
          case 'tallshelf':
            return <Shelf key={i} position={item.position} rotation={item.rotation} scale={[4, 3.5, 0.6]} />;
          case 'table':
            return <Table key={i} position={item.position} />;
          case 'sofa':
            return <Sofa key={i} position={item.position} rotation={item.rotation} />;
          case 'bed':
            return <Bed key={i} position={item.position} rotation={item.rotation} />;
          case 'lamp':
            return <Lamp key={i} position={item.position} />;
          default:
            return null;
        }
      })}
    </group>
  );
}

export default function IKEAWorld() {
  const { camera } = useThree();
  const [chunks, setChunks] = useState<Array<{ x: number; z: number }>>([]);

  useFrame(() => {
    const cx = Math.floor(camera.position.x / CHUNK_SIZE);
    const cz = Math.floor(camera.position.z / CHUNK_SIZE);

    const newChunks: Array<{ x: number; z: number }> = [];
    for (let x = cx - RENDER_DISTANCE; x <= cx + RENDER_DISTANCE; x++) {
      for (let z = cz - RENDER_DISTANCE; z <= cz + RENDER_DISTANCE; z++) {
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

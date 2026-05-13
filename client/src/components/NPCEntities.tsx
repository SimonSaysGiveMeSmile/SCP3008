import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { NPCState } from '../../../shared/types';

function NPCEntity({ npc }: { npc: NPCState }) {
  const groupRef = useRef<THREE.Group>(null);
  const gameState = useGameStore(s => s.gameState);

  const heightScale = npc.type === 'tall' ? 1.6 : npc.type === 'short' ? 0.6 : 1;
  const bodyWidth = npc.type === 'tall' ? 0.35 : npc.type === 'short' ? 0.5 : 0.4;
  const armLength = npc.type === 'tall' ? 1.2 : npc.type === 'short' ? 0.5 : 0.8;
  const legLength = npc.type === 'tall' ? 1.4 : npc.type === 'short' ? 0.4 : 0.9;

  const totalHeight = legLength + 0.8 * heightScale + 0.35 * heightScale;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.set(npc.position.x, 0, npc.position.z);
      groupRef.current.rotation.y = npc.rotation;
    }
  });

  const shirtColor = gameState.isNight ? '#cc9900' : '#ffcc00';
  const pantsColor = gameState.isNight ? '#001166' : '#003399';
  const skinColor = '#e8c9a0';
  const headColor = npc.isAggressive ? '#d4a070' : skinColor;

  return (
    <group ref={groupRef}>
      {/* Head - NO FACE, smooth featureless sphere */}
      <mesh position={[0, legLength + 0.8 * heightScale + 0.25 * heightScale, 0]}>
        <sphereGeometry args={[0.2 * heightScale, 16, 16]} />
        <meshStandardMaterial
          color={headColor}
          roughness={0.8}
          emissive={npc.isAggressive ? '#330000' : '#000000'}
          emissiveIntensity={npc.isAggressive ? 0.3 : 0}
        />
      </mesh>

      {/* Torso - Yellow IKEA shirt */}
      <mesh position={[0, legLength + 0.4 * heightScale, 0]}>
        <boxGeometry args={[bodyWidth, 0.8 * heightScale, 0.25]} />
        <meshStandardMaterial
          color={shirtColor}
          emissive={npc.isAggressive ? '#ff3300' : '#000000'}
          emissiveIntensity={npc.isAggressive ? 0.2 : 0}
        />
      </mesh>

      {/* Legs - Blue IKEA pants */}
      <mesh position={[-0.1, legLength / 2, 0]}>
        <boxGeometry args={[0.12, legLength, 0.12]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>
      <mesh position={[0.1, legLength / 2, 0]}>
        <boxGeometry args={[0.12, legLength, 0.12]} />
        <meshStandardMaterial color={pantsColor} />
      </mesh>

      {/* Arms */}
      <mesh position={[-(bodyWidth / 2 + 0.06), legLength + 0.4 * heightScale, 0]}
        rotation={[npc.isAggressive ? -0.5 : 0, 0, npc.isAggressive ? 0.3 : 0]}>
        <boxGeometry args={[0.1, armLength, 0.1]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[(bodyWidth / 2 + 0.06), legLength + 0.4 * heightScale, 0]}
        rotation={[npc.isAggressive ? -0.5 : 0, 0, npc.isAggressive ? -0.3 : 0]}>
        <boxGeometry args={[0.1, armLength, 0.1]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* Hands */}
      <mesh position={[-(bodyWidth / 2 + 0.06), legLength + 0.4 * heightScale - armLength / 2 - 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      <mesh position={[(bodyWidth / 2 + 0.06), legLength + 0.4 * heightScale - armLength / 2 - 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
}

export default function NPCEntities() {
  const npcs = useGameStore(s => s.npcs);

  return (
    <group>
      {npcs.map(npc => (
        <NPCEntity key={npc.id} npc={npc} />
      ))}
    </group>
  );
}

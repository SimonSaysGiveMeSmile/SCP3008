import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

function RemotePlayer({ id, position, rotation, name }: {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  name: string;
}) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(
        new THREE.Vector3(position.x, 0, position.z),
        0.1
      );
      meshRef.current.rotation.y = rotation;
    }
  });

  return (
    <group ref={meshRef} position={[position.x, 0, position.z]}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.25]} />
        <meshStandardMaterial color="#55aa55" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#e8c9a0" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, 0.4, 0]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#334455" />
      </mesh>
      <mesh position={[0.1, 0.4, 0]}>
        <boxGeometry args={[0.12, 0.8, 0.12]} />
        <meshStandardMaterial color="#334455" />
      </mesh>
    </group>
  );
}

export default function RemotePlayers() {
  const remotePlayers = useGameStore(s => s.remotePlayers);

  return (
    <group>
      {Array.from(remotePlayers.values()).map(player => (
        <RemotePlayer
          key={player.id}
          id={player.id}
          position={player.position}
          rotation={player.rotation}
          name={player.name}
        />
      ))}
    </group>
  );
}

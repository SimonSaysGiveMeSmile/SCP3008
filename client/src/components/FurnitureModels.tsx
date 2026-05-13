import * as THREE from 'three';

interface ModelProps {
  position: [number, number, number];
  rotation: number;
  scale?: [number, number, number];
}

export function Sofa({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.9]} />
        <meshStandardMaterial color="#4a6fa5" />
      </mesh>
      <mesh position={[0, 0.55, -0.35]}>
        <boxGeometry args={[2.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#3d5d8a" />
      </mesh>
      <mesh position={[-1.0, 0.45, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.9]} />
        <meshStandardMaterial color="#3d5d8a" />
      </mesh>
      <mesh position={[1.0, 0.45, 0]}>
        <boxGeometry args={[0.15, 0.4, 0.9]} />
        <meshStandardMaterial color="#3d5d8a" />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.4, 0.45, 0.05]}>
        <boxGeometry args={[0.7, 0.12, 0.6]} />
        <meshStandardMaterial color="#5580bb" />
      </mesh>
      <mesh position={[0.4, 0.45, 0.05]}>
        <boxGeometry args={[0.7, 0.12, 0.6]} />
        <meshStandardMaterial color="#5580bb" />
      </mesh>
    </group>
  );
}

export function CoffeeTable({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.04, 0.6]} />
        <meshStandardMaterial color="#c49a6c" />
      </mesh>
      {[[-0.5, -0.25], [0.5, -0.25], [-0.5, 0.25], [0.5, 0.25]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
          <meshStandardMaterial color="#8b6914" />
        </mesh>
      ))}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.0, 0.03, 0.45]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}

export function Bed({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[2.0, 0.25, 1.6]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.9, 0.18, 1.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.52, 0.2]}>
        <boxGeometry args={[1.8, 0.08, 1.0]} />
        <meshStandardMaterial color="#e8e0d4" />
      </mesh>
      <mesh position={[0, 0.5, -0.65]}>
        <boxGeometry args={[0.5, 0.08, 0.3]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0.6, -0.75]}>
        <boxGeometry args={[2.0, 0.9, 0.08]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
    </group>
  );
}

export function Bookshelf({ position, rotation, scale }: ModelProps) {
  const s = scale || [1.2, 2.2, 0.4];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, s[1] / 2, 0]}>
        <boxGeometry args={[s[0], s[1], s[2]]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {Array.from({ length: Math.floor(s[1] / 0.5) }, (_, i) => (
        <mesh key={i} position={[0, 0.3 + i * 0.45, 0]}>
          <boxGeometry args={[s[0] - 0.05, 0.03, s[2] - 0.02]} />
          <meshStandardMaterial color="#c49a6c" />
        </mesh>
      ))}
      {Array.from({ length: Math.floor(s[1] / 0.5) }, (_, i) => (
        <mesh key={`book-${i}`} position={[Math.sin(i * 2.1) * s[0] * 0.25, 0.4 + i * 0.45, 0]}>
          <boxGeometry args={[0.3, 0.3, s[2] - 0.08]} />
          <meshStandardMaterial color={['#cc3333', '#3366cc', '#33aa33', '#cc9933', '#9933cc'][i % 5]} />
        </mesh>
      ))}
    </group>
  );
}

export function Wardrobe({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.5, 2.0, 0.6]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[-0.01, 1.0, 0.31]}>
        <boxGeometry args={[0.7, 1.8, 0.02]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[0.38, 1.0, 0.31]}>
        <boxGeometry args={[0.7, 1.8, 0.02]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      {/* Handles */}
      <mesh position={[0.3, 1.0, 0.33]}>
        <boxGeometry args={[0.03, 0.15, 0.03]} />
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </mesh>
      <mesh position={[-0.35, 1.0, 0.33]}>
        <boxGeometry args={[0.03, 0.15, 0.03]} />
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function Nightstand({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.4]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      <mesh position={[0, 0.35, 0.21]}>
        <boxGeometry args={[0.4, 0.15, 0.02]} />
        <meshStandardMaterial color="#c49a6c" />
      </mesh>
      <mesh position={[0, 0.35, 0.23]}>
        <boxGeometry args={[0.06, 0.04, 0.03]} />
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </mesh>
    </group>
  );
}

// PLACEHOLDER_MORE_MODELS
export function Dresser({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1.0, 0.5]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      {[0.2, 0.5, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0.26]}>
          <boxGeometry args={[1.05, 0.22, 0.02]} />
          <meshStandardMaterial color="#d4c8b4" />
        </mesh>
      ))}
    </group>
  );
}

export function FloorLamp({ position }: ModelProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.7, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.02, 0.25, 0.35, 16]} />
        <meshStandardMaterial color="#fff8e0" emissive="#ffcc00" emissiveIntensity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Desk({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[1.6, 0.04, 0.8]} />
        <meshStandardMaterial color="#f5e6d3" />
      </mesh>
      {[[-0.7, -0.35], [0.7, -0.35], [-0.7, 0.35], [0.7, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]}>
          <boxGeometry args={[0.04, 0.74, 0.04]} />
          <meshStandardMaterial color="#333333" metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function OfficeChair({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.03, 16]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.25, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0.8, -0.22]}>
        <boxGeometry args={[0.48, 0.5, 0.06]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}

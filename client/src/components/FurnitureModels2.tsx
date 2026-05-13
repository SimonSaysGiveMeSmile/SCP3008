import * as THREE from 'three';

interface ModelProps {
  position: [number, number, number];
  rotation: number;
  scale?: [number, number, number];
}

export function Bathtub({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[1.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.6, 0.35, 0.6]} />
        <meshStandardMaterial color="#e8f4f8" />
      </mesh>
      <mesh position={[-0.7, 0.65, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} />
      </mesh>
    </group>
  );
}

export function Sink({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.6, 0.1, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.18, 0.12, 16]} />
        <meshStandardMaterial color="#e8f4f8" />
      </mesh>
      <mesh position={[0, 0.55, -0.15]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, -0.2]}>
        <boxGeometry args={[0.55, 0.8, 0.08]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
    </group>
  );
}

export function MirrorCabinet({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.8, 0.7, 0.15]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[0, 1.5, 0.08]}>
        <boxGeometry args={[0.7, 0.6, 0.01]} />
        <meshStandardMaterial color="#aaccee" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function TowelRack({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.04]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.8, 0.04, 0.04]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.1, 0.02]}>
        <boxGeometry args={[0.6, 0.3, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function Toilet({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.2, 0.1]}>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.22, -0.15]}>
        <boxGeometry args={[0.35, 0.5, 0.12]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.42, 0.1]}>
        <boxGeometry args={[0.38, 0.04, 0.48]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
    </group>
  );
}

export function KitchenCounter({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[2.0, 0.9, 0.6]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[2.0, 0.04, 0.62]} />
        <meshStandardMaterial color="#666666" roughness={0.3} />
      </mesh>
      <mesh position={[-0.5, 0.93, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <meshStandardMaterial color="#444444" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function KitchenTable({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.74, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.9]} />
        <meshStandardMaterial color="#f5e6d3" />
      </mesh>
      {[[-0.6, -0.35], [0.6, -0.35], [-0.6, 0.35], [0.6, 0.35]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.37, z]}>
          <boxGeometry args={[0.05, 0.74, 0.05]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      ))}
    </group>
  );
}

export function KitchenChair({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.4]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {[[-0.15, -0.15], [0.15, -0.15], [-0.15, 0.15], [0.15, 0.15]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]}>
          <boxGeometry args={[0.03, 0.45, 0.03]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      ))}
      <mesh position={[0, 0.7, -0.18]}>
        <boxGeometry args={[0.38, 0.5, 0.03]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}

export function CabinetTall({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.6, 2.0, 0.4]} />
        <meshStandardMaterial color="#f0e6d2" />
      </mesh>
      <mesh position={[0, 1.0, 0.21]}>
        <boxGeometry args={[0.55, 1.9, 0.02]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[0.2, 1.0, 0.23]}>
        <boxGeometry args={[0.03, 0.1, 0.03]} />
        <meshStandardMaterial color="#888888" metalness={0.8} />
      </mesh>
    </group>
  );
}

export function KitchenIsland({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.8, 0.9, 0.9]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <boxGeometry args={[1.85, 0.04, 0.95]} />
        <meshStandardMaterial color="#555555" roughness={0.3} />
      </mesh>
    </group>
  );
}

export function PlantPot({ position }: ModelProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.4, 12]} />
        <meshStandardMaterial color="#cc6633" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#228833" />
      </mesh>
      <mesh position={[0.1, 0.6, 0.05]}>
        <sphereGeometry args={[0.15, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#33aa44" />
      </mesh>
    </group>
  );
}

export function GardenShelf({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.5, 1.6, 0.5]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      {[0.3, 0.7, 1.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.4, 0.03, 0.45]} />
          <meshStandardMaterial color="#a07828" />
        </mesh>
      ))}
    </group>
  );
}

export function OutdoorTable({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.04, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
        <meshStandardMaterial color="#666666" metalness={0.6} />
      </mesh>
    </group>
  );
}

export function OutdoorChair({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshStandardMaterial color="#888888" metalness={0.4} />
      </mesh>
      {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0.6, -0.23]}>
        <boxGeometry args={[0.48, 0.4, 0.03]} />
        <meshStandardMaterial color="#888888" metalness={0.4} />
      </mesh>
    </group>
  );
}

export function PlanterBox({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.0, 0.5, 0.4]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[0.9, 0.05, 0.35]} />
        <meshStandardMaterial color="#2d5a1e" />
      </mesh>
    </group>
  );
}

export function Shelf({ position, rotation, scale }: ModelProps) {
  const s = scale || [2, 1.8, 0.5];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, s[1] / 2, 0]}>
        <boxGeometry args={s} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {Array.from({ length: Math.floor(s[1] / 0.5) }, (_, i) => (
        <mesh key={i} position={[0, 0.25 + i * 0.45, 0]}>
          <boxGeometry args={[s[0] - 0.05, 0.03, s[2] - 0.02]} />
          <meshStandardMaterial color="#c49a6c" />
        </mesh>
      ))}
    </group>
  );
}

export function WarehouseShelf({ position, rotation, scale }: ModelProps) {
  const s = scale || [5, 4, 0.8];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Metal frame */}
      <mesh position={[-s[0] / 2, s[1] / 2, 0]}>
        <boxGeometry args={[0.06, s[1], 0.06]} />
        <meshStandardMaterial color="#555555" metalness={0.7} />
      </mesh>
      <mesh position={[s[0] / 2, s[1] / 2, 0]}>
        <boxGeometry args={[0.06, s[1], 0.06]} />
        <meshStandardMaterial color="#555555" metalness={0.7} />
      </mesh>
      {/* Shelves with boxes */}
      {Array.from({ length: 4 }, (_, i) => (
        <group key={i}>
          <mesh position={[0, 0.5 + i * 0.9, 0]}>
            <boxGeometry args={[s[0] - 0.1, 0.04, s[2]]} />
            <meshStandardMaterial color="#888888" metalness={0.5} />
          </mesh>
          {Array.from({ length: 3 }, (_, j) => (
            <mesh key={j} position={[-s[0] / 3 + j * (s[0] / 3), 0.7 + i * 0.9, 0]}>
              <boxGeometry args={[s[0] / 4, 0.35, s[2] - 0.1]} />
              <meshStandardMaterial color={['#cc9933', '#336699', '#996633'][j % 3]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export function TVStand({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.6, 0.5, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <boxGeometry args={[1.6, 0.03, 0.42]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      {/* TV */}
      <mesh position={[0, 0.95, -0.1]}>
        <boxGeometry args={[1.2, 0.7, 0.05]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 0.95, -0.07]}>
        <boxGeometry args={[1.1, 0.6, 0.01]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#000022" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

export function Armchair({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.35, 0.8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 0.55, -0.3]}>
        <boxGeometry args={[0.8, 0.5, 0.2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[-0.35, 0.45, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.7]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0.35, 0.45, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.7]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  );
}

export function LampDisplay({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.0, 1.0, 0.6]} />
        <meshStandardMaterial color="#e8e0d4" />
      </mesh>
      <mesh position={[-0.2, 1.2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[-0.2, 1.4, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fff8e0" emissive="#ffcc00" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.2, 1.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh position={[0.2, 1.3, 0]}>
        <coneGeometry args={[0.12, 0.15, 12]} />
        <meshStandardMaterial color="#cc9966" />
      </mesh>
    </group>
  );
}

export function ChandelierDisplay({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1.0, 0.8]} />
        <meshStandardMaterial color="#e8e0d4" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.3, 8]} />
        <meshStandardMaterial color="#ccaa44" metalness={0.8} />
      </mesh>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.2, 1.6, Math.sin(i * Math.PI / 2) * 0.2]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#fff8e0" emissive="#ffaa00" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export function StandingDesk({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.4, 0.04, 0.7]} />
        <meshStandardMaterial color="#f5e6d3" />
      </mesh>
      <mesh position={[-0.6, 0.5, 0]}>
        <boxGeometry args={[0.06, 1.0, 0.06]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>
      <mesh position={[0.6, 0.5, 0]}>
        <boxGeometry args={[0.06, 1.0, 0.06]} />
        <meshStandardMaterial color="#333333" metalness={0.6} />
      </mesh>
    </group>
  );
}

export function Whiteboard({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[1.5, 1.0, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.3, -0.03]}>
        <boxGeometry args={[1.55, 1.05, 0.02]} />
        <meshStandardMaterial color="#888888" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.75, 0.03]}>
        <boxGeometry args={[0.4, 0.04, 0.06]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  );
}

export function FilingCabinet({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.5, 1.2, 0.6]} />
        <meshStandardMaterial color="#666666" metalness={0.6} />
      </mesh>
      {[0.3, 0.6, 0.9].map((y, i) => (
        <mesh key={i} position={[0, y, 0.31]}>
          <boxGeometry args={[0.44, 0.25, 0.02]} />
          <meshStandardMaterial color="#555555" metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

export function StorageBox({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.5, 0.4, 0.4]} />
        <meshStandardMaterial color="#336699" />
      </mesh>
      <mesh position={[0, 0.41, 0]}>
        <boxGeometry args={[0.52, 0.02, 0.42]} />
        <meshStandardMaterial color="#2a5580" />
      </mesh>
    </group>
  );
}

export function DeskLamp({ position }: ModelProps) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.6} />
      </mesh>
      <mesh position={[0.05, 0.95, 0]}>
        <coneGeometry args={[0.08, 0.1, 12]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

export function DisplayTable({ position, rotation }: ModelProps) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.04, 0.9]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.2, z]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#d4a574" />
        </mesh>
      ))}
      {/* Display items */}
      <mesh position={[-0.4, 0.5, 0]}>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#cc6633" />
      </mesh>
      <mesh position={[0.3, 0.55, 0.1]}>
        <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
        <meshStandardMaterial color="#336699" />
      </mesh>
    </group>
  );
}

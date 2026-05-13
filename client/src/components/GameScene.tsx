import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import Player from './Player';
import IKEAWorld from './IKEAWorld';
import NPCEntities from './NPCEntities';
import RemotePlayers from './RemotePlayers';
import Lighting from './Lighting';

export default function GameScene() {
  const gameState = useGameStore(s => s.gameState);

  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, far: 500, position: [0, 1.7, 0] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Lighting />
      <fog attach="fog" args={[gameState.isNight ? '#0a0a15' : '#e8e0d4', 10, 120]} />
      <color attach="background" args={[gameState.isNight ? '#0a0a15' : '#e8e0d4']} />

      <Player />
      <IKEAWorld />
      <NPCEntities />
      <RemotePlayers />

      <PointerLockControls />
    </Canvas>
  );
}

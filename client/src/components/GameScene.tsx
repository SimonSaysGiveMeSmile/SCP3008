import { Canvas } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import Player from './Player';
import IKEAWorld from './IKEAWorld';
import NPCEntities from './NPCEntities';
import RemotePlayers from './RemotePlayers';
import Lighting from './Lighting';

export default function GameScene() {
  return (
    <Canvas
      camera={{ fov: 75, near: 0.1, far: 500, position: [0, 1.7, 0], rotation: [0, 0, 0] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Lighting />
      <Player />
      <IKEAWorld />
      <NPCEntities />
      <RemotePlayers />
      <PointerLockControls />
    </Canvas>
  );
}

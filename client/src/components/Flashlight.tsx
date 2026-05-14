import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export default function Flashlight() {
  const { camera } = useThree();
  const spotRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef(new THREE.Object3D());

  useFrame(() => {
    if (!spotRef.current) return;

    const on = useGameStore.getState().flashlightOn;
    spotRef.current.intensity = on ? 4.5 : 0;

    spotRef.current.position.copy(camera.position);

    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(camera.quaternion);
    targetRef.current.position.copy(camera.position).add(dir.multiplyScalar(10));
    spotRef.current.target = targetRef.current;
  });

  return (
    <>
      <spotLight
        ref={spotRef}
        angle={0.45}
        penumbra={0.3}
        distance={35}
        decay={1.2}
        color="#fffde6"
        castShadow={false}
        intensity={0}
      />
      <primitive object={targetRef.current} />
    </>
  );
}

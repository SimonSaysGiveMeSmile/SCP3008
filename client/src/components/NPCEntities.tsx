import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { playNPCVoice, playStoreClosing } from '../utils/audio';

const SHIRT_COLOR = new THREE.Color('#ffcc00');
const SHIRT_NIGHT = new THREE.Color('#cc9900');
const PANTS_COLOR = new THREE.Color('#003399');
const PANTS_NIGHT = new THREE.Color('#001a66');
const SKIN_COLOR = new THREE.Color('#d4a070');

export default function NPCEntities() {
  const npcs = useGameStore(s => s.npcs);
  const gameState = useGameStore(s => s.gameState);

  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const legsRef = useRef<THREE.InstancedMesh>(null);
  const armsRef = useRef<THREE.InstancedMesh>(null);
  const lastVoice = useRef(0);
  const wasNight = useRef(false);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!bodyRef.current || !headRef.current || !legsRef.current || !armsRef.current) return;
    if (npcs.length === 0) return;

    const isNight = gameState.isNight;

    // Play store closing announcement when night begins
    if (isNight && !wasNight.current) {
      playStoreClosing();
    }
    wasNight.current = isNight;

    // Periodic NPC voices (nearby NPCs murmur/growl)
    const now = Date.now();
    if (now - lastVoice.current > (isNight ? 3000 : 8000)) {
      lastVoice.current = now;
      const playerPos = (window as any).__playerPos;
      if (playerPos) {
        for (const npc of npcs) {
          const dx = npc.position.x - playerPos.x;
          const dz = npc.position.z - playerPos.z;
          if (dx * dx + dz * dz < 225) {
            playNPCVoice(isNight);
            break;
          }
        }
      }
    }

    const shirtCol = isNight ? SHIRT_NIGHT : SHIRT_COLOR;
    const pantsCol = isNight ? PANTS_NIGHT : PANTS_COLOR;

    // Update body material color
    (bodyRef.current.material as THREE.MeshStandardMaterial).color = shirtCol;
    (bodyRef.current.material as THREE.MeshStandardMaterial).emissive = isNight ? new THREE.Color('#331100') : new THREE.Color('#000000');
    (bodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isNight ? 0.2 : 0;
    (legsRef.current.material as THREE.MeshStandardMaterial).color = pantsCol;
    (headRef.current.material as THREE.MeshStandardMaterial).color = SKIN_COLOR;
    (headRef.current.material as THREE.MeshStandardMaterial).emissive = isNight ? new THREE.Color('#220000') : new THREE.Color('#000000');
    (headRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = isNight ? 0.15 : 0;
    (armsRef.current.material as THREE.MeshStandardMaterial).color = shirtCol;

    for (let i = 0; i < npcs.length; i++) {
      const npc = npcs[i];
      const heightScale = npc.type === 'tall' ? 1.5 : npc.type === 'short' ? 0.65 : 1.0;
      const bodyWidth = 0.4;
      const legLen = 0.9 * heightScale;
      const bodyH = 0.7 * heightScale;

      // Body (torso)
      dummy.position.set(npc.position.x, legLen + bodyH / 2, npc.position.z);
      dummy.rotation.set(0, npc.rotation, 0);
      dummy.scale.set(bodyWidth, bodyH, 0.22);
      dummy.updateMatrix();
      bodyRef.current.setMatrixAt(i, dummy.matrix);

      // Head (featureless sphere rendered as scaled box for instancing)
      dummy.position.set(npc.position.x, legLen + bodyH + 0.18 * heightScale, npc.position.z);
      dummy.rotation.set(0, npc.rotation, 0);
      const headSize = 0.22 * heightScale;
      dummy.scale.set(headSize, headSize, headSize);
      dummy.updateMatrix();
      headRef.current.setMatrixAt(i, dummy.matrix);

      // Legs (single combined block)
      dummy.position.set(npc.position.x, legLen / 2, npc.position.z);
      dummy.rotation.set(0, npc.rotation, 0);
      dummy.scale.set(0.25, legLen, 0.15);
      dummy.updateMatrix();
      legsRef.current.setMatrixAt(i, dummy.matrix);

      // Arms
      const armY = legLen + bodyH * 0.5;
      const armRaise = isNight ? -0.4 : 0;
      dummy.position.set(
        npc.position.x + Math.cos(npc.rotation) * (bodyWidth / 2 + 0.08),
        armY,
        npc.position.z - Math.sin(npc.rotation) * (bodyWidth / 2 + 0.08)
      );
      dummy.rotation.set(armRaise, npc.rotation, isNight ? 0.2 : 0);
      dummy.scale.set(0.08, 0.6 * heightScale, 0.08);
      dummy.updateMatrix();
      armsRef.current.setMatrixAt(i, dummy.matrix);
    }

    bodyRef.current.instanceMatrix.needsUpdate = true;
    headRef.current.instanceMatrix.needsUpdate = true;
    legsRef.current.instanceMatrix.needsUpdate = true;
    armsRef.current.instanceMatrix.needsUpdate = true;
  });

  const count = Math.max(npcs.length, 1);

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={SHIRT_COLOR} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color={SKIN_COLOR} roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={legsRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={PANTS_COLOR} />
      </instancedMesh>
      <instancedMesh ref={armsRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={SHIRT_COLOR} />
      </instancedMesh>
    </group>
  );
}

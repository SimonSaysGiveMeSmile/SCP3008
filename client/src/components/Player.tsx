import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sendMovement } from '../utils/network';

const SPEED = 5;
const SPRINT_MULTIPLIER = 1.8;

export default function Player() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const keys = useRef<Set<string>>(new Set());
  const lastSent = useRef(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const k = keys.current;
    const sprint = k.has('ShiftLeft') || k.has('ShiftRight');
    const speed = SPEED * (sprint ? SPRINT_MULTIPLIER : 1);

    direction.current.set(0, 0, 0);
    if (k.has('KeyW')) direction.current.z -= 1;
    if (k.has('KeyS')) direction.current.z += 1;
    if (k.has('KeyA')) direction.current.x -= 1;
    if (k.has('KeyD')) direction.current.x += 1;
    direction.current.normalize();

    // Apply movement relative to camera direction
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    velocity.current.set(0, 0, 0);
    velocity.current.addScaledVector(forward, -direction.current.z * speed * delta);
    velocity.current.addScaledVector(right, direction.current.x * speed * delta);

    camera.position.add(velocity.current);
    camera.position.y = 1.7; // Eye height

    // Send position to server at 20Hz
    const now = Date.now();
    if (now - lastSent.current > 50) {
      lastSent.current = now;
      sendMovement(
        { x: camera.position.x, y: camera.position.y, z: camera.position.z },
        camera.rotation.y
      );
    }
  });

  return null;
}

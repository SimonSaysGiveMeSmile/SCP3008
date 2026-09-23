import { useFrame, useThree } from '@react-three/fiber';
import { touch } from './touch';

// Touch drag-to-look, replacing PointerLockControls on mobile.
// Drives camera.rotation directly (assumes camera.rotation.order = 'YXZ').
const SENS = 0.002;
const LIM = Math.PI / 2 - 0.05;

export function TouchLook() {
  const { camera } = useThree();
  useFrame(() => {
    if (touch.lookDX || touch.lookDY) {
      camera.rotation.y -= touch.lookDX * SENS;
      camera.rotation.x = Math.max(-LIM, Math.min(LIM, camera.rotation.x - touch.lookDY * SENS));
      touch.lookDX = 0;
      touch.lookDY = 0;
    }
  });
  return null;
}

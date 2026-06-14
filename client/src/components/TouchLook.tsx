import { useFrame, useThree } from '@react-three/fiber';
import { touch } from '../touch';

// Touch drag-to-look, replacing PointerLockControls on mobile.
// SCP keeps camera.rotation.order = 'YXZ', so we can drive rotation directly
// (rotation.y is read elsewhere for the minimap and network sync).
const SENS = 0.0028;
const LIM = Math.PI / 2 - 0.05;

export default function TouchLook() {
  const { camera } = useThree();
  useFrame(() => {
    if (touch.lookDX !== 0 || touch.lookDY !== 0) {
      camera.rotation.y -= touch.lookDX * SENS;
      camera.rotation.x = Math.max(-LIM, Math.min(LIM, camera.rotation.x - touch.lookDY * SENS));
      touch.lookDX = 0;
      touch.lookDY = 0;
    }
  });
  return null;
}

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpColor(a: THREE.Color, b: THREE.Color, t: number): THREE.Color {
  return new THREE.Color(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t));
}

const DAY_AMBIENT = new THREE.Color('#fff5e6');
const NIGHT_AMBIENT = new THREE.Color('#141428');
const DAY_DIR = new THREE.Color('#ffffff');
const NIGHT_DIR = new THREE.Color('#1111aa');
const DAY_FOG = new THREE.Color('#e8e0d4');
const NIGHT_FOG = new THREE.Color('#101020');

export default function Lighting() {
  const gameState = useGameStore(s => s.gameState);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const pointRefs = useRef<THREE.PointLight[]>([]);

  useFrame(({ scene }) => {
    const t = gameState.timeOfDay;

    // Smooth transition factor: 0 = full day, 1 = full night
    // Transition happens between 0.7-0.75 (dusk) and 0.2-0.25 (dawn)
    let nightFactor: number;
    if (t >= 0.75 || t < 0.2) {
      nightFactor = 1;
    } else if (t >= 0.7 && t < 0.75) {
      nightFactor = (t - 0.7) / 0.05; // dusk transition
    } else if (t >= 0.2 && t < 0.25) {
      nightFactor = 1 - (t - 0.2) / 0.05; // dawn transition
    } else {
      nightFactor = 0;
    }

    // Smooth the factor with easing
    const smooth = nightFactor * nightFactor * (3 - 2 * nightFactor);

    if (ambientRef.current) {
      ambientRef.current.intensity = lerp(0.45, 0.06, smooth);
      ambientRef.current.color = lerpColor(DAY_AMBIENT, NIGHT_AMBIENT, smooth);
    }

    if (dirRef.current) {
      dirRef.current.intensity = lerp(0.7, 0.05, smooth);
      dirRef.current.color = lerpColor(DAY_DIR, NIGHT_DIR, smooth);
    }

    // Update fog
    if (scene.fog && scene.fog instanceof THREE.Fog) {
      scene.fog.color = lerpColor(DAY_FOG, NIGHT_FOG, smooth);
      scene.fog.near = lerp(15, 5, smooth);
      scene.fog.far = lerp(140, 50, smooth);
    }

    // Update background
    scene.background = lerpColor(DAY_FOG, NIGHT_FOG, smooth);
  });

  const gameStateCurrent = gameState;
  const nightFactor = gameStateCurrent.isNight ? 1 : 0;

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.45} color="#fff5e6" />
      <directionalLight ref={dirRef} position={[50, 30, 50]} intensity={0.7} color="#ffffff" />
      <fog attach="fog" args={['#e8e0d4', 15, 140]} />

      {/* Overhead fluorescent point lights that dim at night */}
      <pointLight position={[0, 8, 0]} intensity={0.4} distance={35} color="#fff5e0" />
      <pointLight position={[40, 8, 40]} intensity={0.3} distance={30} color="#fff5e0" />
      <pointLight position={[-40, 8, -40]} intensity={0.3} distance={30} color="#fff5e0" />
      <pointLight position={[40, 8, -40]} intensity={0.3} distance={30} color="#fff5e0" />
      <pointLight position={[-40, 8, 40]} intensity={0.3} distance={30} color="#fff5e0" />

      {/* Emergency red lights visible at night */}
      <pointLight position={[15, 3, 15]} intensity={gameStateCurrent.isNight ? 0.15 : 0} distance={12} color="#ff2200" />
      <pointLight position={[-20, 3, -10]} intensity={gameStateCurrent.isNight ? 0.1 : 0} distance={10} color="#ff0000" />
    </>
  );
}

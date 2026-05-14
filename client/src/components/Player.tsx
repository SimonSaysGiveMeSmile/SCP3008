import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sendMovement } from '../utils/network';
import { checkCollision, checkMovableCollision, displaceItem, removeCollectible, getChunkData, CHUNK_SIZE } from '../utils/worldGen';
import { useGameStore, WEAPONS } from '../store/gameStore';
import { playFootstep, playAttackSwing, playFlashlightClick, playHit, playObjectPush, playObjectHit } from '../utils/audio';

const SPEED = 5;
const SPRINT_MULTIPLIER = 1.8;
const PLAYER_RADIUS = 0.3;
const HUNGER_DRAIN = 0.015;
const THIRST_DRAIN = 0.025;

export default function Player() {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const keys = useRef<Set<string>>(new Set());
  const lastSent = useRef(0);
  const lastStatDrain = useRef(Date.now());
  const lastFootstep = useRef(0);

  useEffect(() => {
    camera.rotation.set(0, 0, 0);
    camera.rotation.order = 'YXZ';
  }, [camera]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.code);

      // Weapon switching
      if (e.code === 'Digit1') useGameStore.getState().setCurrentWeapon(0);
      if (e.code === 'Digit2') useGameStore.getState().setCurrentWeapon(1);
      if (e.code === 'Digit3') useGameStore.getState().setCurrentWeapon(2);
      if (e.code === 'Digit4') useGameStore.getState().setCurrentWeapon(3);

      // Settings toggle
      if (e.code === 'Tab') {
        e.preventDefault();
        const store = useGameStore.getState();
        store.setSettingsOpen(!store.settingsOpen);
      }

      // Flashlight toggle
      if (e.code === 'KeyF') {
        useGameStore.getState().toggleFlashlight();
        playFlashlightClick();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        const store = useGameStore.getState();
        const now = Date.now();
        const weapon = WEAPONS[store.currentWeapon];
        if (now - store.lastAttackTime >= weapon.cooldown) {
          store.setLastAttackTime(now);
          store.setIsAttacking(true);
          performAttack(camera, weapon);
          playAttackSwing();
          setTimeout(() => useGameStore.getState().setIsAttacking(false), 200);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const store = useGameStore.getState();
    if (store.settingsOpen) return;

    const k = keys.current;
    const sprint = k.has('ShiftLeft') || k.has('ShiftRight');
    const speed = SPEED * (sprint ? SPRINT_MULTIPLIER : 1);

    // Update FOV from settings
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = store.settings.fov;
      if (Math.abs(camera.fov - targetFov) > 0.5) {
        camera.fov += (targetFov - camera.fov) * 0.1;
        camera.updateProjectionMatrix();
      }
    }

    direction.current.set(0, 0, 0);
    if (k.has('KeyW')) direction.current.z -= 1;
    if (k.has('KeyS')) direction.current.z += 1;
    if (k.has('KeyA')) direction.current.x -= 1;
    if (k.has('KeyD')) direction.current.x += 1;
    direction.current.normalize();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    velocity.current.set(0, 0, 0);
    velocity.current.addScaledVector(forward, -direction.current.z * speed * delta);
    velocity.current.addScaledVector(right, direction.current.x * speed * delta);

    // Collision
    const cx = Math.floor(camera.position.x / CHUNK_SIZE);
    const cz = Math.floor(camera.position.z / CHUNK_SIZE);
    const nearbyChunks: Array<{ x: number; z: number }> = [];
    for (let x = cx - 1; x <= cx + 1; x++) {
      for (let z = cz - 1; z <= cz + 1; z++) {
        nearbyChunks.push({ x, z });
      }
    }

    const newX = camera.position.x + velocity.current.x;
    const newZ = camera.position.z + velocity.current.z;

    // Check furniture collisions — push movable items, block on fixed ones
    let blockedX = checkCollision(newX, camera.position.z, PLAYER_RADIUS, nearbyChunks);
    let blockedZ = checkCollision(camera.position.x, newZ, PLAYER_RADIUS, nearbyChunks);

    // If blocked, check if it's a movable item we can push
    if (blockedX) {
      const mov = checkMovableCollision(newX, camera.position.z, PLAYER_RADIUS, nearbyChunks);
      if (mov.hit && mov.itemKey) {
        const parts = mov.itemKey.split(',');
        displaceItem(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]), mov.pushX, mov.pushZ);
        blockedX = false;
        playObjectPush();
      }
    }
    if (blockedZ) {
      const mov = checkMovableCollision(camera.position.x, newZ, PLAYER_RADIUS, nearbyChunks);
      if (mov.hit && mov.itemKey) {
        const parts = mov.itemKey.split(',');
        displaceItem(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]), mov.pushX, mov.pushZ);
        blockedZ = false;
        playObjectPush();
      }
    }

    // Check NPC collisions (treat NPCs as cylinders with radius 0.3)
    const npcRadius = 0.3;
    const npcs = store.npcs;
    let npcBlockX = false;
    let npcBlockZ = false;
    for (let i = 0; i < npcs.length; i++) {
      const npc = npcs[i];
      const dxX = newX - npc.position.x;
      const dzX = camera.position.z - npc.position.z;
      if (dxX * dxX + dzX * dzX < (PLAYER_RADIUS + npcRadius) * (PLAYER_RADIUS + npcRadius)) {
        npcBlockX = true;
      }
      const dxZ = camera.position.x - npc.position.x;
      const dzZ = newZ - npc.position.z;
      if (dxZ * dxZ + dzZ * dzZ < (PLAYER_RADIUS + npcRadius) * (PLAYER_RADIUS + npcRadius)) {
        npcBlockZ = true;
      }
      if (npcBlockX && npcBlockZ) break;
    }

    if (!blockedX && !npcBlockX) camera.position.x = newX;
    if (!blockedZ && !npcBlockZ) camera.position.z = newZ;

    // Footstep audio
    const moving = direction.current.length() > 0 && ((!blockedX && !npcBlockX) || (!blockedZ && !npcBlockZ));
    if (moving) {
      const stepInterval = sprint ? 220 : 380;
      const now2 = Date.now();
      if (now2 - lastFootstep.current > stepInterval) {
        lastFootstep.current = now2;
        playFootstep(sprint);
      }
    }

    camera.position.y = 1.7;

    // Expose position for minimap
    (window as any).__playerPos = { x: camera.position.x, z: camera.position.z };
    (window as any).__playerRot = camera.rotation.y;

    // Collectible pickup check
    const px = camera.position.x;
    const pz = camera.position.z;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz2 = -1; dz2 <= 1; dz2++) {
        const chunkData = getChunkData(cx + dx, cz + dz2);
        for (const col of chunkData.collectibles) {
          const cdx = col.position[0] - px;
          const cdz = col.position[2] - pz;
          if (cdx * cdx + cdz * cdz < 1.5) {
            if (col.type === 'food') {
              store.setHunger(Math.min(100, store.hunger + col.value));
            } else if (col.type === 'water') {
              store.setThirst(Math.min(100, store.thirst + col.value));
            } else if (col.type === 'health') {
              store.setHealth(Math.min(100, store.health + col.value));
            } else if (col.type === 'weapon' && col.weaponIndex !== undefined) {
              store.unlockWeapon(col.weaponIndex);
            }
            removeCollectible(col.id);
            playHit();
            break;
          }
        }
      }
    }

    // Hunger/thirst drain
    const now = Date.now();
    if (now - lastStatDrain.current > 1000) {
      lastStatDrain.current = now;
      const sprintDrain = sprint ? 1.5 : 1.0;
      store.setHunger(Math.max(0, store.hunger - HUNGER_DRAIN * sprintDrain));
      store.setThirst(Math.max(0, store.thirst - THIRST_DRAIN * sprintDrain));

      // Low hunger/thirst damages health
      if (store.hunger <= 0 || store.thirst <= 0) {
        store.setHealth(Math.max(0, store.health - 0.3));
      }
    }

    // Send position to server at 20Hz
    if (now - lastSent.current > 50) {
      lastSent.current = now;
      sendMovement(
        { x: camera.position.x, y: camera.position.y, z: camera.position.z },
        camera.rotation.y,
        sprint
      );
    }
  });

  return null;
}

function performAttack(camera: THREE.Camera, weapon: { damage: number; range: number }) {
  const store = useGameStore.getState();
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();

  const attackPos = new THREE.Vector3(
    camera.position.x + forward.x * weapon.range * 0.5,
    camera.position.y,
    camera.position.z + forward.z * weapon.range * 0.5
  );

  // Check NPCs in range
  for (const npc of store.npcs) {
    const dx = npc.position.x - camera.position.x;
    const dz = npc.position.z - camera.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= weapon.range) {
      // Check if NPC is roughly in front of player
      const toNpc = new THREE.Vector3(dx, 0, dz).normalize();
      const dot = forward.dot(toNpc);
      if (dot > 0.5) {
        // Hit! Send to server
        const socket = (window as any).__gameSocket;
        if (socket) {
          socket.emit('attack:npc', { npcId: npc.id, damage: weapon.damage });
        }
        break;
      }
    }
  }

  // Check remote players in range
  for (const [id, player] of store.remotePlayers) {
    const dx = player.position.x - camera.position.x;
    const dz = player.position.z - camera.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist <= weapon.range) {
      const toPlayer = new THREE.Vector3(dx, 0, dz).normalize();
      const dot = forward.dot(toPlayer);
      if (dot > 0.5) {
        const socket = (window as any).__gameSocket;
        if (socket) {
          socket.emit('attack:player', { targetId: id, damage: weapon.damage });
        }
        break;
      }
    }
  }
}

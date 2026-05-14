import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { getChunkData, CHUNK_SIZE } from '../utils/worldGen';

const SURVIVOR_DIALOGUES = [
  ["Hey... you're new here, aren't you?", "I've been stuck in here for 47 days.", "The employees... they change at night. Don't let them catch you."],
  ["Welcome to our little camp.", "We've got some food if you need it.", "Whatever you do, don't try to find the exit. There isn't one."],
  ["You look lost. Everyone does at first.", "Stick to the lit areas during the day.", "At night, hide. Just hide."],
  ["Another one... the store keeps bringing people in.", "I used to think this was just a regular IKEA.", "Now I know better. The geometry here... it doesn't make sense."],
  ["Psst! Over here!", "Have you seen the tall ones up close?", "No faces. Just... smooth skin where a face should be.", "I still hear them saying it: 'The store is now closed.'"],
  ["I found a way to survive.", "During the day, gather supplies. Food, water, anything.", "At night, barricade yourself with furniture.", "They can't break through the heavy shelves."],
  ["You want advice? Here's advice:", "The restaurants still have food somehow.", "Don't ask where it comes from. Just eat.", "And always keep a weapon handy."],
  ["I've mapped out about 200 sections so far.", "It just keeps going. Bathrooms, kitchens, bedrooms...", "All IKEA. Forever. In every direction.", "Some people went mad trying to find the walls."],
  ["The settlements are safe. Mostly.", "We take turns keeping watch at night.", "If you hear 'please exit the building'... run.", "Run and don't look back."],
  ["Day 112. Or maybe 113. I lost count.", "The lights flicker before nightfall.", "That's your warning. You get maybe 30 seconds.", "Use them wisely."],
];

export default function DialogueSystem() {
  const [activeDialogue, setActiveDialogue] = useState<string[] | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const lastTrigger = useRef(0);
  const lastSettlement = useRef('');

  useEffect(() => {
    const check = setInterval(() => {
      const playerPos = (window as any).__playerPos;
      if (!playerPos) return;

      const now = Date.now();
      if (now - lastTrigger.current < 30000) return;

      const cx = Math.floor(playerPos.x / CHUNK_SIZE);
      const cz = Math.floor(playerPos.z / CHUNK_SIZE);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          const chunk = getChunkData(cx + dx, cz + dz);
          for (const s of chunk.settlements) {
            const sdx = s.position[0] - playerPos.x;
            const sdz = s.position[2] - playerPos.z;
            const dist = Math.sqrt(sdx * sdx + sdz * sdz);
            if (dist < s.radius + 2) {
              const key = `${cx + dx},${cz + dz}`;
              if (key === lastSettlement.current) return;
              lastSettlement.current = key;
              lastTrigger.current = now;
              const dialogue = SURVIVOR_DIALOGUES[Math.floor(Math.random() * SURVIVOR_DIALOGUES.length)];
              setActiveDialogue(dialogue);
              setDialogueIndex(0);
              setVisible(true);
              return;
            }
          }
        }
      }
    }, 500);

    return () => clearInterval(check);
  }, []);

  useEffect(() => {
    if (!visible || !activeDialogue) return;
    if (dialogueIndex >= activeDialogue.length) {
      setTimeout(() => setVisible(false), 1000);
      return;
    }
    const timer = setTimeout(() => {
      setDialogueIndex(i => i + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [visible, dialogueIndex, activeDialogue]);

  if (!visible || !activeDialogue) return null;

  return (
    <div style={{
      position: 'absolute', bottom: '200px', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(0,0,0,0.8)', border: '1px solid #555', borderRadius: '6px',
      padding: '12px 20px', maxWidth: '400px', fontFamily: 'Courier New',
      pointerEvents: 'none'
    }}>
      <div style={{ color: '#88ccff', fontSize: '10px', marginBottom: '4px' }}>
        SURVIVOR
      </div>
      <div style={{ color: '#e0e0e0', fontSize: '13px', lineHeight: 1.5 }}>
        {dialogueIndex < activeDialogue.length ? `"${activeDialogue[dialogueIndex]}"` : '...'}
      </div>
      <div style={{ color: '#555', fontSize: '9px', marginTop: '6px' }}>
        {dialogueIndex + 1}/{activeDialogue.length}
      </div>
    </div>
  );
}

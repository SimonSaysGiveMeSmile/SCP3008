import { useState, useRef, useEffect } from 'react';
import { useGameStore, WEAPONS } from '../store/gameStore';
import { sendChat } from '../utils/network';

function StatBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#aaa', marginBottom: '2px' }}>
        <span>{label}</span>
        <span>{Math.round(value)}/{max}</span>
      </div>
      <div style={{ width: '100%', height: '14px', background: 'rgba(0,0,0,0.5)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: '2px',
          background: color, transition: 'width 0.3s'
        }} />
      </div>
    </div>
  );
}

export default function HUD() {
  const health = useGameStore(s => s.health);
  const hunger = useGameStore(s => s.hunger);
  const thirst = useGameStore(s => s.thirst);
  const gameState = useGameStore(s => s.gameState);
  const messages = useGameStore(s => s.messages);
  const currentWeapon = useGameStore(s => s.currentWeapon);
  const settings = useGameStore(s => s.settings);
  const flashlightOn = useGameStore(s => s.flashlightOn);
  const isAttacking = useGameStore(s => s.isAttacking);
  const unlockedWeapons = useGameStore(s => s.unlockedWeapons);
  const [chatInput, setChatInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [fps, setFps] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);
  const frameCount = useRef(0);
  const lastFpsTime = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastFpsTime.current;
      if (elapsed > 0) {
        setFps(Math.round((frameCount.current / elapsed) * 1000));
        frameCount.current = 0;
        lastFpsTime.current = now;
      }
    }, 1000);

    const countFrame = () => {
      frameCount.current++;
      requestAnimationFrame(countFrame);
    };
    const id = requestAnimationFrame(countFrame);

    return () => { clearInterval(interval); cancelAnimationFrame(id); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !chatOpen) {
        e.preventDefault();
        setChatOpen(true);
      } else if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false);
        setChatInput('');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatOpen]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (chatInput.trim()) {
      sendChat(chatInput.trim());
      setChatInput('');
      setChatOpen(false);
    }
  };

  const timeDisplay = `${Math.floor(gameState.timeOfDay * 24).toString().padStart(2, '0')}:${Math.floor((gameState.timeOfDay * 24 % 1) * 60).toString().padStart(2, '0')}`;
  const weapon = WEAPONS[currentWeapon];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {/* Crosshair */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', width: '2px', height: '14px', background: 'rgba(255,255,255,0.7)' }} />
        <div style={{ position: 'absolute', width: '14px', height: '2px', background: 'rgba(255,255,255,0.7)' }} />
      </div>

      {/* Weapon swing visual */}
      <div style={{
        position: 'absolute', bottom: '120px', right: '80px',
        transform: `rotate(${isAttacking ? '-45deg' : '0deg'}) translateY(${isAttacking ? '-20px' : '0px'})`,
        transition: 'transform 0.1s ease-out',
        fontSize: '48px', opacity: 0.9,
        filter: isAttacking ? 'brightness(1.5)' : 'none'
      }}>
        {currentWeapon === 0 ? '✊' : currentWeapon === 1 ? '🪑' : currentWeapon === 2 ? '🪵' : '🏏'}
      </div>

      {/* FPS counter */}
      {settings.showFps && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#44ff44', fontSize: '12px', fontFamily: 'Courier New' }}>
          {fps} FPS
        </div>
      )}

      {/* Survival stats - bottom center */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        width: '280px', padding: '8px', background: 'rgba(0,0,0,0.6)', borderRadius: '4px',
        fontFamily: 'Courier New'
      }}>
        <StatBar value={health} max={100} color={health > 60 ? '#44cc44' : health > 30 ? '#cccc44' : '#cc4444'} label="HP" />
        <StatBar value={hunger} max={100} color={hunger > 50 ? '#cc8833' : '#cc4444'} label="HUNGER" />
        <StatBar value={thirst} max={100} color={thirst > 50 ? '#3388cc' : '#cc4444'} label="THIRST" />
      </div>

      {/* Weapon display - bottom left */}
      <div style={{
        position: 'absolute', bottom: '20px', left: '20px',
        background: 'rgba(0,0,0,0.6)', padding: '8px 12px', borderRadius: '4px',
        fontFamily: 'Courier New', color: '#e0e0e0', fontSize: '12px'
      }}>
        <div style={{ color: '#ffcc00', marginBottom: '2px' }}>{weapon.name}</div>
        <div style={{ color: '#888', fontSize: '10px' }}>
          DMG: {weapon.damage} | RNG: {weapon.range.toFixed(1)}m
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
          {WEAPONS.map((w, i) => (
            <div key={i} style={{
              width: '20px', height: '20px', borderRadius: '3px',
              background: i === currentWeapon ? '#ffcc00' : unlockedWeapons[i] ? '#444' : '#222',
              border: `1px solid ${i === currentWeapon ? '#ffcc00' : unlockedWeapons[i] ? '#666' : '#333'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', color: unlockedWeapons[i] ? '#fff' : '#555'
            }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{ color: '#555', fontSize: '9px', marginTop: '4px' }}>
          [1-4] Switch | LMB Attack
        </div>
      </div>

      {/* Day/Night indicator */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px',
        background: 'rgba(0,0,0,0.6)', padding: '10px 15px', borderRadius: '4px',
        color: '#fff', fontFamily: 'Courier New', fontSize: '14px'
      }}>
        <div style={{ color: gameState.isNight ? '#ff4444' : '#ffcc00' }}>
          {gameState.isNight ? '[ NIGHT ]' : '[ DAY ]'}
        </div>
        <div style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
          {timeDisplay} | Day {gameState.dayCount}
        </div>
        <div style={{ fontSize: '11px', color: flashlightOn ? '#ffee88' : '#555', marginTop: '4px' }}>
          {flashlightOn ? '[F] Flashlight ON' : '[F] Flashlight OFF'}
        </div>
      </div>

      {/* Night warning */}
      {gameState.isNight && (
        <div style={{
          position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)',
          color: '#ff3333', fontFamily: 'Courier New', fontSize: '14px',
          textAlign: 'center', textShadow: '0 0 10px #ff0000',
          animation: 'pulse 1.5s infinite'
        }}>
          "The store is now closed. Please exit the building."
        </div>
      )}

      {/* Chat */}
      <div style={{
        position: 'absolute', top: '60px', left: '20px', width: '320px',
        pointerEvents: chatOpen ? 'auto' : 'none'
      }}>
        <div ref={chatRef} style={{
          maxHeight: '120px', overflowY: 'auto', marginBottom: '5px',
          padding: '5px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px'
        }}>
          {messages.map(msg => (
            <div key={msg.id} style={{ color: '#ddd', fontSize: '11px', fontFamily: 'Courier New', marginBottom: '2px' }}>
              <span style={{ color: '#88ccff' }}>{msg.sender}:</span> {msg.text}
            </div>
          ))}
        </div>
        {chatOpen && (
          <input
            autoFocus
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            style={{
              width: '100%', padding: '6px', fontSize: '11px',
              background: 'rgba(0,0,0,0.7)', border: '1px solid #444',
              color: '#fff', fontFamily: 'Courier New', borderRadius: '4px',
              pointerEvents: 'auto'
            }}
          />
        )}
      </div>

      {/* Controls hint */}
      <div style={{
        position: 'absolute', top: '20px', left: '20px',
        color: '#555', fontSize: '10px', fontFamily: 'Courier New'
      }}>
        WASD Move | Shift Sprint | Tab Settings | Enter Chat | F Flashlight | 1-4 Weapons
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

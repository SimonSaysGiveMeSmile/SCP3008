import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, CSSProperties } from 'react';
import { useGameStore } from '../store/gameStore';
import { touch, fireKey, fireAttack } from '../touch';

/**
 * Touch overlay for SCP-3008: left move stick, right drag-look (replaces
 * pointer lock), and action buttons. Weapon/flashlight/menu buttons synthesize
 * the existing keyboard events; attack synthesizes a left-mouse-down.
 */
export default function MobileControls() {
  const currentWeapon = useGameStore((s) => s.currentWeapon);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', touchAction: 'none' }}>
      <LookZone />
      <Joystick />

      {/* Weapon switcher — top center */}
      <div style={{
        position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, pointerEvents: 'auto',
      }}>
        {[0, 1, 2, 3].map((i) => (
          <TapButton key={i} label={`${i + 1}`} active={currentWeapon === i} onTap={() => fireKey(`Digit${i + 1}`)} size={44} />
        ))}
      </div>

      {/* Menu (Tab) — top right */}
      <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', right: 'calc(env(safe-area-inset-right, 0px) + 14px)', pointerEvents: 'auto' }}>
        <TapButton label="☰" onTap={() => fireKey('Tab')} size={46} />
      </div>

      {/* Right action cluster */}
      <div style={{
        position: 'fixed',
        right: 'calc(env(safe-area-inset-right, 0px) + 20px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)',
        display: 'flex', alignItems: 'flex-end', gap: 12, pointerEvents: 'auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TapButton label="LIGHT" onTap={() => fireKey('KeyF')} size={64} />
          <HoldButton label="SPRINT" onChange={(v) => { touch.sprint = v; }} size={64} />
        </div>
        <HoldButton label="HIT" onChange={(v) => { if (v) fireAttack(); }} size={92} hero />
      </div>
    </div>
  );
}

function LookZone() {
  const last = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '56%', pointerEvents: 'auto', touchAction: 'none' }}
      onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); last.current = { x: e.clientX, y: e.clientY }; }}
      onPointerMove={(e) => { if (!last.current) return; touch.lookDX += e.clientX - last.current.x; touch.lookDY += e.clientY - last.current.y; last.current = { x: e.clientX, y: e.clientY }; }}
      onPointerUp={() => { last.current = null; }}
      onPointerCancel={() => { last.current = null; }}
    />
  );
}

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);
  const setKnob = (dx: number, dy: number) => { if (knobRef.current) knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`; };
  return (
    <div
      ref={baseRef}
      onPointerDown={(e) => { (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); active.current = true; }}
      onPointerMove={(e) => {
        if (!active.current) return;
        const rect = baseRef.current?.getBoundingClientRect(); if (!rect) return;
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2, maxDist = rect.width / 2 - 14;
        let dx = e.clientX - cx, dy = e.clientY - cy; const dist = Math.hypot(dx, dy);
        if (dist > maxDist) { dx = (dx / dist) * maxDist; dy = (dy / dist) * maxDist; }
        setKnob(dx, dy); touch.mx = dx / maxDist; touch.my = dy / maxDist;
      }}
      onPointerUp={() => { active.current = false; touch.mx = 0; touch.my = 0; setKnob(0, 0); }}
      onPointerCancel={() => { active.current = false; touch.mx = 0; touch.my = 0; setKnob(0, 0); }}
      style={{
        position: 'fixed', left: 'calc(env(safe-area-inset-left, 0px) + 20px)', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)',
        width: 144, height: 144, borderRadius: '50%', background: 'rgba(8, 10, 14, 0.4)',
        border: '2px solid rgba(120, 200, 210, 0.4)', pointerEvents: 'auto', touchAction: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div ref={knobRef} style={{ width: 58, height: 58, borderRadius: '50%', background: 'rgba(120, 200, 210, 0.5)', border: '2px solid rgba(120, 200, 210, 0.9)' }} />
    </div>
  );
}

const base = (size: number, on: boolean, hero?: boolean): CSSProperties => ({
  width: size, height: size, borderRadius: hero ? '50%' : 14,
  border: `2px solid ${hero ? 'rgba(255,90,90,0.75)' : 'rgba(160,180,190,0.5)'}`,
  background: on ? (hero ? 'rgba(255,90,90,0.9)' : 'rgba(180,210,215,0.9)') : 'rgba(8,10,14,0.5)',
  color: on ? '#0a0c10' : (hero ? '#ff8a8a' : '#dfe8ea'),
  fontFamily: 'Courier New, monospace', fontWeight: 700, fontSize: hero ? 16 : 12, letterSpacing: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  touchAction: 'none', userSelect: 'none', WebkitTapHighlightColor: 'transparent', cursor: 'pointer',
});

function HoldButton({ label, onChange, size, hero }: { label: string; onChange: (v: boolean) => void; size: number; hero?: boolean }) {
  const [p, setP] = useState(false);
  return (
    <div
      style={base(size, p, hero)}
      onPointerDown={(e) => { e.preventDefault(); (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId); setP(true); onChange(true); }}
      onPointerUp={(e) => { e.preventDefault(); setP(false); onChange(false); }}
      onPointerCancel={() => { setP(false); onChange(false); }}
    >{label}</div>
  );
}

function TapButton({ label, onTap, size, active }: { label: string; onTap: () => void; size: number; active?: boolean }) {
  const [p, setP] = useState(false);
  return (
    <div
      style={base(size, p || !!active)}
      onPointerDown={(e) => { e.preventDefault(); setP(true); }}
      onPointerUp={(e) => { e.preventDefault(); setP(false); onTap(); }}
      onPointerCancel={() => setP(false)}
    >{label}</div>
  );
}

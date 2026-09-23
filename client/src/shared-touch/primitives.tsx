import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, CSSProperties } from 'react';
import { touch } from './touch';

export interface Theme {
  base: string;        // background when inactive
  border: string;      // border color
  active: string;      // background when pressed
  activeText: string;  // text color when pressed
  inactiveText: string; // text color when inactive
}

/** Right-side drag area that feeds camera look deltas to touch.lookDX/lookDY. */
export function LookZone({ widthPercent = 58 }: { widthPercent?: number }) {
  const last = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: `${widthPercent}%`,
        pointerEvents: 'auto', touchAction: 'none',
      }}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        if (!last.current) return;
        touch.lookDX += e.clientX - last.current.x;
        touch.lookDY += e.clientY - last.current.y;
        last.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => { last.current = null; }}
      onPointerCancel={() => { last.current = null; }}
    />
  );
}

/** Bottom-left movement joystick → touch.mx / touch.my. */
export function Joystick({
  left = 22,
  bottom = 30,
  size = 144,
  knobSize = 58,
  theme,
}: {
  left?: number;
  bottom?: number;
  size?: number;
  knobSize?: number;
  theme: Theme;
}) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const active = useRef(false);

  const setKnob = (dx: number, dy: number) => {
    if (knobRef.current) knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        active.current = true;
      }}
      onPointerMove={(e) => {
        if (!active.current) return;
        const rect = baseRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const maxDist = rect.width / 2 - 14;
        let dx = e.clientX - cx;
        let dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > maxDist) {
          dx = (dx / dist) * maxDist;
          dy = (dy / dist) * maxDist;
        }
        setKnob(dx, dy);
        touch.mx = dx / maxDist;
        touch.my = dy / maxDist;
      }}
      onPointerUp={() => {
        active.current = false;
        touch.mx = 0;
        touch.my = 0;
        setKnob(0, 0);
      }}
      onPointerCancel={() => {
        active.current = false;
        touch.mx = 0;
        touch.my = 0;
        setKnob(0, 0);
      }}
      style={{
        position: 'fixed',
        left: `calc(env(safe-area-inset-left, 0px) + ${left}px)`,
        bottom: `calc(env(safe-area-inset-bottom, 0px) + ${bottom}px)`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: theme.base,
        border: `2px solid ${theme.border}`,
        pointerEvents: 'auto',
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: knobSize,
          height: knobSize,
          borderRadius: '50%',
          background: theme.active,
          border: `2px solid ${theme.border}`,
          boxShadow: `0 0 12px ${theme.border}`,
        }}
      />
    </div>
  );
}

interface ButtonBaseProps {
  label: string;
  size: number;
  theme: Theme;
  hero?: boolean;
  active?: boolean;
}

const btnStyle = (size: number, on: boolean, theme: Theme, hero?: boolean): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: hero ? '50%' : 16,
  border: `2px solid ${theme.border}`,
  background: on ? theme.active : theme.base,
  color: on ? theme.activeText : theme.inactiveText,
  fontFamily: 'monospace',
  fontWeight: 700,
  fontSize: hero ? 16 : 12,
  letterSpacing: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  cursor: 'pointer',
});

/** Hold button — fires onChange(true) on press, onChange(false) on release. */
export function HoldButton({
  label,
  onChange,
  size,
  theme,
  hero,
}: ButtonBaseProps & { onChange: (v: boolean) => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      style={btnStyle(size, pressed, theme, hero)}
      onPointerDown={(e) => {
        e.preventDefault();
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        setPressed(true);
        onChange(true);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        setPressed(false);
        onChange(false);
      }}
      onPointerCancel={() => {
        setPressed(false);
        onChange(false);
      }}
    >
      {label}
    </div>
  );
}

/** Tap button — fires onTap() on press. Optional `active` prop for toggle-style buttons. */
export function TapButton({
  label,
  onTap,
  size,
  theme,
  active,
}: ButtonBaseProps & { onTap: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      style={btnStyle(size, pressed || !!active, theme)}
      onPointerDown={(e) => {
        e.preventDefault();
        setPressed(true);
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        setPressed(false);
        onTap();
      }}
      onPointerCancel={() => setPressed(false)}
    >
      {label}
    </div>
  );
}

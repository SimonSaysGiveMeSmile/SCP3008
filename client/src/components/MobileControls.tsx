import { useGameStore } from '../store/gameStore';
import { touch, fireKey, fireAttack } from '../shared-touch/touch';
import { LookZone, Joystick, HoldButton, TapButton, Theme } from '../shared-touch/primitives';

const SCP_THEME: Theme = {
  base: 'rgba(8, 10, 14, 0.5)',
  border: 'rgba(160, 180, 190, 0.5)',
  active: 'rgba(180, 210, 215, 0.9)',
  activeText: '#0a0c10',
  inactiveText: '#dfe8ea',
};

const JOYSTICK_THEME: Theme = {
  base: 'rgba(8, 10, 14, 0.4)',
  border: 'rgba(120, 200, 210, 0.4)',
  active: 'rgba(120, 200, 210, 0.5)',
  activeText: '#0a0c10',
  inactiveText: '#dfe8ea',
};

const HERO_THEME: Theme = {
  base: 'rgba(8, 10, 14, 0.5)',
  border: 'rgba(255, 90, 90, 0.75)',
  active: 'rgba(255, 90, 90, 0.9)',
  activeText: '#0a0c10',
  inactiveText: '#ff8a8a',
};

/**
 * Touch overlay for SCP-3008: left move stick, right drag-look (replaces
 * pointer lock), and action buttons. Weapon/flashlight/menu buttons synthesize
 * the existing keyboard events; attack synthesizes a left-mouse-down.
 */
export default function MobileControls() {
  const currentWeapon = useGameStore((s) => s.currentWeapon);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', touchAction: 'none' }}>
      <LookZone widthPercent={56} />
      <Joystick left={20} bottom={28} size={144} knobSize={58} theme={JOYSTICK_THEME} />

      {/* Weapon switcher — top center */}
      <div style={{
        position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, pointerEvents: 'auto',
      }}>
        {[0, 1, 2, 3].map((i) => (
          <TapButton key={i} label={`${i + 1}`} active={currentWeapon === i} onTap={() => fireKey(`Digit${i + 1}`)} size={44} theme={SCP_THEME} />
        ))}
      </div>

      {/* Menu (Tab) — top right */}
      <div style={{ position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', right: 'calc(env(safe-area-inset-right, 0px) + 14px)', pointerEvents: 'auto' }}>
        <TapButton label="☰" onTap={() => fireKey('Tab')} size={46} theme={SCP_THEME} />
      </div>

      {/* Right action cluster */}
      <div style={{
        position: 'fixed',
        right: 'calc(env(safe-area-inset-right, 0px) + 20px)',
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)',
        display: 'flex', alignItems: 'flex-end', gap: 12, pointerEvents: 'auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <TapButton label="LIGHT" onTap={() => fireKey('KeyF')} size={64} theme={SCP_THEME} />
          <HoldButton label="SPRINT" onChange={(v) => { touch.sprint = v; }} size={64} theme={SCP_THEME} />
        </div>
        <HoldButton label="HIT" onChange={(v) => { if (v) fireAttack(); }} size={92} theme={HERO_THEME} hero />
      </div>
    </div>
  );
}

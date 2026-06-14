// Shared touch-input state for SCP-3008. Read by Player (movement) and
// TouchLook (camera). Action buttons synthesize the existing keyboard/mouse
// events so weapon/flashlight/attack logic stays in one place.
export const touch = {
  mx: 0,
  my: 0,
  lookDX: 0,
  lookDY: 0,
  sprint: false,
};

export const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export const fireKey = (code: string) =>
  window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));

export const fireAttack = () =>
  window.dispatchEvent(new MouseEvent('mousedown', { button: 0, bubbles: true }));

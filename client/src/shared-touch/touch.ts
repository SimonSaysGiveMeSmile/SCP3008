// Shared touch-input state for FPS games. Read by Player (movement) and
// TouchLook (camera). A plain mutable object keeps the hot path allocation-free.
export const touch = {
  mx: 0,      // strafe  -1 (left) .. +1 (right)
  my: 0,      // forward -1 (up) .. +1 (back)
  lookDX: 0,  // accumulated look delta x (consumed each frame)
  lookDY: 0,  // accumulated look delta y
  sprint: false,
};

export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Helpers to synthesize keyboard/mouse events for game-specific actions
// (weapon switching, flashlight, attack) so action logic stays in one place.
export const fireKey = (code: string) =>
  window.dispatchEvent(new KeyboardEvent('keydown', { code, bubbles: true }));

export const fireAttack = () =>
  window.dispatchEvent(new MouseEvent('mousedown', { button: 0, bubbles: true }));

// controls.ts - Manejo centralizado de entrada de usuario

const keys: Record<string, boolean> = {};

let enabled = false;
let keyCallback: ((key: string, pressed: boolean) => void) | null = null;

export function setupControls(
  callback?: (key: string, pressed: boolean) => void
): void {
  if (enabled) return; // prevenir múltiples registros

  keyCallback = callback ?? null;

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  enabled = true;
}

function handleKeyDown(e: KeyboardEvent): void {
  const key = e.key.toLowerCase();
  if (!keys[key]) {
    keys[key] = true;
    keyCallback?.(key, true);
  }
}

function handleKeyUp(e: KeyboardEvent): void {
  const key = e.key.toLowerCase();
  keys[key] = false;
  keyCallback?.(key, false);
}

export function isPressed(key: string): boolean {
  return keys[key.toLowerCase()] || false;
}

export function clearControls(): void {
  if (!enabled) return;

  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
  keyCallback = null;
  enabled = false;
}

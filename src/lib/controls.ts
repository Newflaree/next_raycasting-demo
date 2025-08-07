// controls.ts - Manejo centralizado de entrada de usuario

import {
  player,
  moveForward,
  moveBackward,
  strafeLeft,
  strafeRight,
  rotate,
  startRunning,
  stopRunning,
  updateStamina
} from '@/lib/player';

// Registro de teclas presionadas
const keys: Record<string, boolean> = {};

// Control de activación/desactivación
let enabled = false;

// Callback externo para detectar teclas específicas
let keyCallback: ((key: string, pressed: boolean) => void) | null = null;

// Inicializa el sistema de entrada
export function setupControls(
  callback?: (key: string, pressed: boolean) => void
): void {
  if (enabled) return;
  keyCallback = callback ?? null;

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  enabled = true;
}

// Tecla presionada
function handleKeyDown(e: KeyboardEvent): void {
  const key = e.key.toLowerCase();
  if (!keys[key]) {
    keys[key] = true;
    keyCallback?.(key, true);
  }
}

// Tecla soltada
function handleKeyUp(e: KeyboardEvent): void {
  const key = e.key.toLowerCase();
  keys[key] = false;
  keyCallback?.(key, false);
}

// Consulta si una tecla está presionada
export function isPressed(key: string): boolean {
  return keys[key.toLowerCase()] || false;
}

// Limpia todos los controles (por ejemplo, al pausar o salir del juego)
export function clearControls(): void {
  if (!enabled) return;

  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  keyCallback = null;
  enabled = false;
}

// =====================================
// Función principal para manejar controles
// Debe llamarse en cada frame del loop
// =====================================
export function handlePlayerInput(): void {
  const shift = isPressed('shift');
  const up = isPressed('w');
  const down = isPressed('s');
  const left = isPressed('a');
  const right = isPressed('d');

  const isMoving = up || down || left || right;

  // Movimiento en base a teclas WASD
  if (up) moveForward(player, player.speed);
  if (down) moveBackward(player, player.speed);
  if (left) strafeLeft(player, player.speed);
  if (right) strafeRight(player, player.speed);

  // Rotación con flechas
  if (isPressed('arrowleft')) rotate(player, -0.12); // Sensibilidad ajustada
  if (isPressed('arrowright')) rotate(player, 0.12);

  // Modo correr (SHIFT + movimiento)
  if (shift && isMoving) {
    startRunning(player);
  } else {
    stopRunning(player);
  }

  // Actualización de estamina (sólo si está moviéndose y presionando SHIFT)
  updateStamina(player, isMoving && shift);
}

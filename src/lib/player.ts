// ===============================
// Interfaz del jugador estilo DOOM mejorado
// ===============================
export interface Player {
  x: number;         // Posición horizontal (mapa 2D)
  y: number;         // Posición vertical (mapa 2D)
  angle: number;     // Ángulo de visión en radianes
  speed: number;     // Velocidad actual (base o corriendo)
  z: number;         // Altura de la cámara (eje vertical)
  vz: number;        // Velocidad vertical (para salto o caída)
  health: number;    // Vida del jugador (0-100)
  armor: number;     // Armadura (reduce daño antes de la salud)
  stamina: number;   // Estamina para correr (0-100)
  isRunning: boolean;// Si el jugador está corriendo
}

// ===============================
// Instancia inicial del jugador
// ===============================
export const player: Player = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 2.5,           // ✅ velocidad base aumentada
  z: 0,
  vz: 0,
  health: 100,
  armor: 50,
  stamina: 100,
  isRunning: false
};

// ===============================
// Utilidad para limitar valores
// ===============================
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ===============================
// Movimiento y rotación
// ===============================
export function moveForward(player: Player, distance: number) {
  player.x += Math.cos(player.angle) * distance;
  player.y += Math.sin(player.angle) * distance;
}

export function moveBackward(player: Player, distance: number) {
  player.x -= Math.cos(player.angle) * distance;
  player.y -= Math.sin(player.angle) * distance;
}

export function strafeLeft(player: Player, distance: number) {
  player.x += Math.cos(player.angle - Math.PI / 2) * distance;
  player.y += Math.sin(player.angle - Math.PI / 2) * distance;
}

export function strafeRight(player: Player, distance: number) {
  player.x += Math.cos(player.angle + Math.PI / 2) * distance;
  player.y += Math.sin(player.angle + Math.PI / 2) * distance;
}

export function rotate(player: Player, angleDelta: number) {
  player.angle = (player.angle + angleDelta) % (2 * Math.PI);
  if (player.angle < 0) player.angle += 2 * Math.PI;
}

// ===============================
// Gravedad y salto
// ===============================
export function applyGravity(player: Player, floorHeight: number) {
  const gravity = 0.5;
  player.vz -= gravity;
  player.z += player.vz;

  if (player.z < floorHeight) {
    player.z = floorHeight;
    player.vz = 0;
  }
}

export function jump(player: Player, floorHeight: number, power: number = 5) {
  if (player.z === floorHeight) {
    player.vz = power;
  }
}

// ===============================
// Sistema de salud y armadura
// ===============================
export function takeDamage(player: Player, amount: number) {
  const damageToArmor = Math.min(player.armor, amount);
  player.armor -= damageToArmor;

  const remaining = amount - damageToArmor;
  player.health -= remaining;

  player.armor = clamp(player.armor, 0, 100);
  player.health = clamp(player.health, 0, 100);
}

export function heal(player: Player, amount: number) {
  player.health = clamp(player.health + amount, 0, 100);
}

export function repairArmor(player: Player, amount: number) {
  player.armor = clamp(player.armor + amount, 0, 100);
}

// ===============================
// Sistema de estamina
// ===============================

// Velocidades configurables
const BASE_SPEED = 2.5;
const RUN_SPEED = BASE_SPEED * 1.1;

/**
 * Inicia el modo correr si tiene estamina suficiente.
 */
export function startRunning(player: Player) {
  if (player.stamina > 0 && !player.isRunning) {
    player.isRunning = true;
    player.speed = RUN_SPEED;
  }
}

/**
 * Detiene el modo correr.
 */
export function stopRunning(player: Player) {
  if (player.isRunning) {
    player.isRunning = false;
    player.speed = BASE_SPEED;
  }
}

/**
 * Llamar en cada frame del loop para manejar la estamina.
 * `isMoving` indica si el jugador está presionando una tecla de movimiento.
 */
export function updateStamina(player: Player, isMoving: boolean) {
  if (player.isRunning && isMoving) {
    player.stamina -= 0.5;
    if (player.stamina <= 0) {
      player.stamina = 0;
      stopRunning(player);
    }
  } else {
    player.stamina += 0.25; // regeneración lenta
  }

  player.stamina = clamp(player.stamina, 0, 100);
}

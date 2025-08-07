// ===============================
// Interfaz del jugador estilo DOOM
// ===============================
export interface Player {
  x: number;       // Posición horizontal (mapa 2D)
  y: number;       // Posición vertical (mapa 2D)
  angle: number;   // Ángulo de visión en radianes (0 = derecha)
  speed: number;   // Velocidad de movimiento horizontal
  z: number;       // Altura de la cámara (en el eje vertical)
  vz: number;      // Velocidad vertical (para salto, caída, etc.)
}

// ===============================
// Instancia inicial del jugador
// ===============================
export const player: Player = {
  x: 100,
  y: 100,
  angle: 0,
  speed: 2,
  z: 0,    // altura del piso (por defecto)
  vz: 0    // sin velocidad vertical inicial
};

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

/**
 * Aplica gravedad al jugador cada frame.
 * Si el jugador está por debajo del piso, se corrige.
 * @param player Instancia del jugador
 * @param floorHeight Altura del piso del sector actual
 */
export function applyGravity(player: Player, floorHeight: number) {
  const gravity = 0.5;  // fuerza de gravedad por frame
  player.vz -= gravity;
  player.z += player.vz;

  // Limitar caída al piso
  if (player.z < floorHeight) {
    player.z = floorHeight;
    player.vz = 0;
  }
}

/**
 * Simula un salto si el jugador está en el piso
 * @param player Instancia del jugador
 * @param floorHeight Altura del piso actual
 * @param power Impulso vertical (default 5)
 */
export function jump(player: Player, floorHeight: number, power: number = 5) {
  if (player.z === floorHeight) {
    player.vz = power;
  }
}

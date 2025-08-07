// sprite.ts - Sistema de entidades estilo Doom (sprites)

export interface Sprite {
  x: number;               // Posición horizontal (eje X)
  y: number;               // Posición vertical (eje Y)
  z: number;               // Altura sobre el piso
  texture: string;         // Nombre base del recurso gráfico
  isPickup: boolean;       // ¿Es un ítem recogible?
  isEnemy: boolean;        // ¿Es un enemigo?
  active: boolean;         // ¿Está activo en el mapa?
  animationFrame?: number; // Frame actual para animaciones (opcional)
  health?: number;         // Salud del enemigo
  maxHealth?: number;      // Salud máxima
}

// Lista global de sprites (ítems, enemigos, decoración)
export const sprites: Sprite[] = [
  {
    x: 200,
    y: 180,
    z: 0,
    texture: "barrel",         // Objeto decorativo
    isPickup: false,
    isEnemy: false,
    active: true,
  },
  {
    x: 250,
    y: 210,
    z: 0,
    texture: "health",         // Ítem de vida
    isPickup: true,
    isEnemy: false,
    active: true,
  },
  {
    x: 300,
    y: 250,
    z: 0,
    texture: "imp",            // Enemigo básico
    isPickup: false,
    isEnemy: true,
    active: true,
    animationFrame: 0,
    health: 100,
    maxHealth: 100,
  },
];

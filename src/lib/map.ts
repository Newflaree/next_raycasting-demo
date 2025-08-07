// ===============================
// Interfaces base del sistema tipo DOOM
// ===============================

export interface Sector {
  floorHeight: number;       // Altura del piso del sector
  ceilingHeight: number;     // Altura del techo del sector
  lightLevel: number;        // Nivel de luz (0.0 oscuro, 1.0 iluminado)
  wallTexture: string;       // Textura para los muros
  floorTexture: string;      // Textura para el suelo
  ceilingTexture: string;    // Textura para el techo
}

export interface Cell {
  wall: boolean;             // ¿Tiene esta celda una pared?
  sectorId: number;          // Índice del sector al que pertenece
}

// ===============================
// Constantes de mapa
// ===============================

export const TILE_SIZE = 40; // Tamaño de cada celda (en píxeles)

// ===============================
// Definición de sectores
// ===============================

export const sectors: Sector[] = [
  {
    floorHeight: 0,
    ceilingHeight: 100,
    lightLevel: 1.0,
    wallTexture: "wall1",
    floorTexture: "floor1",
    ceilingTexture: "ceiling1",
  },
  {
    floorHeight: -20,
    ceilingHeight: 80,
    lightLevel: 0.6,
    wallTexture: "wall2",
    floorTexture: "floor2",
    ceilingTexture: "ceiling2",
  },
];

// ===============================
// Mapa 8x8 basado en celdas
// Cada celda contiene:
// - Si es un muro (`wall: true`)
// - A qué sector pertenece (`sectorId`)
// ===============================

export const map: Cell[][] = [
  [
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 },
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 },
    { wall: false, sectorId: 0 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 },
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: true, sectorId: 0 },
    { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 1 },
    { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: false, sectorId: 1 },
    { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 1 },
    { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 },
  ],
  [
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 },
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 },
  ],
];

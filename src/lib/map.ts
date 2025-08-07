// =====================
// Interfaces de Doom
// =====================

export interface Sector {
  floorHeight: number;        // Altura del piso
  ceilingHeight: number;      // Altura del techo
  lightLevel: number;         // De 0 (oscuro) a 1 (luz completa)
  wallTexture: string;        // Nombre del recurso para muros
  floorTexture: string;       // Nombre del recurso para piso
  ceilingTexture: string;     // Nombre del recurso para techo
}

export interface Cell {
  wall: boolean;              // ¿Esta celda tiene un muro?
  sectorId: number;           // A qué sector pertenece esta celda
}

// =====================
// Constantes
// =====================

export const TILE_SIZE = 40;  // Tamaño de cada celda en píxeles

// =====================
// Definición de Sectores
// =====================

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

// =====================
// Mapa (8x8) con datos de celda
// =====================

export const map: Cell[][] = [
  [
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 },
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 },
    { wall: false, sectorId: 0 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 },
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: true, sectorId: 0 },
    { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 1 },
    { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: false, sectorId: 1 },
    { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 0 }, { wall: false, sectorId: 1 },
    { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: false, sectorId: 1 }, { wall: true, sectorId: 0 }
  ],
  [
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 },
    { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }, { wall: true, sectorId: 0 }
  ]
];

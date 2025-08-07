// types.ts - Interfaces centralizadas para el motor estilo DOOM

/**
 * Representa una celda del mapa 2D.
 * Puede ser una pared o un espacio vacío, y está asociada a un sector.
 */
export interface Cell {
  wall: boolean;         // ¿Tiene pared?
  sectorId: number;      // A qué sector pertenece
}

/**
 * Define un sector del nivel (grupo de celdas con misma altura e iluminación).
 * Similar al concepto en Doom clásico.
 */
export interface Sector {
  floorHeight: number;    // Altura del piso en este sector
  ceilingHeight: number;  // Altura del techo en este sector
  lightLevel: number;     // Nivel de iluminación (0 = oscuro, 1 = brillante)
  wallTexture: string;    // Nombre del recurso para muros
  floorTexture: string;   // Nombre del recurso para piso
  ceilingTexture: string; // Nombre del recurso para techo
}

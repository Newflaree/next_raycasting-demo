import { map, TILE_SIZE } from './map';
import type { Cell } from './map';

// ============================
// Tipo de un rayo lanzado
// ============================
export interface Ray {
  distance: number;   // Distancia corregida (fisheye)
  angle: number;      // Ángulo del rayo en radianes
  hitX: number;       // Punto de impacto X
  hitY: number;       // Punto de impacto Y
  mapX: number;       // Índice X del bloque impactado
  mapY: number;       // Índice Y del bloque impactado
  sectorId: number;   // Sector al que pertenece el bloque
  wallHit: boolean;   // Si colisionó con muro
}

// ============================
// Verificación de muro (con fallback)
// ============================
export const isWall = (x: number, y: number): boolean => {
  const mapX = Math.floor(x / TILE_SIZE);
  const mapY = Math.floor(y / TILE_SIZE);
  const cell: Cell | undefined = map[mapY]?.[mapX];

  return cell?.wall ?? true; // Fuera del mapa = muro
};

// ============================
// Lanza múltiples rayos desde la posición del jugador
// ============================
export const castRays = (
  px: number,
  py: number,
  angle: number,
  fov: number,
  numRays: number
): Ray[] => {
  const rays: Ray[] = [];
  const step = fov / numRays;
  const maxDepth = 1000;

  for (let i = 0; i < numRays; i++) {
    const rayAngle = angle - fov / 2 + step * i;

    let rayX = px;
    let rayY = py;
    let distance = 0;

    let hit = false;
    let hitMapX = -1;
    let hitMapY = -1;

    // Bucle que avanza el rayo hasta chocar o alcanzar profundidad máxima
    while (distance < maxDepth) {
      rayX += Math.cos(rayAngle);
      rayY += Math.sin(rayAngle);
      distance++;

      const mapX = Math.floor(rayX / TILE_SIZE);
      const mapY = Math.floor(rayY / TILE_SIZE);

      if (map[mapY]?.[mapX]?.wall) {
        hit = true;
        hitMapX = mapX;
        hitMapY = mapY;
        break;
      }
    }

    // Corrección del efecto "ojo de pez"
    const correctedDistance = distance * Math.cos(rayAngle - angle);

    rays.push({
      distance: correctedDistance,
      angle: rayAngle,
      hitX: rayX,
      hitY: rayY,
      mapX: hitMapX,
      mapY: hitMapY,
      sectorId: map[hitMapY]?.[hitMapX]?.sectorId ?? 0,
      wallHit: hit
    });
  }

  return rays;
};

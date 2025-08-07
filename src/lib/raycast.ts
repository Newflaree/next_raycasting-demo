import { map, TILE_SIZE } from './map';
import type { Cell } from './map';

export interface Ray {
  distance: number;   // Distancia corregida (fisheye)
  angle: number;      // Ángulo del rayo (en radianes)
  hitX: number;       // Coordenada X del impacto
  hitY: number;       // Coordenada Y del impacto
  mapX: number;       // Índice X del bloque impactado
  mapY: number;       // Índice Y del bloque impactado
  sectorId: number;   // Sector impactado
  wallHit: boolean;   // Si colisionó con muro
}

// ============================
// NUEVA función para detectar muro desde Cell
// ============================

export const isWall = (x: number, y: number): boolean => {
  const mapX = Math.floor(x / TILE_SIZE);
  const mapY = Math.floor(y / TILE_SIZE);

  const cell: Cell | undefined = map[mapY]?.[mapX];
  return cell ? cell.wall : true; // por defecto: fuera del mapa = muro
};

// ============================
// Rayo individual (sin DDA aún, pero funcional)
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
    let hitMapX = 0;
    let hitMapY = 0;

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

    // Corrección de distorsión (fisheye fix)
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

import { map, TILE_SIZE } from './map';


export interface Ray {
  distance: number;
  angle: number;
}

const isWall = (
  x: number,
  y: number
): boolean => {
  const mapX = Math.floor( x / TILE_SIZE );
  const mapY = Math.floor( y / TILE_SIZE );
  return map[mapY]?.[mapX] === 1;
}

export const castRays = (
  px: number,
  py: number,
  angle: number,
  fov: number,
  numRays: number,
): Ray[] => {
  const rays: Ray[] = [];
  const step = fov / numRays;

  for ( let i = 0; i < numRays; i++ ) {
    const rayAngle = angle - fov / 2 + step * i;
    let rayX = px;
    let rayY = py;

    let distance = 0;
    const maxDepth = 1000;

    while ( distance < maxDepth ) {
      rayX += Math.cos( rayAngle );
      rayY += Math.sin( rayAngle );
      distance++;

      if ( isWall( rayX, rayY ) ) break;
    }

    const correctedDistance = distance * Math.cos( rayAngle - angle );
    rays.push({
      distance: correctedDistance,
      angle: rayAngle
    });
  }

  return rays;
}

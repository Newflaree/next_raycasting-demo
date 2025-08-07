// renderer.ts - Renderizado 3D con enemigos, pickups, sombreado, piso, techo y pistola HUD

import { TILE_SIZE, sectors, Cell, map } from '@/lib/map';
import { Player } from '@/lib/player';
import { Ray } from '@/lib/raycast';
import { sprites } from '@/lib/sprite';

// Cache global de sprites
const spriteCache: Record<string, HTMLImageElement> = {};

// Carga segura de sprites (cliente)
function loadSprite(name: string): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;

  if (!spriteCache[name]) {
    const img = new Image();
    img.src = `/sprites/${name}.png`;
    spriteCache[name] = img;
  }

  return spriteCache[name];
}

// Pistola HUD
let pistolImg: HTMLImageElement | null = null;
if (typeof window !== 'undefined') {
  pistolImg = new Image();
  pistolImg.src = '/hud/pistol.png';
}

export function renderScene(
  ctx: CanvasRenderingContext2D,
  rays: Ray[],
  player: Player,
  screenWidth: number,
  screenHeight: number
) {
  const sliceWidth = screenWidth / rays.length;

  // === MUROS, TECHO, PISO ===
  for (let i = 0; i < rays.length; i++) {
    const { distance, angle, hitX, hitY } = rays[i];
    if (distance <= 0.001) continue;

    const correctedDistance = distance * Math.cos(angle - player.angle);
    const mapX = Math.floor(hitX / TILE_SIZE);
    const mapY = Math.floor(hitY / TILE_SIZE);
    const cell: Cell | undefined = map[mapY]?.[mapX];
    if (!cell) continue;

    const sector = sectors[cell.sectorId];
    const wallHeight = (TILE_SIZE * 277) / correctedDistance;
    const x = i * sliceWidth;
    const wallTop = (screenHeight - wallHeight) / 2 + player.z;
    const wallBottom = wallTop + wallHeight;

    const light = sector.lightLevel;
    const baseShade = Math.max(0, 255 - correctedDistance * light);
    const wallColor = `rgb(${baseShade}, ${baseShade}, ${baseShade})`;
    const floorColor = `rgb(${baseShade * 0.5}, ${baseShade * 0.5}, ${baseShade * 0.5})`;
    const ceilColor = `rgb(${baseShade * 0.2}, ${baseShade * 0.2}, ${baseShade * 0.2})`;

    ctx.fillStyle = ceilColor;
    ctx.fillRect(x, 0, sliceWidth + 1, wallTop);

    ctx.fillStyle = wallColor;
    ctx.fillRect(x, wallTop, sliceWidth + 1, wallHeight);

    ctx.fillStyle = floorColor;
    ctx.fillRect(x, wallBottom, sliceWidth + 1, screenHeight - wallBottom);
    ctx.strokeStyle = `rgba(255,255,255,0.03)`;
    ctx.beginPath();
    ctx.moveTo(x, wallBottom);
    ctx.lineTo(x + 10, screenHeight);
    ctx.stroke();
  }

  // === SPRITES ===
  const visibleSprites = sprites
    .filter((s) => s.active)
    .map((s) => {
      const dx = s.x - player.x;
      const dy = s.y - player.y;
      const angleToSprite = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);
      let angleDiff = angleToSprite - player.angle;

      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      return { ...s, angleDiff, distance: dist };
    })
    .filter((s) => Math.abs(s.angleDiff) < Math.PI / 3)
    .sort((a, b) => b.distance - a.distance); // de lejos a cerca

  for (const sprite of visibleSprites) {
    const screenX = (0.5 + sprite.angleDiff / (Math.PI / 3)) * screenWidth;
    const size = (TILE_SIZE * 300) / sprite.distance;
    const spriteY = screenHeight / 2 - size; // <- corregido: no depende de player.z

    const texture = sprite.animationFrame !== undefined
      ? `${sprite.texture}_${sprite.animationFrame}`
      : sprite.texture;

    const img = loadSprite(texture);
    if (img && img.complete && img.naturalWidth !== 0) {
      ctx.drawImage(img, screenX - size / 2, spriteY, size, size);
    } else {
      console.warn(`⚠️ Imagen rota o no cargada: ${texture}`);
    }
  }

  // === PISTOLA HUD ===
  if (pistolImg && pistolImg.complete && pistolImg.naturalWidth !== 0) {
    const pistolWidth = 160;
    const pistolHeight = 100;
    ctx.drawImage(
      pistolImg,
      (screenWidth - pistolWidth) / 2,
      screenHeight - pistolHeight,
      pistolWidth,
      pistolHeight
    );
  }
}

import { useEffect, useRef } from 'react';
import { TILE_SIZE, map, sectors } from '@/lib/map';
import { player, jump } from '@/lib/player';
import { castRays, Ray } from '@/lib/raycast';
import { renderScene } from '@/lib/renderer';
import { setupControls, isPressed, clearControls } from '@/lib/controls';
import { sprites } from '@/lib/sprite'; // ← importante

const FOV = Math.PI / 3;
const NUM_RAYS = 320;
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const GRAVITY = 0.45;
const JUMP_STRENGTH = 8;
const DAMAGE = 100;

interface GameCanvasProps {
  onRaysUpdate?: (rays: Ray[]) => void;
}

export const GameCanvas = ({ onRaysUpdate }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 🔫 Función para manejar disparos
  const handleShoot = () => {
    const rays = castRays(player.x, player.y, player.angle, FOV, NUM_RAYS);
    const centerRay = rays[Math.floor(NUM_RAYS / 2)];

    if (!centerRay) return;

    const hitX = centerRay.hitX;
    const hitY = centerRay.hitY;

    for (const sprite of sprites) {
      if (!sprite.active || !sprite.isEnemy) continue;

      const dx = sprite.x - hitX;
      const dy = sprite.y - hitY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < TILE_SIZE / 2) {
        sprite.health = (sprite.health ?? 0) - DAMAGE;

        if (sprite.health! <= 0) {
          sprite.active = false;
          console.log(`Enemigo ${sprite.texture} eliminado`);
        } else {
          console.log(`Enemigo ${sprite.texture} herido. Salud restante: ${sprite.health}`);
        }

        break; // Solo impacta al primero
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    setupControls();

    // 🖱️ Event Listener disparo (click izquierdo o tecla)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'Enter') handleShoot();
    };
    const handleMouseDown = () => handleShoot();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    const update = () => {
      if (isPressed('a')) player.angle -= 0.04;
      if (isPressed('d')) player.angle += 0.04;

      const dirX = Math.cos(player.angle);
      const dirY = Math.sin(player.angle);

      let nextX = player.x;
      let nextY = player.y;

      if (isPressed('w')) {
        nextX += dirX * player.speed;
        nextY += dirY * player.speed;
      }
      if (isPressed('s')) {
        nextX -= dirX * player.speed;
        nextY -= dirY * player.speed;
      }

      const mapX = Math.floor(player.x / TILE_SIZE);
      const mapY = Math.floor(player.y / TILE_SIZE);
      const nextMapX = Math.floor(nextX / TILE_SIZE);
      const nextMapY = Math.floor(nextY / TILE_SIZE);

      if (!map[mapY]?.[nextMapX]?.wall) player.x = nextX;
      if (!map[nextMapY]?.[mapX]?.wall) player.y = nextY;

      const sectorId = map[mapY]?.[mapX]?.sectorId ?? 0;
      const floorHeight = sectors[sectorId]?.floorHeight ?? 0;

      if (isPressed(' ') && player.z === floorHeight) {
        jump(player, floorHeight, JUMP_STRENGTH);
      }

      player.vz -= GRAVITY;
      player.z += player.vz;

      if (player.z < floorHeight) {
        player.z = floorHeight;
        player.vz = 0;
      }
    };

    const loop = () => {
      if (!canvas || !ctx) return;

      update();

      const rays = castRays(player.x, player.y, player.angle, FOV, NUM_RAYS);

      if (onRaysUpdate) onRaysUpdate(rays);

      renderScene(ctx, rays, player, SCREEN_WIDTH, SCREEN_HEIGHT);

      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      clearControls();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onRaysUpdate]);

  return (
    <canvas
      ref={canvasRef}
      width={SCREEN_WIDTH}
      height={SCREEN_HEIGHT}
      style={{
        imageRendering: 'pixelated',
        backgroundColor: 'black',
        border: '2px solid white',
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
};

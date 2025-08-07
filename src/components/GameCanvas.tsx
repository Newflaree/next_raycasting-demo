import { useEffect, useRef, useState } from 'react';
import { TILE_SIZE, map, sectors } from '@/lib/map';
import { player, jump, startRunning, stopRunning, updateStamina } from '@/lib/player';
import { castRays, Ray } from '@/lib/raycast';
import { renderScene } from '@/lib/renderer';
import { setupControls, isPressed, clearControls } from '@/lib/controls';
import { sprites } from '@/lib/sprite';

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
  const [shotImpact, setShotImpact] = useState<{ x: number; y: number } | null>(null);

  // 🔫 Disparo central que impacta sprites y guarda impacto para render
  const handleShoot = () => {
    const rays = castRays(player.x, player.y, player.angle, FOV, NUM_RAYS);
    const centerRay = rays[Math.floor(NUM_RAYS / 2)];
    if (!centerRay) return;

    const hitX = centerRay.hitX;
    const hitY = centerRay.hitY;

    setShotImpact({ x: hitX, y: hitY });
    setTimeout(() => setShotImpact(null), 100);

    for (const sprite of sprites) {
      if (!sprite.active || !sprite.isEnemy) continue;

      const dx = sprite.x - hitX;
      const dy = sprite.y - hitY;
      const dist = Math.hypot(dx, dy);

      if (dist < TILE_SIZE / 2) {
        sprite.health = (sprite.health ?? 0) - DAMAGE;

        if (sprite.health! <= 0) {
          sprite.active = false;
          console.log(`💥 Enemigo ${sprite.texture} eliminado`);
        } else {
          console.log(`🔻 ${sprite.texture} herido. Salud: ${sprite.health}`);
        }

        break;
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'Enter') handleShoot();
    };

    const handleMouseDown = () => handleShoot();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    const update = () => {
      const shift = isPressed('shift');
      const w = isPressed('w');
      const s = isPressed('s');
      const a = isPressed('a');
      const d = isPressed('d');
      const isMoving = w || s || a || d;

      if (a) player.angle -= 0.06;
      if (d) player.angle += 0.06;

      const dirX = Math.cos(player.angle);
      const dirY = Math.sin(player.angle);

      let nextX = player.x;
      let nextY = player.y;

      if (w) {
        nextX += dirX * player.speed;
        nextY += dirY * player.speed;
      }
      if (s) {
        nextX -= dirX * player.speed;
        nextY -= dirY * player.speed;
      }

      if (shift && isMoving) startRunning(player);
      else stopRunning(player);

      updateStamina(player, shift && isMoving);

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
      onRaysUpdate?.(rays);

      renderScene(ctx, rays, player, SCREEN_WIDTH, SCREEN_HEIGHT);

      if (shotImpact) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(SCREEN_WIDTH / 2, SCREEN_HEIGHT);
        ctx.lineTo(shotImpact.x, shotImpact.y);
        ctx.stroke();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(shotImpact.x, shotImpact.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(loop);
    };

    loop();

    return () => {
      clearControls();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onRaysUpdate, shotImpact]);

  return (
    <div
      style={{
        position: 'relative',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        margin: '0 auto',
      }}
    >
      <canvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
        style={{
          imageRendering: 'pixelated',
          backgroundColor: 'black',
          border: '2px solid white',
          display: 'block',
        }}
      />

      {/* 🎯 Crosshair centrado */}
      <img
        src="/sprites/crosshair.png"
        alt="Crosshair"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '32px',
          height: '32px',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 10,
          opacity: 0.9,
        }}
      />
    </div>
  );
};

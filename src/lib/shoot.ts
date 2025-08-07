// lib/shoot.ts

import { sprites } from './sprite';
import { Ray } from './raycast';

/**
 * Verifica si un enemigo ha sido impactado por el rayo central.
 * Si la distancia entre el rayo y el sprite enemigo es corta, lo elimina.
 */
export function handleShoot(rays: Ray[]) {
  const centerRay = rays[Math.floor(rays.length / 2)];

  for (const sprite of sprites) {
    if (!sprite.active || !sprite.isEnemy) continue;

    const dx = sprite.x - centerRay.hitX;
    const dy = sprite.y - centerRay.hitY;
    const distance = Math.hypot(dx, dy);

    if (distance < 30) {
      sprite.active = false;
      console.log(`💥 Enemigo eliminado en (${sprite.x}, ${sprite.y})`);
      break; // Solo uno por disparo
    }
  }
}

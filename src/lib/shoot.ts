// lib/shoot.ts

import { sprites } from './sprite';
import { Ray } from './raycast';

export interface ShotImpact {
  x: number;              // Coordenada X del impacto (para partículas, luces, etc.)
  y: number;              // Coordenada Y del impacto
  hit: boolean;           // ¿Impactó un enemigo?
  damageDealt?: number;   // Daño causado, si corresponde
}

/**
 * Maneja el disparo utilizando el rayo central de la cámara.
 * - Si un enemigo está suficientemente cerca del impacto del rayo, recibe daño o se desactiva.
 * - Devuelve información del impacto para mostrar efectos visuales.
 */
export function handleShoot(rays: Ray[]): ShotImpact {
  const centerRay = rays[Math.floor(rays.length / 2)];

  const impact: ShotImpact = {
    x: centerRay.hitX,
    y: centerRay.hitY,
    hit: false,
    damageDealt: 0,
  };

  const hitRadius = 30; // Distancia de tolerancia para considerar impacto en el enemigo
  const baseDamage = 25;

  for (const sprite of sprites) {
    if (!sprite.active || !sprite.isEnemy) continue;

    const dx = sprite.x - impact.x;
    const dy = sprite.y - impact.y;
    const distance = Math.hypot(dx, dy);

    if (distance < hitRadius) {
      // Aplica daño si tiene salud
      if (typeof sprite.health === 'number') {
        sprite.health -= baseDamage;
        impact.damageDealt = baseDamage;

        if (sprite.health <= 0) {
          sprite.active = false;
          console.log(`💥 Enemigo eliminado en (${sprite.x}, ${sprite.y})`);
        } else {
          console.log(`🎯 Daño: ${baseDamage}. Salud restante: ${sprite.health}`);
        }
      } else {
        // Si no tiene sistema de salud, simplemente lo elimina
        sprite.active = false;
        console.log(`💥 Enemigo eliminado sin health en (${sprite.x}, ${sprite.y})`);
      }

      impact.hit = true;
      break; // Solo puede golpear a un enemigo por disparo
    }
  }

  return impact;
}

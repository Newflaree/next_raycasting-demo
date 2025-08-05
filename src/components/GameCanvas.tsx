import { useEffect, useRef } from 'react';
import { TILE_SIZE } from '@/lib/map';
import { player } from '@/lib/player';
import { isWall, castRays } from '@/lib/raycast';


const FOV            = Math.PI / 3;
const NUM_RAYS       = 300;
const SCREEN_WIDTH   = 800;
const SCREEN_HEIGHT  = 600;
const GRAVITY        = 0.45;
const JUMP_STRENGTH  = 9;

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>( null );

  useEffect(() => {
    const canvas = canvasRef.current;
    if ( !canvas ) return;

    const ctx = canvas.getContext( '2d' );
    if ( !ctx ) return;

    /* -------------------- INPUT -------------------- */
    const keys: Record<string, boolean> = {};

    const handleKeyDown = ( e: KeyboardEvent ) => {
      keys[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = ( e: KeyboardEvent ) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener( 'keydown', handleKeyDown );
    window.addEventListener( 'keyup', handleKeyUp );

    /* ------------------- UPDATE -------------------- */
    const update = () => {
      // rotación
      if ( keys['a'] ) player.angle -= 0.04;
      if ( keys['d'] ) player.angle += 0.04;

      // desplazamiento
      const dirX = Math.cos( player.angle );
      const dirY = Math.sin( player.angle );

      let nextX = player.x;
      let nextY = player.y;

      if ( keys['w'] ) {
        nextX += dirX * player.speed;
        nextY += dirY * player.speed;
      }
      if ( keys['s'] ) {
        nextX -= dirX * player.speed;
        nextY -= dirY * player.speed;
      }

      // colisiones eje-a-eje
      if ( !isWall( nextX, player.y ) ) player.x = nextX;
      if ( !isWall( player.x, nextY ) ) player.y = nextY;

      // salto
      if ( keys[' '] && player.z === 0 ) {
        player.vz = JUMP_STRENGTH;
      }

      // física vertical
      player.vz -= GRAVITY;
      player.z  += player.vz;

      if ( player.z < 0 ) {
        player.z = 0;
        player.vz = 0;
      }
    };

    /* ------------------ RENDER --------------------- */
    const render3D = () => {
      const rays = castRays( player.x, player.y, player.angle, FOV, NUM_RAYS );
      const sliceWidth = SCREEN_WIDTH / NUM_RAYS;

      for ( let i = 0; i < rays.length; i++ ) {
        const { distance } = rays[i];
        const wallHeight = ( TILE_SIZE * 277 ) / distance;

        const x = i * sliceWidth;
        const y = ( SCREEN_HEIGHT - wallHeight ) / 2 + player.z;

        const shade = Math.max( 0, 255 - distance );
        ctx.fillStyle = `rgb(${ shade }, ${ shade }, ${ shade })`;
        ctx.fillRect( x, y, sliceWidth + 1, wallHeight );
      }
    };

    /* ------------------- LOOP ---------------------- */
    const loop = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );

      update();
      render3D();

      requestAnimationFrame( loop );
    };

    loop();

    /* ----------------- CLEAN-UP -------------------- */
    return () => {
      window.removeEventListener( 'keydown', handleKeyDown );
      window.removeEventListener( 'keyup',  handleKeyUp );
    };
  }, []);

  return (
    <canvas
      ref={ canvasRef }
      width={ SCREEN_WIDTH }
      height={ SCREEN_HEIGHT }
      style={{
        border: '2px solid white',
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
};


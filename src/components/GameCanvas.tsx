import {
  useEffect,
  useRef
} from 'react';
import { TILE_SIZE } from '@/lib/map';
import { player } from '@/lib/player';
import { castRays } from '@/lib/raycast';


const FOV = Math.PI / 3;
const NUM_RAYS = 300;
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>( null );

  useEffect(() => {
    const canvas = canvasRef.current;
    if ( !canvas ) return;
    const ctx = canvas.getContext( '2d' );
    if ( !ctx ) return;

    const keys: Record<string, boolean> = {};

    const update = () => {
      if ( keys['w'] ) {
        player.x += Math.cos( player.angle ) * player.speed;
        player.y += Math.sin( player.angle ) * player.speed;
      }
      if ( keys['s'] ) {
        player.x -= Math.cos( player.angle ) * player.speed;
        player.y -= Math.sin( player.angle ) * player.speed;
      }
      if ( keys['a'] ) {
        player.angle -= 0.04;
      }
      if ( keys['d'] ) {
        player.angle += 0.04;
      }
    };

    const render3D = () => {
      const rays = castRays( player.x, player.y, player.angle, FOV, NUM_RAYS );

      const sliceWidth = SCREEN_WIDTH / NUM_RAYS;

      for ( let i = 0; i < rays.length; i++ ) {
        const { distance } = rays[i];
        const wallHeight = ( TILE_SIZE * 277 ) / distance;

        const x = i * sliceWidth;
        const y = ( SCREEN_HEIGHT - wallHeight ) / 2;

        const shade = Math.max( 0, 255 - distance );
        ctx.fillStyle = `rgb(${ shade }, ${ shade }, ${ shade })`;
        ctx.fillRect( x, y, sliceWidth + 1, wallHeight );
      }
    };

    const loop = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );

      update();
      render3D();
      requestAnimationFrame( loop );
    };

    window.addEventListener( 'keydown', ( e ) => ( keys[e.key] = true ) );
    window.addEventListener( 'keyup', ( e ) => ( keys[e.key] = false ) );
    loop();

    return () => {
      window.removeEventListener( 'keydown', () => {} );
      window.removeEventListener( 'keyup', () => {} );
    };
  }, []);

  return <canvas
    ref={ canvasRef }
    width={ SCREEN_WIDTH }
    height={ SCREEN_HEIGHT }
    style={{
      border: '2px solid white',
      display: 'block',
      margin: '0 auto'
    }}
  />
}

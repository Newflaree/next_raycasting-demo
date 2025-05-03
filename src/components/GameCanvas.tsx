import {
  useEffect,
  useRef
} from 'react';


export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>( null );

  useEffect( () => {
    const canvas = canvasRef.current;
    if ( !canvas ) return;

    const ctx = canvas.getContext( '2d' );
    if ( !ctx ) return;

    const width = canvas.width;
    const height = canvas.height;

    // Prueba: rellenar fondo
    ctx.fillStyle = 'black';
    ctx.fillRect( 0, 0, width, height );

    ctx.fillStyle = 'green';
    ctx.font = '20px monospace';
    ctx.fillText( 'DOOM MVP 2D', 50, 50 );
  }, [] );

  return <canvas
    ref={ canvasRef }
    width={ 800 }
    height={ 600 }
    style={{
      border: '1px solid white',
      display: 'block',
      margin: '0 auto'
    }}
  />
}

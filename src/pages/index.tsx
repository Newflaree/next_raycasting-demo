import Head from 'next/head';
import { GameCanvas } from '@/components/GameCanvas';
import { Ray } from '@/lib/raycast'; // ✅ ESTE IMPORT ES NECESARIO

const HomePage = () => {
  const handleRaysUpdate = (rays: Ray[]) => {
    console.log('Cantidad de rayos:', rays.length);
    // Aquí puedes detectar colisiones o disparos
  };

  return (
    <>
      <Head>
        <title>DOOM 2D</title>
      </Head>

      <main>
        <h1 style={{ textAlign: 'center' }}>Primer Render</h1>
        <GameCanvas onRaysUpdate={handleRaysUpdate} />
      </main>
    </>
  );
};

export default HomePage;

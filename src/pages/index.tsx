import Head from 'next/head';
import { GameCanvas } from '@/components/GameCanvas';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>DOOM 2D</title>
      </Head>

      <main>
        <h1
          style={{
            textAlign: 'center'
          }}
        >
          Primer MVP
        </h1>

        <GameCanvas />
      </main>
    </>
  );
}

export default HomePage;


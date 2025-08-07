import { useEffect, useState } from 'react';
import Head from 'next/head';
import { GameCanvas } from '@/components/GameCanvas';
import { Ray } from '@/lib/raycast';
import { player } from '@/lib/player';

const HomePage = () => {
  // Estado local del HUD (sin acoplarse al objeto player directamente)
  const [health, setHealth] = useState(player.health);
  const [armor, setArmor] = useState(player.armor);
  const [stamina, setStamina] = useState(player.stamina);

  // Simulación de actualización del HUD en tiempo real (como si fuera game loop)
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(player.health);
      setArmor(player.armor);
      setStamina(player.stamina);
    }, 100); // actualiza cada 100ms

    return () => clearInterval(interval);
  }, []);

  // Callback cuando se actualizan los rayos del raycasting
  const handleRaysUpdate = (rays: Ray[]) => {
    console.log('Cantidad de rayos:', rays.length);
    // Aquí podrías detectar colisiones u otros eventos
  };

  return (
    <>
      <Head>
        <title>DOOM 2D</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Demo estilo DOOM 2D con raycasting" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>DOOM 2D - Primer Render</h1>

        {/* Canvas del juego */}
        <GameCanvas onRaysUpdate={handleRaysUpdate} />

        {/* HUD */}
        <div style={styles.hudContainer}>
          <HUDBar label="Vida" value={health} color="#e74c3c" />
          <HUDBar label="Armadura" value={armor} color="#3498db" />
          <HUDBar label="Estamina" value={stamina} color="#2ecc71" />
        </div>
      </main>
    </>
  );
};

// ===========================
// Componente para una barra HUD
// ===========================
type HUDBarProps = {
  label: string;
  value: number;
  color: string;
};

const HUDBar = ({ label, value, color }: HUDBarProps) => (
  <div style={styles.barWrapper}>
    <div style={{ ...styles.fillBar, width: `${value}%`, backgroundColor: color }} />
    <span style={styles.label}>{label}: {Math.floor(value)}</span>
  </div>
);

// ===========================
// Estilos inline
// ===========================
const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#111',
    color: '#fff',
    fontFamily: "'Press Start 2P', monospace",
    padding: '20px',
    gap: '20px'
  },
  title: {
    textAlign: 'center' as const,
    fontSize: '20px',
    color: '#f00',
    marginBottom: '10px'
  },
  hudContainer: {
    width: '80%',
    maxWidth: '500px',
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  barWrapper: {
    width: '100%',
    height: '24px',
    backgroundColor: '#333',
    border: '1px solid #555',
    position: 'relative' as const,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    transition: 'width 0.2s',
    zIndex: 1,
  },
  label: {
    position: 'absolute' as const,
    left: '8px',
    top: '4px',
    fontSize: '12px',
    color: 'white',
    zIndex: 2,
  }
};

export default HomePage;

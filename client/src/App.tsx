import { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { connectToServer, joinGame } from './utils/network';
import GameScene from './components/GameScene';
import HUD from './components/HUD';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const joined = useGameStore(s => s.joined);
  const health = useGameStore(s => s.health);

  useEffect(() => {
    connectToServer();
  }, []);

  if (health <= 0) {
    return (
      <div style={{
        width: '100vw', height: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#1a0000', color: '#ff3333', fontFamily: 'Courier New'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>YOU DIED</h1>
        <p style={{ fontSize: '1.2rem', color: '#cc0000' }}>
          "The store is now closed. Please exit the building."
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '2rem', padding: '1rem 2rem', fontSize: '1rem',
            background: '#333', color: '#fff', border: '1px solid #666',
            cursor: 'pointer', fontFamily: 'Courier New'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!joined) {
    return <LoginScreen onJoin={joinGame} />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GameScene />
      <HUD />
    </div>
  );
}

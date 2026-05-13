import { useGameStore } from '../store/gameStore';

export default function Lighting() {
  const gameState = useGameStore(s => s.gameState);
  const intensity = gameState.isNight ? 0.05 : 0.8;
  const ambientIntensity = gameState.isNight ? 0.02 : 0.4;

  return (
    <>
      <ambientLight intensity={ambientIntensity} color={gameState.isNight ? '#1a1a3a' : '#fff5e6'} />
      <directionalLight
        position={[50, 30, 50]}
        intensity={intensity}
        color={gameState.isNight ? '#2222aa' : '#ffffff'}
        castShadow={false}
      />
      {!gameState.isNight && (
        <>
          <pointLight position={[0, 8, 0]} intensity={0.5} distance={30} color="#fff5e0" />
          <pointLight position={[30, 8, 30]} intensity={0.3} distance={25} color="#fff5e0" />
          <pointLight position={[-30, 8, -30]} intensity={0.3} distance={25} color="#fff5e0" />
        </>
      )}
      {gameState.isNight && (
        <>
          <pointLight position={[0, 8, 0]} intensity={0.08} distance={15} color="#ff3300" />
          <pointLight position={[20, 8, 20]} intensity={0.05} distance={10} color="#330000" />
        </>
      )}
    </>
  );
}

import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Chip } from '@mui/material';
import { Worker, Building, Farm, Forest, Mine, Mountain, House, TownHall } from '../objects';
import useSandboxStore from '../stores/useSandboxStore';
import HUD from '../components/HUD';
import BuildMenu from '../components/BuildMenu';
import BuildPlacement from '../components/BuildPlacement';
import WorkerPanel from '../components/WorkerPanel';
import GameLoopUpdater from '../components/GameLoopUpdater';
import { startGameLoop } from '../systems/TickSystem';

type PlayerMode = 'god' | 'character';

export default function SandboxPage() {
  const { objects, reset } = useSandboxStore();
  const [mode, setMode] = useState<PlayerMode>('god');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'r') reset();
      if (key === 'f') setMode((m) => (m === 'god' ? 'character' : 'god'));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reset]);

  useEffect(() => {
    startGameLoop();
  }, []);

  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      <HUD />
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <Chip label={`Mode: ${mode === 'god' ? 'God' : 'Character (WIP)'}`} color={mode === 'god' ? 'primary' : 'default'} />
      </Box>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }} style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

          {objects.map((obj) => {
            const { id, type, ...rest } = obj as any;
            switch (type) {
              case 'worker':
                return <Worker key={id} id={id} />;
              case 'building':
                return <Building key={id} {...rest} />;
              case 'house':
                return <House key={id} id={id} {...rest} />;
              case 'townhall':
                return <TownHall key={id} id={id} {...rest} />;
              case 'farm':
                return <Farm key={id} id={id} {...rest} />;
              case 'forest':
                return <Forest key={id} id={id} {...rest} />;
              case 'mine':
                return <Mine key={id} id={id} {...rest} />;
              case 'mountain':
                return <Mountain key={id} {...rest} />;
              default:
                return null;
            }
          })}

          {mode === 'god' && <OrbitControls makeDefault />}
          <GameLoopUpdater />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[64, 64]} />
            <meshStandardMaterial color="#8f8f8f" />
          </mesh>
          <BuildPlacement />
        </Suspense>
      </Canvas>
      <BuildMenu />
      <WorkerPanel />
    </Box>
  );
}

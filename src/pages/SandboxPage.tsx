import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats, Sky, useTexture } from '@react-three/drei';
import { RepeatWrapping } from 'three';
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
  const groundDiffuse = '/textures/ground_diffuse.jpg';
  const GROUND_Y = 0;

  function Ground() {
    const groundMap = useTexture(groundDiffuse) as any;
    useEffect(() => {
      if (!groundMap) return;
      groundMap.wrapS = RepeatWrapping;
      groundMap.wrapT = RepeatWrapping;
      groundMap.repeat.set(16, 16);
      groundMap.needsUpdate = true;
    }, [groundMap]);
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]} receiveShadow>
        <planeGeometry args={[64, 64]} />
        <meshStandardMaterial map={groundMap} color="#ffffff" />
      </mesh>
    );
  }

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
      <Canvas
        shadows
        dpr={[1, 1]}
        gl={{ powerPreference: 'high-performance' }}
        camera={{ position: [8, 8, 8], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
          <Sky sunPosition={[50, 20, 100]} turbidity={6} rayleigh={2} mieCoefficient={0.005} mieDirectionalG={0.7} />

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

          {mode === 'god' && <OrbitControls makeDefault enableDamping dampingFactor={0.08} />}
          <Stats />
          <GameLoopUpdater />
          {/* Ground with texture tiling */}
          <Ground />
          {/* Map border walls */}
          <group>
            <mesh position={[0, GROUND_Y + 0.5, 32]} castShadow>
              <boxGeometry args={[64, 1, 0.5]} />
              <meshStandardMaterial color="#445533" />
            </mesh>
            <mesh position={[0, GROUND_Y + 0.5, -32]} castShadow>
              <boxGeometry args={[64, 1, 0.5]} />
              <meshStandardMaterial color="#445533" />
            </mesh>
            <mesh position={[32, GROUND_Y + 0.5, 0]} castShadow>
              <boxGeometry args={[0.5, 1, 64]} />
              <meshStandardMaterial color="#445533" />
            </mesh>
            <mesh position={[-32, GROUND_Y + 0.5, 0]} castShadow>
              <boxGeometry args={[0.5, 1, 64]} />
              <meshStandardMaterial color="#445533" />
            </mesh>
          </group>
          <BuildPlacement />
        </Suspense>
      </Canvas>
      <BuildMenu />
      <WorkerPanel />
    </Box>
  );
}

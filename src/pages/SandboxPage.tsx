import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Worker, Building, Farm, Forest } from '../objects/index';
import useSandboxStore from '../stores/useSandboxStore';
import { Box, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function SandboxPage() {
  const { objects, reset } = useSandboxStore();

  useEffect(() => {
    console.log('Event listener for R key attached.');
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key);
      if (event.key === 'R' || event.key === 'r') {
        console.log('R key detected. Calling reset()...');
        reset();
        console.log('Scene reset.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      console.log('Event listener for R key removed.');
    };
  }, [reset]);

  return (
    <div style={{ maxWidth: '1600px', maxHeight: '900px', width: '100%', height: '100%', margin: 'auto', border: '2px solid #FF69B4', position: 'relative' }}>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }} style={{ width: '100%', height: '100%', aspectRatio: '16 / 9', objectFit: 'contain' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        {/* Dynamicky generované placeholdery */}
        {objects.map((obj) => {
          switch (obj.type) {
            case 'worker':
              return <Worker key={obj.id} id={obj.id} />;
            case 'building':
              return <Building key={obj.id} {...obj} />;
            case 'farm':
              return <Farm key={obj.id} {...obj} />;
            case 'forest':
              return <Forest key={obj.id} {...obj} />;
            default:
              return null;
          }
        })}

        <OrbitControls makeDefault />
        <Stats />
      </Canvas>

      {/* UI Overlay */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        p: 2,
        borderRadius: 2,
        maxHeight: '30%',
        overflowY: 'auto'
      }}>
        <Typography variant="h6" gutterBottom>Objects</Typography>
        {objects.map((obj) => (
          <Typography key={obj.id} variant="body2">
            ID: {obj.id}, Type: {obj.type}, Pos: [{obj.position.map(p => p.toFixed(2)).join(', ')}]
          </Typography>
        ))}
      </Box>
    </div>
  );
}
// src/components/canvas/CanvasContainer.tsx
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Scene from './Scene';
import { Suspense, useEffect, useState } from 'react';

const CanvasContainer = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 2]} // Responsive pixel ratio
        gl={{ 
          antialias: true,
          alpha: true, // Transparent background
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200
        }}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CanvasContainer;
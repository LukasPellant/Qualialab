// src/app/page.tsx
'use client'

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import FullScreenFix from '../components/FullScreenFix';

// Dynamically import components
const CanvasContainer = dynamic(
  () => import('../components/canvas/CanvasContainer'),
  { ssr: false }
);

const ControlSliders = dynamic(
  () => import('../components/ui/ControlSliders'),
  { ssr: false }
);

// Simple loading component
const LoadingScreen = () => (
  <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
    <div className="text-xl">Loading 3D Experience...</div>
  </div>
);

export default function Home() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Add keyboard shortcut to toggle controls (press 'c')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' || e.key === 'C') {
        setShowControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Initial configuration values
  const initialConfig = {
    panelCount: 8,
    radius: 25,
    viewDistance: 8
  };

  return (
    <main style={{ 
      width: '100vw', 
      height: '100vh', 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden', 
      background: '#0f172a',
      position: 'relative'
    }}>
      <FullScreenFix />
      <Suspense fallback={<LoadingScreen />}>
        <CanvasContainer />
      </Suspense>
      
      {/* Controls - only shown when toggled */}
      {showControls && (
        <ControlSliders 
          initialPanelCount={initialConfig.panelCount}
          initialRadius={initialConfig.radius}
          initialViewDistance={initialConfig.viewDistance}
          panelCountRange={[3, 12]}
          radiusRange={[15, 40]}
          viewDistanceRange={[5, 20]}
        />
      )}
      
      {/* Toggle controls button - small and discreet in the corner */}
      <button
        onClick={() => setShowControls(prev => !prev)}
        className="fixed bottom-4 right-4 bg-slate-800/50 hover:bg-slate-700/80 text-white text-xs p-2 rounded-full z-50"
        style={{ zIndex: 1000 }}
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>
      
      {/* Optional helper text for mobile */}
      {isMobileDevice && (
        <div className="fixed top-4 left-0 right-0 mx-auto z-10 text-center text-white text-sm bg-slate-800/70 py-2 px-4 rounded-full max-w-xs">
          Swipe horizontally to navigate between panels
        </div>
      )}
    </main>
  );
}
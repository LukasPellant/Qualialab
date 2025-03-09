// src/app/page.tsx
'use client'

import dynamic from 'next/dynamic';
import { Suspense, useEffect } from 'react';
import FullScreenFix from '../components/FullScreenFix';

// Dynamically import the canvas container with no SSR
const CanvasContainer = dynamic(
  () => import('../components/canvas/CanvasContainer'),
  { ssr: false }
);

// Simple loading component
const LoadingScreen = () => (
  <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
    <div className="text-xl">Loading 3D Experience...</div>
  </div>
);

export default function Home() {
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
    </main>
  );
}
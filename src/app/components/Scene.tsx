"use client";

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Button from './Button';
import * as THREE from 'three'; // Import Three.js

const Scene = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <Canvas
      style={{ width: '100%', height: '100vh' }}
      gl={{ alpha: false }} // Důležité pro změnu barvy pozadí
      camera={{ position: [0, 0, 5] }} // Optional: Set camera position
    >
      <color attach="background" args={['#555555']} /> {/* Středně tmavá šedá */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} intensity={1} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Button text="Projects" onClick={handleClick} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
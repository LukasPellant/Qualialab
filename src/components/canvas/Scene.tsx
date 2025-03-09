// src/components/canvas/Scene.tsx
import { useRef, useState } from 'react';
import { Group } from 'three';
import { Environment } from '@react-three/drei';
// Import the new block components
import BlockCameraController from './CubeCameraController';
import BlockEnvironment from './CubeEnvironment';
import NavigationContent from '../ui/NavigationContent';
import ProjectsContent from '../ui/ProjectsContent';

interface SceneProps {
  isMobile: boolean;
}

const Scene = ({ isMobile }: SceneProps) => {
  const groupRef = useRef<Group>(null);
  
  // Calculate dimensions based on 16:9 aspect ratio
  const WIDTH = 16;
  const HEIGHT = 9;
  const DEPTH = 9;
  const sizeFactor = 1.5;
  
  return (
    <>
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 2, 5]} intensity={1.8} castShadow />
      <pointLight position={[-2, 0, 3]} intensity={1} color="#4fc3f7" />
      <pointLight position={[2, 0, 3]} intensity={1} color="#ff9e80" />
      <Environment preset="city" />
      
      {/* Use the new block camera controller */}
      <BlockCameraController />
      
      {/* Main content container */}
      <group ref={groupRef}>
        {/* Block environment with all faces */}
        <BlockEnvironment>
          {/* Face-specific content positioned based on the block dimensions */}
          <NavigationContent 
            faceId="front"
            position={[0, 0, -DEPTH * sizeFactor]} 
            rotation={[0, 0, 0]}
          />
          
          <ProjectsContent
            position={[WIDTH * sizeFactor, 0, 0]}
            rotation={[0, -Math.PI/2, 0]}
          />
          
          {/* The other faces would have their specific content components */}
        </BlockEnvironment>
      </group>
    </>
  );
};

export default Scene;
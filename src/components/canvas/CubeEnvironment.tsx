// src/components/canvas/BlockEnvironment.tsx
import { useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Group, DoubleSide } from 'three';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface BlockFaceProps {
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number]; // width, height
  color: string;
  name: string;
  isActive?: boolean;
  faceId: string;
}

// Individual face component with 16:9 aspect ratio for horizontal faces
const BlockFace = ({ position, rotation, dimensions, color, name, isActive = false, faceId }: BlockFaceProps) => {
  const [lastHorizontalFace, setLastHorizontalFace] = useState('front');
  
  // Determine if this is a top or bottom face
  const isTop = faceId === 'top';
  const isBottom = faceId === 'bottom';
  
  // Check for the last horizontal face from the camera controller
  useEffect(() => {
    const checkLastFace = () => {
      if (window && 'lastHorizontalFace' in window) {
        // @ts-ignore
        const lastFace = window.lastHorizontalFace;
        if (lastFace && lastFace !== lastHorizontalFace) {
          setLastHorizontalFace(lastFace);
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkLastFace, 200);
    return () => clearInterval(interval);
  }, [lastHorizontalFace]);
  
  // Calculate rotation adjustment for top/bottom faces based on last horizontal face
  const getTopBottomRotation = () => {
    if (!isTop && !isBottom) return [0, 0, 0];
    
    // Bottom face rotations
    if (isBottom) {
      switch (lastHorizontalFace) {
        case 'front':
          return [Math.PI, 0, 0];
        case 'right':
          return [Math.PI, 0, -Math.PI/2];
        case 'back':
          return [Math.PI, 0, Math.PI];
        case 'left':
          return [Math.PI, 0, Math.PI/2];
        default:
          return [Math.PI, 0, 0];
      }
    }
    
    // Top face rotations
    if (isTop) {
      switch (lastHorizontalFace) {
        case 'front':
          return [0, Math.PI, Math.PI];
        case 'right':
          return [Math.PI, 0, Math.PI/2];
        case 'back':
          return [0, Math.PI, 0];
        case 'left':
          return [Math.PI, 0, -Math.PI/2];
        default:
          return [0, Math.PI, Math.PI];
      }
    }
    
    // Fallback
    return [0, 0, 0];
  };
  
  return (
    <group position={position} rotation={rotation}>
      {/* Face background */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={dimensions} />
        <meshStandardMaterial 
          color={color} 
          opacity={isActive ? 0.9 : 0.7}
          transparent={true}
          side={DoubleSide}
        />
      </mesh>
      
      {/* Face outline */}
      <lineSegments position={[0, 0, 0.15]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(...dimensions)]} />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
      
      {/* Text and content - special handling for top and bottom faces */}
      {isTop || isBottom ? (
        // Top/Bottom face with dynamic orientation
        <group 
          rotation={getTopBottomRotation()} 
          position={[0, 0, -0.2]}
        >
          <Text
            position={[0, dimensions[1]/3, 0]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/roboto.woff"
          >
            {name}
          </Text>
          
          {/* Content container */}
          <group position={[0, 0, 0]}>
            {/* Content would go here */}
          </group>
        </group>
      ) : (
        // Regular faces (front, right, back, left)
        <group position={[0, 0, 0.2]}>
          <Text
            position={[0, dimensions[1]/3, 0]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            font="/fonts/roboto.woff"
          >
            {name}
          </Text>
          
          {/* Content container for regular faces */}
          <group position={[0, 0, 0]}>
            {/* Content would go here */}
          </group>
        </group>
      )}
    </group>
  );
};

interface BlockEnvironmentProps {
  children?: React.ReactNode;
}

const BlockEnvironment = ({ children }: BlockEnvironmentProps) => {
  const groupRef = useRef<Group>(null);
  const [activeFace, setActiveFace] = useState<string>('front');
  const { viewport } = useThree();
  
  // Calculate dimensions based on 16:9 aspect ratio
  const WIDTH = 16;
  const HEIGHT = 9;
  const DEPTH = 9; // Using the height as depth
  
  // Calculate a size multiplier to keep consistent scale
  const sizeFactor = 1.5;
  
  // Sync with the camera controller's active face
  useEffect(() => {
    const checkActiveFace = () => {
      if (window && 'currentFace' in window) {
        // @ts-ignore
        const currentFace = window.currentFace;
        if (currentFace !== activeFace) {
          setActiveFace(currentFace);
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkActiveFace, 200);
    
    return () => clearInterval(interval);
  }, [activeFace]);
  
  // The block faces with 16:9 aspect ratio for horizontal faces
  const faceData = [
    { 
      id: 'front', 
      position: [0, 0, -DEPTH * sizeFactor], 
      rotation: [0, 0, 0], 
      dimensions: [WIDTH * sizeFactor, HEIGHT * sizeFactor], 
      color: '#1e40af', 
      name: 'Home' 
    },
    { 
      id: 'right', 
      position: [WIDTH * sizeFactor, 0, 0], 
      rotation: [0, -Math.PI/2, 0], 
      dimensions: [DEPTH * sizeFactor, HEIGHT * sizeFactor], 
      color: '#0f766e', 
      name: 'Projects' 
    },
    { 
      id: 'back', 
      position: [0, 0, DEPTH * sizeFactor], 
      rotation: [0, Math.PI, 0], 
      dimensions: [WIDTH * sizeFactor, HEIGHT * sizeFactor], 
      color: '#7c2d12', 
      name: 'Blog' 
    },
    { 
      id: 'left', 
      position: [-WIDTH * sizeFactor, 0, 0], 
      rotation: [0, Math.PI/2, 0], 
      dimensions: [DEPTH * sizeFactor, HEIGHT * sizeFactor], 
      color: '#4c1d95', 
      name: 'About' 
    },
    { 
      id: 'top', 
      position: [0, HEIGHT * sizeFactor, 0], 
      rotation: [-Math.PI/2, 0, 0], 
      dimensions: [WIDTH * sizeFactor, DEPTH * sizeFactor], 
      color: '#065f46', 
      name: 'Contact' 
    },
    { 
      id: 'bottom', 
      position: [0, -HEIGHT * sizeFactor, 0], 
      rotation: [Math.PI/2, 0, 0], 
      dimensions: [WIDTH * sizeFactor, DEPTH * sizeFactor], 
      color: '#1e3a8a', 
      name: 'Settings' 
    },
  ];
  
  return (
    <group ref={groupRef}>
      {/* Render all block faces */}
      {faceData.map((face) => (
        <BlockFace
          key={face.id}
          position={face.position}
          rotation={face.rotation}
          dimensions={face.dimensions}
          color={face.color}
          name={face.name}
          isActive={face.id === activeFace}
          faceId={face.id}
        />
      ))}
      
      {/* Add any additional content */}
      {children}
      
      {/* Center reference point (invisible helper) */}
      <mesh visible={false} position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
    </group>
  );
};

export default BlockEnvironment;
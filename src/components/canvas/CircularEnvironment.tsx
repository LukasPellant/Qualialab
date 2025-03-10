// src/components/canvas/CircularEnvironment.tsx
import { useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Group, DoubleSide } from 'three';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PanelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number]; // width, height
  color: string;
  name: string;
  isActive?: boolean;
  panelId: string;
  index: number;
}

// Individual panel component for the circular arrangement
const Panel = ({ position, rotation, dimensions, color, name, isActive = false, panelId, index }: PanelProps) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Panel background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={dimensions} />
        <meshStandardMaterial 
          color={color} 
          opacity={isActive ? 0.9 : 0.7}
          transparent={true}
          side={DoubleSide}
        />
      </mesh>
      
      {/* Panel outline */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(...dimensions)]} />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
      
      {/* Panel title (debug) */}
      <Text
        position={[0, dimensions[1]/3, 0.1]}
        fontSize={0.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
      >
        {name}
      </Text>
    </group>
  );
};

interface CircularEnvironmentProps {
  children?: React.ReactNode;
  panelCount?: number;
  radius?: number;
}

const CircularEnvironment = ({ children, panelCount = 5, radius = 15 }: CircularEnvironmentProps) => {
  const groupRef = useRef<Group>(null);
  const [activePanel, setActivePanel] = useState<number>(0);
  
  // Define panel dimensions with 16:9 aspect ratio
  const PANEL_WIDTH = 16;
  const PANEL_HEIGHT = 9;
  const sizeFactor = 1.2; // Slightly smaller than before to fit more panels
  
  // Sync with the camera controller's active panel
  useEffect(() => {
    const checkActivePanel = () => {
      if (window && 'currentPanelIndex' in window) {
        // @ts-ignore
        const currentIndex = window.currentPanelIndex;
        if (currentIndex !== activePanel && currentIndex >= 0 && currentIndex < panelCount) {
          setActivePanel(currentIndex);
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkActivePanel, 200);
    
    return () => clearInterval(interval);
  }, [activePanel, panelCount]);
  
  // Define panel data
  const panelData = [
    { id: 'home', name: 'Home', color: '#1e40af' },
    { id: 'projects', name: 'Projects', color: '#0f766e' },
    { id: 'blog', name: 'Blog', color: '#7c2d12' },
    { id: 'about', name: 'About', color: '#4c1d95' },
    { id: 'contact', name: 'Contact', color: '#065f46' }
  ].slice(0, panelCount);
  
  // Calculate positions and rotations for each panel
  const panels = panelData.map((panel, index) => {
    // Position panels in a circle
    // Using negative angles for clockwise positioning
    const angle = (-index / panelCount) * Math.PI * 2;
    
    // Position each panel along the circle
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    
    // Rotate each panel to face the center (inward facing)
    const rotationY = angle + Math.PI; // Panel faces inward
    
    return {
      ...panel,
      position: [x, 0, z] as [number, number, number],
      rotation: [0, rotationY, 0] as [number, number, number],
      dimensions: [PANEL_WIDTH * sizeFactor, PANEL_HEIGHT * sizeFactor] as [number, number],
      isActive: index === activePanel,
      index
    };
  });
  
  return (
    <group ref={groupRef}>
      {/* Render all panels in circular arrangement */}
      {panels.map((panel) => (
        <Panel
          key={panel.id}
          position={panel.position}
          rotation={panel.rotation}
          dimensions={panel.dimensions}
          color={panel.color}
          name={panel.name}
          isActive={panel.isActive}
          panelId={panel.id}
          index={panel.index}
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

export default CircularEnvironment;
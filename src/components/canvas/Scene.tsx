// src/components/canvas/Scene.tsx
import { useRef, useState, useEffect } from 'react';
import { Group } from 'three';
import { Environment } from '@react-three/drei';
import CircularCameraController from './CircularCameraController';
import CircularEnvironment from './CircularEnvironment';
import PanelContent from '../ui/PanelContent';

interface SceneProps {
  isMobile: boolean;
}

const Scene = ({ isMobile }: SceneProps) => {
  const groupRef = useRef<Group>(null);
  
  // Set up state for dynamic configuration
  const [sceneConfig, setSceneConfig] = useState({
    panelCount: 8,
    radius: 25,
    viewDistance: 8,
  });
  
  // Camera FOV settings
  const normalFOV = 40; // Normal field of view when viewing a panel
  const wideFOV = 110; // Wider field of view when rotating between panels
  
  // Panel dimensions
  const PANEL_WIDTH = 16;
  const PANEL_HEIGHT = 9;
  const sizeFactor = 1.2;
  
  // Listen for configuration updates from the UI sliders
  useEffect(() => {
    const handleConfigUpdate = (event: CustomEvent) => {
      const { panelCount, radius, viewDistance } = event.detail;
      setSceneConfig({
        panelCount: parseInt(panelCount) || 8,
        radius: parseInt(radius) || 25,
        viewDistance: parseFloat(viewDistance) || 8
      });
    };
    
    // Check for initial global config values
    if (window) {
      // @ts-ignore
      if (window.configPanelCount) setSceneConfig(prev => ({ ...prev, panelCount: window.configPanelCount }));
      // @ts-ignore
      if (window.configRadius) setSceneConfig(prev => ({ ...prev, radius: window.configRadius }));
      // @ts-ignore
      if (window.configViewDistance) setSceneConfig(prev => ({ ...prev, viewDistance: window.configViewDistance }));
    }
    
    // Listen for updates
    window.addEventListener('sceneConfigUpdated', handleConfigUpdate as EventListener);
    
    return () => {
      window.removeEventListener('sceneConfigUpdated', handleConfigUpdate as EventListener);
    };
  }, []);
  
  // Panel data - recreate when panel count changes
  const panelData = Array.from({ length: sceneConfig.panelCount }, (_, index) => {
    // Define a set of colors to cycle through
    const colors = [
      '#1e40af', // blue
      '#0f766e', // teal
      '#7c2d12', // brown
      '#4c1d95', // purple
      '#065f46', // green
      '#9d174d', // pink
      '#b45309', // amber
      '#1e3a8a', // indigo
      '#365314', // lime
      '#831843', // fuchsia
      '#134e4a', // cyan
      '#3f6212'  // green
    ];
    
    // Cycle through these colors based on index
    const color = colors[index % colors.length];
    
    // Define content types that change based on index
    const contentTypes = ['home', 'projects', 'blog', 'about', 'contact'];
    const contentType = contentTypes[index % contentTypes.length];
    
    return {
      id: contentType + (index > 4 ? index : ''),
      title: contentType.charAt(0).toUpperCase() + contentType.slice(1) + (index > 4 ? ' ' + index : ''),
      color: color
    };
  });
  
  return (
    <>
      {/* Enhanced lighting for better visibility */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 2, 5]} intensity={1.8} castShadow />
      <pointLight position={[-2, 0, 3]} intensity={1} color="#4fc3f7" />
      <pointLight position={[2, 0, 3]} intensity={1} color="#ff9e80" />
      <Environment preset="city" />
      
      {/* Enhanced camera controller with dynamic config */}
      <CircularCameraController 
        panelCount={sceneConfig.panelCount}
        radius={sceneConfig.radius}
        height={0}
        viewDistance={sceneConfig.viewDistance}
        startInCenter={true}
        normalFOV={normalFOV}
        wideFOV={wideFOV}
      />
      
      {/* Main content container */}
      <group ref={groupRef}>
        {/* Circular environment with panels */}
        <CircularEnvironment 
          panelCount={sceneConfig.panelCount} 
          radius={sceneConfig.radius}
        />
        
        {/* Add panel content separately to ensure proper positioning */}
        {panelData.map((panel, index) => {
          // Calculate angle for each panel (matching CircularEnvironment)
          const angle = (-index / sceneConfig.panelCount) * Math.PI * 2;
          
          // Position and rotation matching the panels
          const x = Math.sin(angle) * sceneConfig.radius;
          const z = Math.cos(angle) * sceneConfig.radius;
          const rotationY = angle + Math.PI; // Panel faces inward
          
          return (
            <PanelContent
              key={panel.id}
              position={[x, 0, z]}
              rotation={[0, rotationY, 0]}
              panelId={panel.id}
              title={panel.title}
              isActive={false} // This will be controlled dynamically
              width={PANEL_WIDTH * sizeFactor}
              height={PANEL_HEIGHT * sizeFactor}
            />
          );
        })}
      </group>
    </>
  );
};

export default Scene;
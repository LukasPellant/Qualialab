// src/components/canvas/SecondaryNavigation.tsx
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface SubpanelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: [number, number];
  color: string;
  name: string;
  isActive?: boolean;
  index: number;
}

// Individual subpanel component for the secondary navigation
const Subpanel = ({ position, rotation, dimensions, color, name, isActive = false, index }: SubpanelProps) => {
  const meshRef = useRef<any>(null);

  // Add animation for active panel
  useFrame(({ clock }) => {
    if (meshRef.current && isActive) {
      const t = clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Panel background */}
      <mesh ref={meshRef}>
        <planeGeometry args={dimensions} />
        <meshStandardMaterial 
          color={color} 
          opacity={isActive ? 0.9 : 0.7}
          transparent={true}
        />
      </mesh>
      
      {/* Panel outline */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(...dimensions)]} />
        <lineBasicMaterial color="#ffffff" linewidth={2} />
      </lineSegments>
      
      {/* Panel title */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.6}
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

interface SecondaryNavigationProps {
  parentPanelId: string;
  visible: boolean;
  position: [number, number, number];
  radius?: number;
  panelCount?: number;
}

const SecondaryNavigation = ({ 
  parentPanelId,
  visible = false,
  position = [0, -10, 0], // Start below the main circle
  radius = 15,
  panelCount = 6
}: SecondaryNavigationProps) => {
  const groupRef = useRef<Group>(null);
  const [activeSubpanel, setActiveSubpanel] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(visible);
  
  // Define subpanel dimensions (slightly smaller than main panels)
  const PANEL_WIDTH = 12;
  const PANEL_HEIGHT = 6;
  const sizeFactor = 1.0;
  
  // Update visibility based on prop
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  
  // Sync with the camera controller's active secondary panel
  useEffect(() => {
    const checkActiveSubpanel = () => {
      if (window && 'currentSecondaryIndex' in window) {
        // @ts-ignore
        const currentIndex = window.currentSecondaryIndex;
        if (currentIndex !== activeSubpanel && currentIndex >= 0 && currentIndex < panelCount) {
          setActiveSubpanel(currentIndex);
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkActiveSubpanel, 200);
    
    return () => clearInterval(interval);
  }, [activeSubpanel, panelCount]);
  
  // Generate subpanel data based on parent panel ID
  const generateSubpanelData = (parentId: string) => {
    // Define subpanel data for each parent panel type
    const subpanelsByParent: {[key: string]: {id: string, name: string, color: string}[]} = {
      'home': [
        { id: 'welcome', name: 'Welcome', color: '#1e40af' },
        { id: 'featured', name: 'Featured', color: '#1d4ed8' },
        { id: 'recent', name: 'Recent Work', color: '#2563eb' },
        { id: 'overview', name: 'Site Overview', color: '#3b82f6' },
        { id: 'stats', name: 'Statistics', color: '#60a5fa' },
        { id: 'testimonials', name: 'Testimonials', color: '#93c5fd' }
      ],
      'projects': [
        { id: 'web', name: 'Web Development', color: '#0f766e' },
        { id: '3d', name: '3D Modeling', color: '#0d9488' },
        { id: 'ui', name: 'UI Design', color: '#14b8a6' },
        { id: 'games', name: 'Game Development', color: '#2dd4bf' },
        { id: 'mobile', name: 'Mobile Apps', color: '#5eead4' },
        { id: 'backend', name: 'Backend Systems', color: '#99f6e4' }
      ],
      'blog': [
        { id: 'tech', name: 'Technology', color: '#7c2d12' },
        { id: 'design', name: 'Design', color: '#9a3412' },
        { id: 'tutorials', name: 'Tutorials', color: '#c2410c' },
        { id: 'opinions', name: 'Opinions', color: '#ea580c' },
        { id: 'case-studies', name: 'Case Studies', color: '#f97316' },
        { id: 'resources', name: 'Resources', color: '#fdba74' }
      ],
      'about': [
        { id: 'bio', name: 'Biography', color: '#4c1d95' },
        { id: 'skills', name: 'Skills', color: '#5b21b6' },
        { id: 'experience', name: 'Experience', color: '#6d28d9' },
        { id: 'education', name: 'Education', color: '#7c3aed' },
        { id: 'awards', name: 'Awards', color: '#8b5cf6' },
        { id: 'hobbies', name: 'Hobbies', color: '#a78bfa' }
      ],
      'contact': [
        { id: 'email', name: 'Email', color: '#065f46' },
        { id: 'form', name: 'Contact Form', color: '#047857' },
        { id: 'social', name: 'Social Media', color: '#059669' },
        { id: 'phone', name: 'Phone', color: '#10b981' },
        { id: 'location', name: 'Location', color: '#34d399' },
        { id: 'schedule', name: 'Schedule Meeting', color: '#6ee7b7' }
      ]
    };
    
    // Default subpanels for any other panel type
    const defaultSubpanels = [
      { id: 'sub1', name: 'Subpage 1', color: '#1e3a8a' },
      { id: 'sub2', name: 'Subpage 2', color: '#1e40af' },
      { id: 'sub3', name: 'Subpage 3', color: '#1d4ed8' },
      { id: 'sub4', name: 'Subpage 4', color: '#2563eb' },
      { id: 'sub5', name: 'Subpage 5', color: '#3b82f6' },
      { id: 'sub6', name: 'Subpage 6', color: '#60a5fa' }
    ];
    
    // Return the appropriate subpanels or default if not found
    return (subpanelsByParent[parentId] || defaultSubpanels).slice(0, panelCount);
  };
  
  // Get subpanel data for the current parent panel
  const subpanelData = generateSubpanelData(parentPanelId);
  
  // Animation for the entire secondary navigation
  useFrame(() => {
    if (groupRef.current) {
      // Smoothly move the group to its target position when visibility changes
      const targetY = isVisible ? position[1] : position[1] - 20; // Hide it below
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, 
        targetY, 
        0.1
      );
      
      // Also adjust opacity of all materials for fade effect
      groupRef.current.traverse((child) => {
        if ((child as any).material && (child as any).material.opacity !== undefined) {
          const targetOpacity = isVisible ? (child as any).material._targetOpacity || 1 : 0;
          (child as any).material.opacity = THREE.MathUtils.lerp(
            (child as any).material.opacity, 
            targetOpacity, 
            0.1
          );
        }
      });
    }
  });
  
  // Calculate positions and rotations for each subpanel
  const subpanels = subpanelData.map((panel, index) => {
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
      isActive: index === activeSubpanel,
      index
    };
  });
  
  // Function to handle returning to main navigation
  const returnToMainNavigation = () => {
    if (window) {
      // @ts-ignore
      window.showSecondaryNavigation = false;
      
      // Create and dispatch a custom event to notify the camera controller
      const event = new CustomEvent('returnToMainNavigation', {
        detail: { parentPanelId }
      });
      window.dispatchEvent(event);
    }
  };
  
  return (
    <group 
      ref={groupRef} 
      position={position}
      visible={isVisible}
    >
      {/* Render all subpanels in circular arrangement */}
      {subpanels.map((panel) => (
        <Subpanel
          key={panel.id}
          position={panel.position}
          rotation={panel.rotation}
          dimensions={panel.dimensions}
          color={panel.color}
          name={panel.name}
          isActive={panel.isActive}
          index={panel.index}
        />
      ))}
      
      {/* Return button to go back to main navigation */}
      <group 
        position={[0, 5, 0]} 
        onClick={returnToMainNavigation}
      >
        <mesh>
          <cylinderGeometry args={[1.5, 1.5, 0.5, 32]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto.woff"
        >
          Return Up
        </Text>
      </group>
      
      {/* Connection line to parent panel */}
      <mesh position={[0, position[1] / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, Math.abs(position[1]), 12]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.5} />
      </mesh>
    </group>
  );
};

export default SecondaryNavigation;
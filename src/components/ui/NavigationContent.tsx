// src/components/ui/NavigationContent.tsx
import { useRef } from 'react';
import { Text } from '@react-three/drei';
import Button3D from './Button3D';

interface NavigationContentProps {
  faceId: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const NavigationContent = ({ faceId, position, rotation }: NavigationContentProps) => {
  const groupRef = useRef<any>(null);
  const menuItems = ['Home', 'Projects', 'Blog', 'About', 'Contact', 'Settings'];
  
  // Calculate dimensions based on 16:9 aspect ratio
  const WIDTH = 16;
  const HEIGHT = 9;
  const sizeFactor = 1.5;
  
  // Calculate a good button width based on the face width
  const buttonWidth = WIDTH * sizeFactor * 0.35;
  
  // Function to navigate to a specific face
  const navigateToFace = (faceName: string) => {
    // Map menu items to face IDs
    const faceMap: Record<string, string> = {
      'Home': 'front',
      'Projects': 'right',
      'Blog': 'back',
      'About': 'left',
      'Contact': 'top',
      'Settings': 'bottom'
    };
    
    const faceId = faceMap[faceName];
    if (faceId && window) {
      // Set the target face ID for the camera controller
      // @ts-ignore
      window.targetFace = faceId;
    }
  };
  
  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Navigation title */}
      <Text
        position={[0, HEIGHT * sizeFactor * 0.4, 0.2]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
      >
        My Portfolio
      </Text>
      
      <Text
        position={[0, HEIGHT * sizeFactor * 0.25, 0.2]}
        fontSize={0.9}
        color="#a3e635"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
      >
        Interactive 3D Experience
      </Text>
      
      {/* Description text - taking advantage of the wider 16:9 space */}
      <Text
        position={[0, HEIGHT * sizeFactor * 0.1, 0.2]}
        fontSize={0.6}
        color="#cbd5e1"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
        maxWidth={WIDTH * sizeFactor * 0.8}
        textAlign="center"
      >
        Navigate between faces by clicking buttons below or by dragging to rotate the environment.
        Each face showcases a different aspect of my work.
      </Text>
      
      {/* Menu items in two columns for better use of 16:9 space */}
      <group position={[0, -HEIGHT * sizeFactor * 0.2, 0.2]}>
        {menuItems.map((item, index) => {
          // Create a 2-column layout
          const column = index % 2;
          const row = Math.floor(index / 2);
          const xOffset = column === 0 ? -buttonWidth * 0.6 : buttonWidth * 0.6;
          
          return (
            <Button3D
              key={item}
              position={[xOffset, -row * 1.8, 0]}
              text={item}
              onClick={() => navigateToFace(item)}
              isActive={
                (item === 'Home' && faceId === 'front') ||
                (item === 'Projects' && faceId === 'right') ||
                (item === 'Blog' && faceId === 'back') ||
                (item === 'About' && faceId === 'left') ||
                (item === 'Contact' && faceId === 'top') ||
                (item === 'Settings' && faceId === 'bottom')
              }
              width={buttonWidth}
              height={1.2}
              depth={0.1}
              color="#1e293b"
              hoverColor="#334155"
              activeColor="#0f766e"
            />
          );
        })}
      </group>
      
      {/* Footer text */}
      <Text
        position={[0, -HEIGHT * sizeFactor * 0.45, 0.2]}
        fontSize={0.5}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
      >
        Built with React, Three.js and WebGL
      </Text>
    </group>
  );
};

export default NavigationContent;
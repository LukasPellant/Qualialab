// src/components/ui/NavMenu3D.tsx
import { Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import Button3D from './Button3D';

interface NavMenu3DProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobile: boolean;
}

const NavMenu3D = ({ activeSection, setActiveSection, isMobile }: NavMenu3DProps) => {
  const menuRef = useRef<Mesh>(null);
  const menuItems = ['home', 'blog', 'projects', 'about', 'contact'];
  
  // Position menu based on device type
  const menuPosition = isMobile 
    ? new Vector3(0, 1.5, 0) 
    : new Vector3(0, 0, -8);
  
  // Remove animation from the menu to keep it static
  // useFrame removed
  
  return (
    <group position={menuPosition}>
      <mesh ref={menuRef}>
        {/* Menu title */}
        <Text
          position={[0, menuItems.length * 0.8, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto.woff"
        >
          Navigation
        </Text>
        
        {/* Menu items */}
        {menuItems.map((item, index) => (
          <Button3D
            key={item}
            position={[0, menuItems.length * 0.5 - index * 0.8, 0]}
            text={item.charAt(0).toUpperCase() + item.slice(1)}
            onClick={() => setActiveSection(item)}
            isActive={activeSection === item}
          />
        ))}
      </mesh>
    </group>
  );
};

export default NavMenu3D;
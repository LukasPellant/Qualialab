// src/components/ui/TextPanel3D.tsx
import { Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useEffect, useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';

interface TextPanel3DProps {
  activeSection: string;
  isMobile: boolean;
}

interface ContentType {
  title: string;
  content: string[];
}

const TextPanel3D = ({ activeSection, isMobile }: TextPanel3DProps) => {
  const meshRef = useRef<Mesh>(null);
  
  // Update panel position to match menu's new position
  const panelPosition = isMobile 
    ? new Vector3(0, 0, 0) 
    : new Vector3(0, 0, -8);
  
  // Define content for each section
  const contentMap: Record<string, ContentType> = {
    home: {
      title: 'Welcome',
      content: [
        'This is my personal 3D canvas website',
        'Navigate using the 3D menu',
        'Explore my blog, projects, and more'
      ]
    },
    blog: {
      title: 'Blog',
      content: [
        'My latest thoughts and ideas',
        'Technical articles and tutorials',
        'Creative explorations'
      ]
    },
    projects: {
      title: 'Projects',
      content: [
        'Interactive 3D experiences',
        'Web development projects',
        'Creative coding experiments'
      ]
    },
    about: {
      title: 'About Me',
      content: [
        'Developer and digital artist',
        'Passionate about creating immersive web experiences',
        'Always exploring new technologies'
      ]
    },
    contact: {
      title: 'Contact',
      content: [
        'Get in touch with me',
        'Email: hello@example.com',
        'Twitter: @example'
      ]
    }
  };
  
  // Get current content
  const currentContent = contentMap[activeSection] || contentMap.home;
  
  // Animation for panel
  const { opacity, posZ } = useSpring({
    from: { opacity: 0, posZ: -1 },
    to: { opacity: 1, posZ: 0 },
    reset: true,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Remove panel floating animation to keep it static
  // useFrame removed
  
  return (
    <animated.group 
      position={[panelPosition.x, panelPosition.y, posZ]} 
      opacity={opacity}
    >
      <mesh ref={meshRef}>
        {/* Panel background */}
        <planeGeometry args={[3.5, 3]} />
        <meshStandardMaterial 
          color="#0f172a" // Tailwind slate-900
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.2}
        />
        
        {/* Panel title */}
        <Text
          position={[0, 1.5, 0.1]}
          fontSize={0.5}
          color="#38bdf8" // Tailwind sky-400
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto.woff"
          maxWidth={4}
        >
          {currentContent.title}
        </Text>
        
        {/* Panel content */}
        <group position={[0, 0, 0.1]}>
          {currentContent.content.map((text, index) => (
            <Text
              key={index}
              position={[0, 0.7 - index * 0.6, 0]}
              fontSize={0.3}
              color="#f8fafc" // Tailwind slate-50
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={4}
            >
              {text}
            </Text>
          ))}
        </group>
      </mesh>
    </animated.group>
  );
};

export default TextPanel3D;
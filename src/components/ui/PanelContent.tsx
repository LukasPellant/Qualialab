// src/components/ui/PanelContent.tsx
import { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';
import Button3D from './Button3D';

// Custom button component
const InteractiveButton = ({ position, text, width, height, color, onClick = () => {} }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const meshRef = useRef();
  const { gl } = useThree();
  
  // Handle click event
  const handleClick = () => {
    setIsClicked(true);
    onClick();
    
    // Create an alert or notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.padding = '20px';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '10000';
    notification.style.fontFamily = 'sans-serif';
    notification.style.textAlign = 'center';
    notification.textContent = `Button "${text}" clicked!`;
    
    document.body.appendChild(notification);
    
    // Remove after 2 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
      setIsClicked(false);
    }, 2000);
  };
  
  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => {
          setIsHovered(true);
          gl.domElement.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setIsHovered(false);
          gl.domElement.style.cursor = 'grab';
        }}
        scale={isHovered ? 1.1 : 1}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={isClicked ? '#22c55e' : isHovered ? '#94a3b8' : color}
          roughness={0.3}
          metalness={0.2}
        />
        <Text
          position={[0, 0, 0.1]}
          fontSize={height * 0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto.woff"
        >
          {text}
        </Text>
      </mesh>
    </group>
  );
};

interface PanelContentProps {
  position: [number, number, number];
  rotation: [number, number, number];
  panelId: string;
  title: string;
  isActive?: boolean;
  width: number;
  height: number;
}

const PanelContent = ({ 
  position, 
  rotation, 
  panelId, 
  title, 
  isActive = false,
  width,
  height
}: PanelContentProps) => {
  const groupRef = useRef<Group>(null);
  
  // Function to open secondary navigation
  const openSecondaryNavigation = () => {
    if (window) {
      // Set the current panel as active folder
      // @ts-ignore
      window.activeFolder = panelId;
      
      // Trigger secondary navigation
      // @ts-ignore
      window.showSecondaryNavigation = true;
      
      // Create and dispatch a custom event to notify the camera controller
      const event = new CustomEvent('navigateToSecondary', {
        detail: { panelId, panelIndex: window.currentPanelIndex }
      });
      window.dispatchEvent(event);
    }
  };
  
  // Add subtle animation for active panel
  useFrame(({ clock }) => {
    if (groupRef.current && isActive) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
  });
  
  // Content specific to panel type
  const renderPanelContent = () => {
    switch (panelId) {
      case 'home':
        return (
          <>
            <Text
              position={[0, height * 0.1, 0.1]}
              fontSize={0.7}
              color="#a3e635"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
            >
              Welcome to my 3D Portfolio
            </Text>
            <Text
              position={[0, -height * 0.05, 0.1]}
              fontSize={0.5}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={width * 0.8}
              textAlign="center"
            >
              Navigate between panels by dragging or using the controls below.
              Each panel showcases a different aspect of my work.
            </Text>
            
            {/* Interactive Button */}
            <InteractiveButton 
              position={[0, -height * 0.2, 0]}
              text="Home Button"
              width={width * 0.3}
              height={height * 0.1}
              color="#1e40af"
            />
            
            {/* Secondary Navigation Button */}
            <Button3D
              position={[0, -height * 0.35, 0]}
              text="Open Home Subpages"
              onClick={openSecondaryNavigation}
              width={width * 0.5}
              height={height * 0.1}
              depth={0.15}
              color="#0f766e"
              hoverColor="#0e7490"
              activeColor="#0f766e"
            />
          </>
        );
        
      case 'projects':
        return (
          <>
            <Text
              position={[0, height * 0.1, 0.1]}
              fontSize={0.7}
              color="#22d3ee"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
            >
              My Projects
            </Text>
            <Text
              position={[0, -height * 0.05, 0.1]}
              fontSize={0.5}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={width * 0.8}
              textAlign="center"
            >
              A collection of web applications, 3D experiments, and creative coding projects.
            </Text>
            
            {/* Interactive buttons for projects */}
            <group position={[0, -height * 0.2, 0]}>
              {[...Array(3)].map((_, i) => (
                <InteractiveButton
                  key={i}
                  position={[(i - 1) * width * 0.25, 0, 0]}
                  text={`Project ${i+1}`}
                  width={width * 0.2}
                  height={height * 0.15}
                  color={['#0d9488', '#0e7490', '#0f766e'][i]}
                />
              ))}
            </group>
            
            {/* Secondary Navigation Button */}
            <Button3D
              position={[0, -height * 0.4, 0]}
              text="Browse All Projects"
              onClick={openSecondaryNavigation}
              width={width * 0.5}
              height={height * 0.1}
              depth={0.15}
              color="#0f766e"
              hoverColor="#0e7490"
              activeColor="#0f766e"
            />
          </>
        );
        
      case 'blog':
        return (
          <>
            <Text
              position={[0, height * 0.1, 0.1]}
              fontSize={0.7}
              color="#f97316"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
            >
              My Blog
            </Text>
            <Text
              position={[0, -height * 0.05, 0.1]}
              fontSize={0.5}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={width * 0.8}
              textAlign="center"
            >
              Thoughts and ideas about web development, 3D graphics, and creative coding.
            </Text>
            
            {/* Interactive blog posts */}
            <group position={[0, -height * 0.2, 0]}>
              {[...Array(2)].map((_, i) => (
                <InteractiveButton
                  key={i}
                  position={[(i - 0.5) * width * 0.4, 0, 0]}
                  text={['Latest Post', 'Featured Article'][i]}
                  width={width * 0.35}
                  height={height * 0.2}
                  color={['#7c2d12', '#9a3412'][i]}
                />
              ))}
            </group>
            
            {/* Secondary Navigation Button */}
            <Button3D
              position={[0, -height * 0.4, 0]}
              text="View All Articles"
              onClick={openSecondaryNavigation}
              width={width * 0.5}
              height={height * 0.1}
              depth={0.15}
              color="#9a3412"
              hoverColor="#7c2d12"
              activeColor="#9a3412"
            />
          </>
        );
        
      case 'about':
        return (
          <>
            <Text
              position={[0, height * 0.1, 0.1]}
              fontSize={0.7}
              color="#a78bfa"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
            >
              About Me
            </Text>
            <Text
              position={[0, -height * 0.05, 0.1]}
              fontSize={0.5}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={width * 0.8}
              textAlign="center"
            >
              I'm a web developer and digital artist passionate about creating immersive experiences.
            </Text>
            
            {/* Single about button */}
            <InteractiveButton
              position={[0, -height * 0.2, 0]}
              text="About Button"
              width={width * 0.3}
              height={height * 0.1}
              color="#4c1d95"
            />
            
            {/* Secondary Navigation Button */}
            <Button3D
              position={[0, -height * 0.35, 0]}
              text="More About Me"
              onClick={openSecondaryNavigation}
              width={width * 0.5}
              height={height * 0.1}
              depth={0.15}
              color="#4c1d95"
              hoverColor="#5b21b6"
              activeColor="#4c1d95"
            />
          </>
        );
        
      case 'contact':
        return (
          <>
            <Text
              position={[0, height * 0.1, 0.1]}
              fontSize={0.7}
              color="#10b981"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
            >
              Contact Me
            </Text>
            <Text
              position={[0, -height * 0.05, 0.1]}
              fontSize={0.5}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={width * 0.8}
              textAlign="center"
            >
              Interested in working together? Get in touch!
            </Text>
            
            {/* Contact buttons */}
            <group position={[0, -height * 0.2, 0]}>
              {[...Array(3)].map((_, i) => (
                <InteractiveButton
                  key={i}
                  position={[(i - 1) * width * 0.25, 0, 0]}
                  text={['Email', 'LinkedIn', 'GitHub'][i]}
                  width={width * 0.2}
                  height={height * 0.1}
                  color={['#065f46', '#047857', '#059669'][i]}
                />
              ))}
            </group>
            
            {/* Secondary Navigation Button */}
            <Button3D
              position={[0, -height * 0.35, 0]}
              text="Contact Options"
              onClick={openSecondaryNavigation}
              width={width * 0.5}
              height={height * 0.1}
              depth={0.15}
              color="#065f46"
              hoverColor="#047857"
              activeColor="#065f46"
            />
          </>
        );
        
      default:
        return (
          <>
            <Text
              position={[0, height * 0.1, 0.1]}
              fontSize={0.7}
              color="#60a5fa"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
            >
              {title}
            </Text>
            <Text
              position={[0, -height * 0.05, 0.1]}
              fontSize={0.5}
              color="#cbd5e1"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto.woff"
              maxWidth={width * 0.8}
              textAlign="center"
            >
              This is panel {panelId} with custom content.
            </Text>
            
            {/* Generic button */}
            <InteractiveButton
              position={[0, -height * 0.2, 0]}
              text="Panel Button"
              width={width * 0.3}
              height={height * 0.1}
              color="#1e40af"
            />
            
            {/* Secondary Navigation Button */}
            <Button3D
              position={[0, -height * 0.35, 0]}
              text="Open Subpages"
              onClick={openSecondaryNavigation}
              width={width * 0.5}
              height={height * 0.1}
              depth={0.15}
              color="#1e40af"
              hoverColor="#1d4ed8"
              activeColor="#1e40af"
            />
          </>
        );
    }
  };
  
  return (
    <group 
      position={position} 
      rotation={rotation} 
      ref={groupRef}
    >
      {/* Dynamic content based on panel type */}
      {renderPanelContent()}
    </group>
  );
};

export default PanelContent;
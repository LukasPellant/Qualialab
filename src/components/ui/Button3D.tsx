// src/components/ui/Button3D.tsx
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';

interface Button3DProps {
  position: [number, number, number] | Vector3;
  text: string;
  onClick: () => void;
  isActive?: boolean;
  width?: number;
  height?: number;
  depth?: number;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  textColor?: string;
}

const Button3D = ({
  position,
  text,
  onClick,
  isActive = false,
  width = 2.2,
  height = 0.6,
  depth = 0.15,
  color = '#1e293b', // Tailwind slate-800
  hoverColor = '#334155', // Tailwind slate-700
  activeColor = '#0f766e', // Tailwind teal-700
  textColor = '#ffffff',
}: Button3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();
  
  // Animation springs
  const { scale, buttonColor } = useSpring({
    scale: hovered ? 1.1 : 1,
    buttonColor: isActive 
      ? activeColor 
      : hovered 
        ? hoverColor 
        : color,
    config: { mass: 1, tension: 280, friction: 60 }
  });
  
  // Hover effect
  useFrame(() => {
    gl.domElement.style.cursor = hovered ? 'pointer' : 'auto';
  });
  
  return (
    <group position={position}>
      <animated.mesh
        ref={meshRef}
        scale={scale}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width, height, depth]} />
        <animated.meshStandardMaterial color={buttonColor} />
        
        {/* Button text */}
        <Text
          position={[0, 0, depth / 2 + 0.01]}
          fontSize={height * 0.5}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto.woff"
        >
          {text}
        </Text>
      </animated.mesh>
    </group>
  );
};

export default Button3D;
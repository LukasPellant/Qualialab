// src/components/ui/ProjectsContent.tsx
import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import * as THREE from 'three';

interface ProjectCardProps {
  title: string;
  description: string;
  position: [number, number, number];
  color: string;
  width: number;
  height: number;
}

const ProjectCard = ({ title, description, position, color, width, height }: ProjectCardProps) => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle hover effect
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
    }
  });
  
  return (
    <group position={position} ref={meshRef}>
      {/* Card background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={color}
          opacity={0.9}
          transparent={true}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Card outline */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color="#ffffff" linewidth={1} />
      </lineSegments>
      
      {/* Card title */}
      <Text
        position={[0, height * 0.35, 0.1]}
        fontSize={height * 0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
        maxWidth={width * 0.9}
      >
        {title}
      </Text>
      
      {/* Card description */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={height * 0.08}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
        maxWidth={width * 0.9}
        textAlign="center"
      >
        {description}
      </Text>
    </group>
  );
};

interface ProjectsContentProps {
  position: [number, number, number];
  rotation: [number, number, number];
}

const ProjectsContent = ({ position, rotation }: ProjectsContentProps) => {
  const groupRef = useRef<Group>(null);
  
  // Calculate dimensions based on 16:9 aspect ratio
  const WIDTH = 16;
  const HEIGHT = 9;
  const DEPTH = 9;
  const sizeFactor = 1.5;
  
  // Calculate card dimensions for the rectangular space
  const cardWidth = DEPTH * sizeFactor * 0.28;
  const cardHeight = HEIGHT * sizeFactor * 0.28;
  
  // Example project data
  const projects = [
    {
      title: "3D Portfolio",
      description: "Interactive 3D web experience built with Three.js and React",
      color: "#0d9488"
    },
    {
      title: "AI Image Generator",
      description: "Web app that generates images using machine learning algorithms",
      color: "#0e7490"
    },
    {
      title: "Music Visualizer",
      description: "Real-time audio visualization using WebAudio API and canvas",
      color: "#0f766e"
    },
    {
      title: "React Game",
      description: "Browser-based game built with React and Canvas",
      color: "#0891b2"
    },
    {
      title: "Data Dashboard",
      description: "Interactive dashboard for visualizing complex datasets",
      color: "#0c4a6e"
    },
    {
      title: "WebGL Experiments",
      description: "Collection of creative coding experiments using WebGL",
      color: "#1e40af"
    }
  ];
  
  return (
    <group position={position} rotation={rotation} ref={groupRef}>
      {/* Projects title */}
      <Text
        position={[0, HEIGHT * sizeFactor * 0.4, 0.2]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
      >
        Projects
      </Text>
      
      {/* Projects subtitle */}
      <Text
        position={[0, HEIGHT * sizeFactor * 0.3, 0.2]}
        fontSize={0.7}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto.woff"
        maxWidth={DEPTH * sizeFactor * 0.8}
        textAlign="center"
      >
        A selection of my recent work
      </Text>
      
      {/* Project cards in a 3x2 grid layout optimized for rectangular space */}
      <group position={[0, 0, 0.2]}>
        {projects.map((project, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          
          // Calculate grid positions optimized for the available space
          const xSpacing = cardWidth * 1.2;
          const ySpacing = cardHeight * 1.3;
          
          return (
            <ProjectCard
              key={project.title}
              title={project.title}
              description={project.description}
              position={[
                (col - 1) * xSpacing, 
                HEIGHT * sizeFactor * 0.1 - row * ySpacing, 
                0
              ]}
              color={project.color}
              width={cardWidth}
              height={cardHeight}
            />
          );
        })}
      </group>
      
      {/* Return button at the bottom */}
      <group 
        position={[0, -HEIGHT * sizeFactor * 0.4, 0.2]} 
        onClick={() => {
          if (window) {
            // @ts-ignore
            window.targetFace = 'front';
          }
        }}
      >
        <mesh>
          <planeGeometry args={[4, 1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto.woff"
        >
          Return Home
        </Text>
      </group>
    </group>
  );
};

export default ProjectsContent;
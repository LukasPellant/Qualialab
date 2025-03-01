import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { navigate } from 'gatsby';
import { useSpring } from '@react-spring/web';
import FPVDroneModel from '../components/FPVDroneModel';
import CameraControls from '../components/CameraControls';
import * as THREE from 'three';

const Background = () => {
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color1: { value: new THREE.Color('black') },
          color2: { value: new THREE.Color('purple') },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec3 color1;
          uniform vec3 color2;
          void main() {
            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
          }
        `,
        side: THREE.BackSide, // Important: Render from the inside
      });

      return (
        <mesh>
            <sphereGeometry args={[50, 32, 32]} /> {/* Large sphere */}
            <primitive object={shaderMaterial} attach="material"/>
        </mesh>
      );
};

const ProjectButton = () => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { color } = useSpring({
        color: hovered ? 'hotpink' : 'orange',
    });

    useFrame((state, delta) => {
        meshRef.current.rotation.y += delta * 0.2;
        meshRef.current.scale.x = hovered ? 1.7 : 1.5;
        meshRef.current.scale.y = hovered ? 1.7 : 1.5;
        meshRef.current.scale.z = hovered ? 1.7 : 1.5;
    });

    return (
        <mesh
            ref={meshRef}
            position={[-2, 0, 0]}
            onClick={() => navigate('/projects/')}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry />
            <meshStandardMaterial color={color} />
        </mesh>
    );
};

const FPVDroneButton = () => {
  const [hovered, setHovered] = useState(false);
  const { color } = useSpring({
      color: hovered ? 'cyan' : 'lightblue',
  });

  return (
    <FPVDroneModel
      position={[2, 0, 0]}
      onClick={() => navigate('/fpv-drones/')}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      color={color}
      scale={hovered ? 1.4 : 1.2}
    />
  );
};

const HomePage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <CameraControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <Background />
        <ProjectButton />
        <FPVDroneButton />
      </Canvas>
    </div>
  );
};

export default HomePage;
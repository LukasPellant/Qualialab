import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { navigate } from 'gatsby';
import { useSpring, animated } from '@react-spring/web';
import FPVDroneModel from '../components/FPVDroneModel';
// import SimpleCube from '../components/SimpleCube';  <-- No longer needed

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
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <ProjectButton />
        <FPVDroneButton />
        {/* <SimpleCube position={[0, 2, 0]} color="green" />  <-- Remove this line */}
      </Canvas>
    </div>
  );
};

export default HomePage;
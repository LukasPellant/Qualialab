import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import PrinterModel from '../components/PrinterModel';
import DroneModel from '../components/DroneModel';
import font from '../fonts/Roboto-Regular.woff';
import { Text, Billboard } from '@react-three/drei';
import CameraControls from '../components/CameraControls';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

const Background = () => {
    // ... (Background component - No changes needed) ...
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color('darkslategray') },
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
      side: THREE.BackSide,
    });

    const { backgroundOpacity } = useSpring({
      from: { backgroundOpacity: 0 },
      to: { backgroundOpacity: 1 },
      config: { duration: 2000 },
    });

    return (
      <animated.mesh style={{ opacity: backgroundOpacity }}>
        <sphereGeometry args={[50, 32, 32]} />
        <primitive object={shaderMaterial} attach="material" />
      </animated.mesh>
    );
};

const PrinterButton = ({ setTargetPosition }) => {
    // ... (PrinterButton component - No changes needed) ...
  const [hovered, setHovered] = useState(false);
  const color = hovered ? "hotpink" : "orange";
  const printerRef = useRef();

  return (
    <group>
      <PrinterModel
        ref={printerRef}
        position={[-2, 1.5, 0]}
        scale={hovered ? 0.12 : 0.1}
        onClick={() => {
          if (printerRef.current) {
            const currentPosition = printerRef.current.position;
            setTargetPosition([currentPosition.x, currentPosition.y, currentPosition.z]);
          }
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        color={color}
      />
      <Billboard position={[-2, 3.5, 0]}>
        <Text visible={hovered} fontSize={0.4} color="white" font={font}>
          Projects
        </Text>
      </Billboard>
    </group>
  );
};

const FPVDroneButton = ({ setTargetPosition }) => {
    // ... (FPVDroneButton component - No changes needed) ...
  const [hovered, setHovered] = useState(false);
  const color = hovered ? 'cyan' : 'lightblue';
  const droneRef = useRef();

  return (
    <group>
      <DroneModel
        ref={droneRef}
        position={[1, 1.5, 0]}
        onClick={() => {
          if (droneRef.current) {
            const currentPosition = droneRef.current.position;
            setTargetPosition([currentPosition.x, currentPosition.y, currentPosition.z]);
          }
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 4.5 : 3.5}
        color={color}
      />

      <Billboard position={[1, 3, 0]}>
        <Text visible={hovered} fontSize={0.4} color="white" font={font}>
          FPV Journey
        </Text>
      </Billboard>
    </group>
  );
};

const HomePage = () => {
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);

  const handleResetCamera = () => {
    setTargetPosition([0, 0, 0]);
  };

    const { lightIntensity } = useSpring({
        from: { lightIntensity: 0 }, // Start with 0 intensity
        to: { lightIntensity: 1 },
        config: { duration: 2000 },
    });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas style={{ position: 'absolute', top: 0, left: 0 }}>
        <CameraControls targetPosition={[...targetPosition]} onResetCamera={handleResetCamera} />
        <animated.ambientLight intensity={lightIntensity} color="#888888" />
        <animated.directionalLight
          position={[5, 5, 5]}
          intensity={lightIntensity} // Use animated intensity
          color="white"
        />
        <animated.pointLight position={[-3, 4, -3]} intensity={lightIntensity} color="#ffcc88" />
        <hemisphereLight
             skyColor={"mediumpurple"}
             groundColor={"darkslategray"}
             intensity={1} //Keep it at 1
        />
        <Background />
        <PrinterButton setTargetPosition={setTargetPosition} />
        <FPVDroneButton setTargetPosition={setTargetPosition} />
      </Canvas>

      <div style={{ position: 'absolute', top: '100vh', left: 0, width: '100vw' }}>
        <h2>Welcome to the Home Page!</h2>
      </div>
    </div>
  );
};

export default HomePage;
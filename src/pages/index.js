import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import CameraControls from '../components/CameraControls';
import * as THREE from 'three';
import font from '../fonts/Roboto-Regular.woff';
import TextOption from '../components/TextOption';
import { Billboard } from '@react-three/drei';
import PrinterModel from '../components/PrinterModel';
import DroneModel from '../components/DroneModel'; // Import the new component

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
    side: THREE.BackSide,
  });

  return (
    <mesh>
      <sphereGeometry args={[50, 32, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};


const FPVDroneButton = ({ setTargetPosition, setDroneClicked, droneClicked }) => {
  const [hovered, setHovered] = useState(false);
  const color = hovered ? 'cyan' : 'lightblue';

  return (
    <>
      <DroneModel
        position={[3, 1.5, -1.5]}
        onClick={() => {
          setTargetPosition([2, 1.5, 0]);
          setDroneClicked(true);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 0.1 : 0.08} // Example scale - adjust as needed!
      />
      {droneClicked && (
        <>
          <TextOption
            position={[2, 0.8, 0]}
            text="All equipment"
            font={font}
            onClick={() => console.log("All equipment clicked")}
            depth={0.1}

          />
          <TextOption
            position={[2, 0.5, 0]}
            text="Video journey"
            font={font}
            onClick={() => console.log("Video journey clicked")}
            depth={0.1}

          />
          <TextOption
            position={[2, 0.2, 0]}
            text="Latest flying skills"
            font={font}
            onClick={() => console.log("Latest flying skills clicked")}
            depth={0.1}

          />
        </>
      )}
    </>
  );
};

const HomePage = () => {
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [droneClicked, setDroneClicked] = useState(false);

    const handleResetCamera = () => {
        setTargetPosition([0, 0, 0]);
        setDroneClicked(false);
    };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <CameraControls targetPosition={[...targetPosition]} onResetCamera={handleResetCamera} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <Background />
        <PrinterModel
          position={[-2, 1.5, 0]}
          scale={0.1}
          onClick={() => {
            setTargetPosition([-2, 1.5, 0]);
            setDroneClicked(false);
          }}
        />
        <FPVDroneButton setTargetPosition={setTargetPosition} setDroneClicked={setDroneClicked} droneClicked={droneClicked} />
      </Canvas>
    </div>
  );
};

export default HomePage;
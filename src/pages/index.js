import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import FPVDroneModel from '../components/FPVDroneModel';
import CameraControls from '../components/CameraControls';
import * as THREE from 'three';
import font from '../fonts/Roboto-Regular.woff';
import TextOption from '../components/TextOption';
import { Billboard } from '@react-three/drei';
import PrinterModel from '../components/PrinterModel';
import DroneModel from '../components/DroneModel'; // Import DroneModel!

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


const PrinterButton = ({ setTargetPosition, setDroneClicked }) => {
    const [hovered, setHovered] = useState(false);
    const color = hovered ? "hotpink" : "orange"; //Use color
    const printerRef = useRef();
    return (
        <PrinterModel
            ref={printerRef}
            position={[-2, 1.5, 0]}
            scale={hovered ? 0.12 : 0.1} // Use scale prop here!
            onClick={() => {
                if (printerRef.current) {
                    const currentPosition = printerRef.current.position;
                    console.log("Printer Clicked - Setting target to:", currentPosition);
                    setTargetPosition([currentPosition.x, currentPosition.y, currentPosition.z]);
                    setDroneClicked(false); // Hide text on printer click

                }
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            color={color}
        />
    );
};
const FPVDroneButton = ({ setTargetPosition, setDroneClicked, droneClicked }) => {
  const [hovered, setHovered] = useState(false);
  const color = hovered ? 'cyan' : 'lightblue';
  const droneRef = useRef();

  return (
    <>
      <DroneModel
        ref={droneRef}
        position={[1, 1.5, 0]}
        onClick={() => {
            if (droneRef.current) {
                const currentPosition = droneRef.current.position;
                console.log("Drone Clicked - Setting target to:", currentPosition);
                setTargetPosition([currentPosition.x, currentPosition.y, currentPosition.z]);
              }
          setDroneClicked(true);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 4 : 3.5} //Use scale here
        color={color} // Pass the color prop

      />
      {droneClicked && (
        <>
          <TextOption
            position={[
              droneRef.current ? droneRef.current.position.x : 3, // X
              droneRef.current ? droneRef.current.position.y - 0.7 : 0.8, // Y, adjusted
              droneRef.current ? droneRef.current.position.z + 0.5 : 0, // Z, in front
            ]}
            text="All equipment"
            font={font}
            onClick={() => console.log("All equipment clicked")}
            depth={0.1}

          />
          <TextOption
           position={[
              droneRef.current ? droneRef.current.position.x : 3, // X
              droneRef.current ? droneRef.current.position.y - 1.0 : 0.5, // Y, adjusted
              droneRef.current ? droneRef.current.position.z + 0.5 : 0, // Z, in front
            ]}
            text="Video journey"
            font={font}
            onClick={() => console.log("Video journey clicked")}
            depth={0.1}

          />
          <TextOption
            position={[
              droneRef.current ? droneRef.current.position.x : 3, // X
              droneRef.current ? droneRef.current.position.y - 1.3 : 0.2, // Y, adjusted
              droneRef.current ? droneRef.current.position.z + 0.5 : 0, // Z, in front
            ]}
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
        <PrinterButton setTargetPosition={setTargetPosition} setDroneClicked={setDroneClicked}/>
        <FPVDroneButton setTargetPosition={setTargetPosition} setDroneClicked={setDroneClicked} droneClicked={droneClicked} />
      </Canvas>
    </div>
  );
};

export default HomePage;
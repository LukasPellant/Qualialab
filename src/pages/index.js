import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
// ... other imports ...
import PrinterModel from '../components/PrinterModel';
import DroneModel from '../components/DroneModel';
import font from '../fonts/Roboto-Regular.woff';
import TextOption from '../components/TextOption';
import CameraControls from '../components/CameraControls';
import * as THREE from 'three';

const Background = () => {
    // ... (Background component remains unchanged) ...
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
    // ... (PrinterButton component remains unchanged) ...
    const [hovered, setHovered] = useState(false);
    const color = hovered ? "hotpink" : "orange";
    const printerRef = useRef();

    return (
        <PrinterModel
            ref={printerRef}
            position={[-2, 1.5, 0]}
            scale={hovered ? 0.12 : 0.1}
            onClick={() => {
                if (printerRef.current) {
                    const currentPosition = printerRef.current.position;
                    console.log("Printer Clicked - Setting target to:", currentPosition);
                    setTargetPosition([currentPosition.x, currentPosition.y, currentPosition.z]);
                    setDroneClicked(false);
                }
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            color={color}
        />
    );
};

const FPVDroneButton = ({ setTargetPosition, setDroneClicked, droneClicked, setActivePage }) => {
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
                        setTargetPosition([currentPosition.x, currentPosition.y, currentPosition.z]);
                    }
                    setDroneClicked(true);
                }}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 4 : 3.5}
                color={color}
            />

            {/* Wrap TextOptions in a group */}
            <group visible={droneClicked}>
                <TextOption
                    position={[
                        droneRef.current ? droneRef.current.position.x : 1,
                        droneRef.current ? droneRef.current.position.y - 0.7 : 0.8,
                        droneRef.current ? droneRef.current.position.z + 0.5 : 0.5,
                    ]}
                    text="All equipment"
                    font={font}
                    onClick={() => setActivePage('equipment')}
                    depth={0.1}
                />
                <TextOption
                    position={[
                        droneRef.current ? droneRef.current.position.x : 1,
                        droneRef.current ? droneRef.current.position.y - 1.0 : 0.5,
                        droneRef.current ? droneRef.current.position.z + 0.5 : 0.5,
                    ]}
                    text="Video journey"
                    font={font}
                    onClick={() => setActivePage('video')}
                    depth={0.1}
                />
                <TextOption
                    position={[
                        droneRef.current ? droneRef.current.position.x : 1,
                        droneRef.current ? droneRef.current.position.y - 1.3 : 0.2,
                        droneRef.current ? droneRef.current.position.z + 0.5 : 0.5,
                    ]}
                    text="Latest flying skills"
                    font={font}
                    onClick={() => setActivePage('skills')}
                    depth={0.1}
                />
            </group>
        </>
    );
};


const HomePage = () => {
  const [targetPosition, setTargetPosition] = useState([0, 0, 0]);
  const [droneClicked, setDroneClicked] = useState(false);
  const [activePage, setActivePage] = useState('home'); // 'home', 'equipment', 'video', 'skills'

    const handleResetCamera = () => {
        setTargetPosition([0, 0, 0]);
        setDroneClicked(false);
    };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas style={{position: 'absolute', top: 0, left: 0}}>
        <CameraControls targetPosition={[...targetPosition]} onResetCamera={handleResetCamera} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={1} />
        <Background />
        <PrinterButton setTargetPosition={setTargetPosition} setDroneClicked={setDroneClicked}/>
        <FPVDroneButton setTargetPosition={setTargetPosition} setDroneClicked={setDroneClicked} droneClicked={droneClicked} setActivePage={setActivePage} />
      </Canvas>

      {/* Content Area with smoother transition */}
      <div style={{
          position: 'absolute',
          top: '100vh',
          left: 0,
          width: '100vw',
          transition: 'opacity 0.5s ease-in-out', // CSS Transition
          opacity: activePage !== 'home' ? 1 : 0, // Show/hide with opacity
          pointerEvents: activePage !== 'home' ? 'auto' : 'none' // Disable clicks when hidden
        }}>
        {activePage === 'equipment' && <div><h2>Equipment Page</h2><p>Information about my 3D printer and FPV drone will go here.</p></div>}
        {activePage === 'video' && <div><h2>Video Journey</h2><p>Videos of my FPV drone flights will be displayed here.</p></div>}
        {activePage === 'skills' && <div><h2>Latest Flying Skills</h2><p>Information and demonstrations of my flying skills will go here.</p></div>}
      </div>

      {/* Home Page Content (Visible only when activePage is 'home') */}
      <div style={{
          position: 'absolute',
          top: '100vh',
          left: 0,
          width: '100vw',
          transition: 'opacity 0.5s ease-in-out',
          opacity: activePage === 'home' ? 1 : 0,
          pointerEvents: activePage === 'home' ? 'auto' : 'none'
      }}>
        <h2>Welcome to the Home Page!</h2>
      </div>
    </div>
  );
};

export default HomePage;
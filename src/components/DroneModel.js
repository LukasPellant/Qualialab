// src/components/DroneModel.js
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const DroneModel = React.forwardRef(({ scale = 1, ...props }, ref) => {
  const { scene } = useGLTF('/models/drone/drone.glb');
  const boxRef = useRef();

  // Use useEffect to center the bounding box *after* the model loads
  useEffect(() => {
    if (scene && boxRef.current) {
      const modelBox = new THREE.Box3().setFromObject(scene);
      const center = modelBox.getCenter(new THREE.Vector3());

      // Offset the bounding box's position to center it
      boxRef.current.position.copy(center);
      boxRef.current.position.y -=0.05; // i noticed that model in the center is a little bit higher so i pushed down the box
      // Optional: You could also adjust the box size here if needed, based on modelBox.getSize()
    }
  }, [scene]);


  return (
    <group ref={ref} {...props}>
      <primitive object={scene} scale={scale} />

      {/*  Visible Bounding Box (for debugging) */}
      <mesh
        ref={boxRef}
        //visible={true} // Make it visible for now!
        onClick={(event) => {
          event.stopPropagation();
          props.onClick(event);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          props.onPointerOver(event);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          props.onPointerOut(event);
        }}
      >
        <boxGeometry args={[2.2, 1, 1.6]} /> {/* Adjust size as needed */}
        <meshBasicMaterial transparent opacity={0} /> {/*  <--- THIS LINE */}
      </mesh>
    </group>
  );
});

export default DroneModel;
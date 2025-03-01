import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
      // Set initial camera position
      camera.position.set(2, 2, 5);
      camera.lookAt(new THREE.Vector3(2, 0, 0));
  }, [camera]); // Run only once when the camera changes

  useFrame(() => {
    // Update the OrbitControls (this is important!)
    controls.current?.update();
     camera.lookAt(new THREE.Vector3(2, 0, 0));
  });

  return (
    <OrbitControls ref={controls} args={[camera, gl.domElement]} />
  );
};

export default CameraControls;
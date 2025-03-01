// src/components/DroneModel.js
import React from 'react';
import { useGLTF } from '@react-three/drei';

const DroneModel = ({ ...props }) => {
  const { scene } = useGLTF('/models/drone/drone.gltf'); // Adjust the path!
  return <primitive object={scene} {...props} scale={5} />;
};

export default DroneModel;
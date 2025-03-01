import React from 'react';
import { useGLTF } from '@react-three/drei';

const DroneModel = React.forwardRef(({ scale = 5, ...props }, ref) => { // Add scale prop with default value
  const { scene } = useGLTF('/models/drone/drone.glb');
  return <primitive object={scene} ref={ref} {...props} scale={scale} />; // Use scale prop
});

export default DroneModel;
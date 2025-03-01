import React from 'react';
import { useGLTF } from '@react-three/drei';

const PrinterModel = ({ ...props }) => {
  const { scene } = useGLTF('/models//printer/printer.gltf'); // Correct path!
  return <primitive object={scene} {...props} />;
};

export default PrinterModel;
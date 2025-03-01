// src/components/SimpleCube.js
import React from 'react';

const SimpleCube = ({ position = [0, 0, 0], color = 'red', ...props }) => {
  return (
    <mesh position={position} {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default SimpleCube;
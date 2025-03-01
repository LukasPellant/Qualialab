// src/components/TextOption.js
import React from 'react';
import { Text, Billboard } from '@react-three/drei'; // Import Billboard

const TextOption = ({ text, position, onClick, font, depth }) => {
  return (
    <Billboard position={position}> {/* Wrap with Billboard */}
      <Text
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font={font}
        depth={0.1}
        onClick={onClick}
      >
        {text}
      </Text>
    </Billboard>
  );
};

export default TextOption;
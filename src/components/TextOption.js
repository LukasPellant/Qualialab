// src/components/TextOption.js
import React from 'react';
import { Text, Billboard } from '@react-three/drei';

const TextOption = ({ text, position, onClick, font, depth }) => {
  return (
    <Billboard position={position}>
      <Text
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font={font}
        depth={depth}
        onClick={onClick} // onClick is now passed directly
      >
        {text}
      </Text>
    </Billboard>
  );
};

export default TextOption;
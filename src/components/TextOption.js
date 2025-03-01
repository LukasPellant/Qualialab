import React from 'react';
import { Text, Billboard } from '@react-three/drei';

const TextOption = React.forwardRef(({ text, position, onClick, font, depth }, ref) => {
  return (
    <Billboard ref={ref} position={position}>
      <Text
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        font={font}
        depth={depth}
        onClick={onClick}
      >
        {text}
      </Text>
    </Billboard>
  );
});

export default TextOption;
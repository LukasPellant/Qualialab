import React from 'react';
import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber'; // Import useThree

const TextOption = ({ text, position, onClick, font, depth }) => {
  const { scene } = useThree(); // Get the scene

  // Only render the Text if the scene is available
  if (!scene) {
    return null; // Or a placeholder if you prefer
  }

  return (
    <Text
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
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
  );
};

export default TextOption;
import { Text } from '@react-three/drei';

export default function House({ position = [0, 0, 0] as [number, number, number] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 1, 1.6]} />
        <meshStandardMaterial color="#c96" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[1, 0.8, 4]} />
        <meshStandardMaterial color="#933" />
      </mesh>
      <Text position={[0, 1.5, 0]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
        +5 cap
      </Text>
    </group>
  );
}



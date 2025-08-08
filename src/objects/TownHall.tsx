import { Text } from '@react-three/drei';

export default function TownHall({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.2, 2.2]} />
        <meshStandardMaterial color="#bba26a" />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.6, 8]} />
        <meshStandardMaterial color="#8b7" />
      </mesh>
      <Text position={[0, 1.8, 0]} fontSize={0.28} color="white" anchorX="center" anchorY="middle">
        +10 cap
      </Text>
    </group>
  );
}



import { Text } from '@react-three/drei';
import useSandboxStore from '@/stores/useSandboxStore';

export default function Warehouse({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const storage = object?.storage;
  const storageMax = object?.storageMax;
  
  const totalStored = storage ? Object.values(storage).reduce((sum, val) => sum + (val || 0), 0) : 0;
  const totalMax = storageMax ? Object.values(storageMax).reduce((sum, val) => sum + (val || 0), 0) : 0;

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh castShadow>
        <boxGeometry args={[3.5, 2.0, 3.5]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[3.0, 0.2, 3.0]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <Text position={[0, 2.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        Storage: {totalStored}/{totalMax}
      </Text>
    </group>
  );
}

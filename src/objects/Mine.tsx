import useSandboxStore from '@/stores/useSandboxStore';
import { Text } from '@react-three/drei';

export default function Mine({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const assigned = object?.assignedWorkers?.length ?? 0;
  const capacity = object?.workerCapacity ?? 0;
  // Simple placeholder model to avoid external loading issues
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.8, 1, 1.2, 8]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {assigned}/{capacity}
      </Text>
    </group>
  );
}
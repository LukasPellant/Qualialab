import useSandboxStore from '@/stores/useSandboxStore';
import { Text } from '@react-three/drei';

export function Forest({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const stock = object?.stock?.wood ?? 300;
  const assigned = object?.assignedWorkers?.length ?? 0;
  const capacity = object?.workerCapacity ?? 0;
  const scale = stock > 0 ? 1 : 0.6; // shrink when depleted
  const color = stock > 0 ? '#228B22' : '#6b8e23';
  return (
    <group position={position} scale={scale}>
      <mesh castShadow>
        <coneGeometry args={[1, 2, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[0, 1.6, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {assigned}/{capacity}
      </Text>
    </group>
  );
}
import { Text } from '@react-three/drei';
import useSandboxStore from '@/stores/useSandboxStore';

export default function Market({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const { setOpenMarketId } = useSandboxStore();

  return (
    <group position={[position[0], 0, position[2]]} onClick={(e) => { e.stopPropagation(); setOpenMarketId(id || 'market1'); }}>
      <mesh castShadow>
        <boxGeometry args={[4.0, 1.5, 4.0]} />
        <meshStandardMaterial color="#DAA520" />
      </mesh>
      {/* Market stalls */}
      <mesh position={[1.2, 0.8, 1.2]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <mesh position={[-1.2, 0.8, 1.2]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <mesh position={[1.2, 0.8, -1.2]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <mesh position={[-1.2, 0.8, -1.2]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#D2691E" />
      </mesh>
      <Text position={[0, 2.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        Market (click)
      </Text>
    </group>
  );
}

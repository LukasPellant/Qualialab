import { Text } from '@react-three/drei';

import useSandboxStore from '@/stores/useSandboxStore';

export default function TownHall({ position = [0, 0, 0] as [number, number, number], id = 'town1' }: { position?: [number, number, number]; id?: string }) {
  const { setOpenTownHallId } = useSandboxStore();
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); setOpenTownHallId(id); }}>
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.2, 2.2]} />
        <meshStandardMaterial color="#bba26a" />
      </mesh>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.6, 8]} />
        <meshStandardMaterial color="#8b7" />
      </mesh>
      <Text position={[0, 1.8, 0]} fontSize={0.28} color="white" anchorX="center" anchorY="middle">
        +10 cap (click)
      </Text>
    </group>
  );
}



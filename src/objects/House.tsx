import { Text } from '@react-three/drei';
import useSandboxStore from '@/stores/useSandboxStore';

export default function House({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const { setSelectedBuildingId } = useSandboxStore();
  const upgrades = object?.upgrades || [];
  
  const hasTavern = upgrades.includes('house:tavern');
  const hasShrine = upgrades.includes('house:shrine');
  
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); if (id) setSelectedBuildingId(id); }}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 1, 1.6]} />
        <meshStandardMaterial color="#c96" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[1, 0.8, 4]} />
        <meshStandardMaterial color="#933" />
      </mesh>

      {/* Tavern upgrade - větší hospoda s cedulí */}
      {hasTavern && (
        <group position={[2.2, 0, 0]}>
          {/* Tavern building */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[1.8, 1.2, 1.8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Střecha */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <coneGeometry args={[1.2, 0.6, 4]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          {/* Cedule */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow>
            <boxGeometry args={[1.2, 0.8, 0.1]} />
            <meshStandardMaterial color="#DAA520" />
          </mesh>
          {/* Sudoviny u vchodu */}
          <mesh position={[1.2, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.6, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[1.2, 0.3, 0.6]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.6, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <Text position={[0, 1.8, 0.1]} fontSize={0.2} color="#8B0000" anchorX="center" anchorY="middle">
            🍺 INN
          </Text>
        </group>
      )}

      {/* Shrine upgrade - větší svatyně */}
      {hasShrine && (
        <group position={[-2, 0, 0]}>
          {/* Podstavec */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.2, 8]} />
            <meshStandardMaterial color="#F5F5DC" />
          </mesh>
          {/* Sloup */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 1.8, 8]} />
            <meshStandardMaterial color="#F5F5DC" />
          </mesh>
          {/* Velký křížek */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow>
            <boxGeometry args={[0.5, 0.1, 0.1]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
          {/* Světelný efekt */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#FFFFE0" transparent opacity={0.3} emissive="#FFFFE0" emissiveIntensity={0.2} />
          </mesh>
          {/* Dekorativní květiny */}
          <mesh position={[0.5, 0.15, 0.5]} castShadow>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#FF69B4" />
          </mesh>
          <mesh position={[-0.5, 0.15, 0.5]} castShadow>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshStandardMaterial color="#FF1493" />
          </mesh>
        </group>
      )}

      <Text position={[0, 1.5, 0]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
        +5 cap (click)
      </Text>
      
      {/* Status upgradu */}
      {(hasTavern || hasShrine) && (
        <Text position={[0, 2.0, 0]} fontSize={0.18} color="yellow" anchorX="center" anchorY="middle">
          {hasTavern && hasShrine ? 'Tavern+Shrine' : hasTavern ? 'Tavern (pop growth)' : 'Shrine (-10% food)'}
        </Text>
      )}
    </group>
  );
}



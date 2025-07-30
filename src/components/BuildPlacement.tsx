import useSandboxStore from '@/stores/useSandboxStore';
import { useThree } from '@react-three/fiber';
import { nanoid } from 'nanoid';
import { setBlocked, worldToGrid } from '@/utils/grid';
import { Box } from '@react-three/drei';

export default function BuildPlacement() {
  const { selectedBuildingType, setSelectedBuildingType, addObject } = useSandboxStore();

  const handleClick = (e: any) => {
    if (!selectedBuildingType) return;
    e.preventDefault();
    const [x, , z] = e.point.toArray().map(Math.round);
    addObject({ id: nanoid(), type: selectedBuildingType, position: [x, 0.5, z] });
    setBlocked(worldToGrid(x), worldToGrid(z));
    setSelectedBuildingType(null);
  };

  return (
    <mesh
      onClick={handleClick}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={!!selectedBuildingType} // Only visible when a building is selected
    >
      <planeGeometry args={[64, 64]} />
      <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
    </mesh>
  );
}
import { useThree } from '@react-three/fiber';
import type { GameObject } from '../stores/useSandboxStore';

interface BuildMenu3DProps {
  onBuild: (type: GameObject['type'], position: [number, number, number]) => void;
  selectedBuildingType: GameObject['type'];
}

export default function BuildMenu3D({ onBuild, selectedBuildingType }: BuildMenu3DProps) {
  const { camera, scene } = useThree();
  void camera;
  void scene;

  const handleClick = (e: any) => {
    e.preventDefault();
    const [x, , z] = e.point.toArray().map(Math.round);
    onBuild(selectedBuildingType, [x, 0.5, z]);
  };

  return (
    <mesh
      onClick={handleClick}
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      visible={false} // Set back to false after debugging
    >
      <planeGeometry args={[64, 64]} />
    </mesh>
  );
}

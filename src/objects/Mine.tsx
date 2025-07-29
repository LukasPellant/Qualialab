import type { ThreeElements } from '@react-three/fiber';

export function Mine(props: ThreeElements['mesh']) {
  return (
    <mesh {...props} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

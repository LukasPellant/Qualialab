import type { ThreeElements } from '@react-three/fiber';

export function Mountain(props: ThreeElements['mesh']) {
  return (
    <mesh {...props} castShadow>
      <coneGeometry args={[1, 2, 6]} />
      <meshStandardMaterial color="brown" />
    </mesh>
  );
}

export function Forest({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <coneGeometry args={[1, 2, 6]} />
      <meshStandardMaterial color="#228B22" />
    </mesh>
  );
}
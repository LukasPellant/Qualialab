export function Building({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
}
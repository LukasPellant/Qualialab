export function Farm({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[2, 0.1, 2]} />
      <meshStandardMaterial color="#A0522D" />
    </mesh>
  );
}
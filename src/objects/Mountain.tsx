export default function Mountain(props: any) {
  // Simple placeholder mountain made of stacked cones/rocks
  return (
    <group {...props}>
      <mesh castShadow>
        <coneGeometry args={[1.4, 2.2, 8]} />
        <meshStandardMaterial color="#777" />
      </mesh>
      <mesh position={[0.4, 0.7, -0.2]} castShadow>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      <mesh position={[-0.5, 0.4, 0.3]} castShadow>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#5f5f5f" />
      </mesh>
    </group>
  );
}
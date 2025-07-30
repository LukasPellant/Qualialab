import { useGLTF } from '@react-three/drei';

export default function Mountain(props: any) {
  // Replace with your own model
  const { nodes, materials } = useGLTF('/path/to/your/mountain.gltf');
  return (
    <group {...props} dispose={null}>
      <mesh geometry={(nodes as any).Mountain.geometry} material={materials.Rock} />
    </group>
  );
}
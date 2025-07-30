import { useGLTF } from '@react-three/drei';

export default function Mine(props: any) {
  // Replace with your own model
  const { nodes, materials } = useGLTF('/path/to/your/mine.gltf');
  return (
    <group {...props} dispose={null}>
      <mesh geometry={(nodes as any).Mine.geometry} material={materials.Stone} />
    </group>
  );
}
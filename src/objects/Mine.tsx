import useSandboxStore from '@/stores/useSandboxStore';
import { Text, useFBX } from '@react-three/drei';
import { useMemo, useLayoutEffect, useState } from 'react';
import { Box3, Mesh } from 'three';
import { SkeletonUtils } from 'three-stdlib';

export default function Mine({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const assigned = object?.assignedWorkers?.length ?? 0;
  const capacity = object?.workerCapacity ?? 0;
  const fbx = useFBX('/models/mine/Create_a_low_poly_MIN_0809100653_texture.fbx');
  const model = useMemo(() => (fbx ? SkeletonUtils.clone(fbx) : null), [fbx]);
  const [offsetY, setOffsetY] = useState(0);
  
  useLayoutEffect(() => {
    if (!model) return;
    const SCALE = 0.03;
    model.scale.set(SCALE, SCALE, SCALE);
    model.traverse((child) => {
      const maybeMesh = child as unknown as Mesh;
      if ((maybeMesh as any).isMesh) {
        maybeMesh.castShadow = true;
        maybeMesh.receiveShadow = true;
        const mat: any = (maybeMesh as any).material;
        const applyMat = (m: any) => {
          if (!m) return;
          if ('metalness' in m) m.metalness = 0;
          if ('roughness' in m) m.roughness = 0.9;
          if ('envMapIntensity' in m) m.envMapIntensity = 0;
          if ('specular' in m) m.specular?.set?.(0x000000);
          m.needsUpdate = true;
        };
        if (Array.isArray(mat)) mat.forEach(applyMat); else applyMat(mat);
      }
    });
    // Calculate ground offset after all setup
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    setOffsetY(-box.min.y);
  }, [model]);

  return (
    <group position={[position[0], 0, position[2]]}>
      <group position={[0, offsetY, 0]}>
        {model ? (
          <primitive object={model} />
        ) : (
          <>
            <mesh castShadow>
              <cylinderGeometry args={[0.8, 1, 1.2, 8]} />
              <meshStandardMaterial color="#555" />
            </mesh>
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[1.2, 0.2, 1.2]} />
              <meshStandardMaterial color="#333" />
            </mesh>
          </>
        )}
      </group>
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {assigned}/{capacity}
      </Text>
    </group>
  );
}
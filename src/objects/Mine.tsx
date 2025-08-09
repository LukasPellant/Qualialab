import useSandboxStore from '@/stores/useSandboxStore';
import { Text, useFBX } from '@react-three/drei';
import { useMemo, useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box3, Mesh, Vector3 } from 'three';
import { SkeletonUtils } from 'three-stdlib';

export default function Mine({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const assigned = object?.assignedWorkers?.length ?? 0;
  const capacity = object?.workerCapacity ?? 0;
  const fbx = useFBX('/models/mine/Create_a_low_poly_MIN_0809100653_texture.fbx');
  const model = useMemo(() => (fbx ? SkeletonUtils.clone(fbx) : null), [fbx]);
  const settledRef = useRef(false);
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
    // Auto-drop to ground
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    const size = new Vector3();
    const min = box.min;
    box.getSize(size);
    model.position.y = -min.y + 0.02;
  }, [model]);

  useFrame(() => {
    if (!model) return;
    if (settledRef.current) return;
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    const min = box.min;
    model.position.y = -min.y + 0.02;
    settledRef.current = true;
  });

  return (
    <group position={[position[0], 0, position[2]]}>
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
      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {assigned}/{capacity}
      </Text>
    </group>
  );
}
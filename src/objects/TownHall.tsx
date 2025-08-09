import { Text, useFBX } from '@react-three/drei';
import { useMemo, useLayoutEffect, useState } from 'react';
import { SkeletonUtils } from 'three-stdlib';
import { Box3, Mesh } from 'three';

import useSandboxStore from '@/stores/useSandboxStore';

export default function TownHall({ position = [0, 0, 0] as [number, number, number], id = 'town1' }: { position?: [number, number, number]; id?: string }) {
  const { setOpenTownHallId } = useSandboxStore();
  const fbx = useFBX('/models/townhall/Create_a_central_TOWN_0809095307_texture.fbx');
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
    <group position={[position[0], 0, position[2]]} onClick={(e) => { e.stopPropagation(); setOpenTownHallId(id); }}>
      <group position={[0, offsetY, 0]}>
        {model ? (
          <primitive object={model} scale={0.03} />
        ) : (
          <>
            <mesh castShadow>
              <boxGeometry args={[2.2, 1.2, 2.2]} />
              <meshStandardMaterial color="#bba26a" />
            </mesh>
            <mesh position={[0, 1.0, 0]} castShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.6, 8]} />
              <meshStandardMaterial color="#8b7" />
            </mesh>
          </>
        )}
      </group>
      <Text position={[0, 1.8, 0]} fontSize={0.28} color="white" anchorX="center" anchorY="middle">
        +10 cap (click)
      </Text>
    </group>
  );
}



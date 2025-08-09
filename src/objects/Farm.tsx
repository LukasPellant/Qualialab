import useSandboxStore from '@/stores/useSandboxStore';
import { Text, useFBX } from '@react-three/drei';
import { useMemo, useLayoutEffect, useState } from 'react';
import { Box3, Mesh } from 'three';
import { SkeletonUtils } from 'three-stdlib';

export function Farm({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const { setSelectedBuildingId } = useSandboxStore();
  const assigned = object?.assignedWorkers?.length ?? 0;
  const capacity = object?.workerCapacity ?? 0;
  const upgrades = object?.upgrades || [];
  
  const hasFields = upgrades.includes('farm:fields');
  const hasMill = upgrades.includes('farm:mill');
  const fbx = useFBX('/models/farm/Design_a_simple_low_p_0809095827_texture.fbx');
  const model = useMemo(() => (fbx ? SkeletonUtils.clone(fbx) : null), [fbx]);
  const [offsetY, setOffsetY] = useState(0);
  
  useLayoutEffect(() => {
    if (!model) return;
    const SCALE = 0.03;
    model.scale.set(SCALE, SCALE, SCALE);
    // Shadows + material tweaks to remove shiny highlights
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
    <group position={[position[0], 0, position[2]]} onClick={(e) => { e.stopPropagation(); if (id) setSelectedBuildingId(id); }}>
      <group position={[0, offsetY, 0]}>
        {model ? (
          <primitive object={model} />
        ) : (
          <mesh castShadow>
            <boxGeometry args={[2, 0.1, 2]} />
            <meshStandardMaterial color="#A0522D" />
          </mesh>
        )}
      </group>

      {/* Fields upgrade - větší pole s plotem */}
      {hasFields && (
        <group position={[2.8, 0, 0]}>
          {/* Hlavní pole */}
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[2.2, 0.1, 2.2]} />
            <meshStandardMaterial color="#9ACD32" />
          </mesh>
          {/* Plůtek kolem */}
          <mesh position={[1.2, 0.3, 0]} castShadow>
            <boxGeometry args={[0.05, 0.6, 2.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[-1.2, 0.3, 0]} castShadow>
            <boxGeometry args={[0.05, 0.6, 2.4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0.3, 1.2]} castShadow>
            <boxGeometry args={[2.4, 0.6, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 0.3, -1.2]} castShadow>
            <boxGeometry args={[2.4, 0.6, 0.05]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      )}

      {/* Mill upgrade - větší větrný mlýn */}
      {hasMill && (
        <group position={[-3, 0, 0]}>
          {/* Základ mlýna */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.5, 1.6, 8]} />
            <meshStandardMaterial color="#D2691E" />
          </mesh>
          {/* Věž */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.4, 1.2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Lopatky mlýna */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <boxGeometry args={[2.5, 0.1, 0.15]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          <mesh position={[0, 2.2, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <boxGeometry args={[2.5, 0.1, 0.15]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          {/* Střecha */}
          <mesh position={[0, 2.7, 0]} castShadow>
            <coneGeometry args={[0.4, 0.5, 8]} />
            <meshStandardMaterial color="#8B0000" />
          </mesh>
        </group>
      )}

      <Text position={[0, 1.6, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {assigned}/{capacity} (click)
      </Text>
      
      {/* Status upgradu */}
      {(hasFields || hasMill) && (
        <Text position={[0, 2.1, 0]} fontSize={0.2} color="lightgreen" anchorX="center" anchorY="middle">
          {hasFields && hasMill ? 'Fields+Mill' : hasFields ? 'Fields (+1 slot, +25% yield)' : 'Mill (-20% time, +0.5 food/min)'}
        </Text>
      )}
    </group>
  );
}
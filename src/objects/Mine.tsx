import useSandboxStore from '@/stores/useSandboxStore';
import { Text, useFBX } from '@react-three/drei';
import { useMemo, useLayoutEffect, useState } from 'react';
import { Box3, Mesh } from 'three';
import { SkeletonUtils } from 'three-stdlib';

export default function Mine({ position = [0, 0, 0] as [number, number, number], id }: { position?: [number, number, number]; id?: string }) {
  const object = useSandboxStore((s) => (id ? s.objects.find((o) => o.id === id) : undefined));
  const { setSelectedBuildingId } = useSandboxStore();
  const assigned = object?.assignedWorkers?.length ?? 0;
  const capacity = object?.workerCapacity ?? 0;
  const upgrades = object?.upgrades || [];
  
  const hasShaft = upgrades.includes('mine:shaft');
  const hasSmelter = upgrades.includes('mine:smelter');
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
    <group position={[position[0], 0, position[2]]} onClick={(e) => { e.stopPropagation(); if (id) setSelectedBuildingId(id); }}>
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

      {/* Shaft upgrade - větší těžební věž */}
      {hasShaft && (
        <group position={[2.5, 0, 0]}>
          {/* Hlubší šachta */}
          <mesh position={[0, -0.3, 0]} castShadow>
            <cylinderGeometry args={[0.8, 1.2, 1.5, 8]} />
            <meshStandardMaterial color="#2F4F4F" />
          </mesh>
          {/* Těžební věž */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.3, 2.4, 0.3]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.3, 2]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {/* Kladka nahoře */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.2, 8]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
          {/* Lano */}
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
      )}

      {/* Smelter upgrade - větší tavicí pec s komínem */}
      {hasSmelter && (
        <group position={[-2.5, 0, 0]}>
          {/* Hlavní pec */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[1.8, 1.6, 1.8]} />
            <meshStandardMaterial color="#8B0000" />
          </mesh>
          {/* Komín */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshStandardMaterial color="#2F2F2F" />
          </mesh>
          {/* Dvířka pece */}
          <mesh position={[0, 0.5, 0.95]} castShadow>
            <boxGeometry args={[0.8, 0.8, 0.05]} />
            <meshStandardMaterial color="#1C1C1C" />
          </mesh>
          {/* Oheň efekty - více plamenů */}
          <mesh position={[0, 0.5, 1.1]} castShadow>
            <coneGeometry args={[0.4, 0.8, 6]} />
            <meshStandardMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.3, 0.6, 1.1]} castShadow>
            <coneGeometry args={[0.2, 0.6, 6]} />
            <meshStandardMaterial color="#FF6347" emissive="#FF6347" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[-0.3, 0.4, 1.1]} castShadow>
            <coneGeometry args={[0.25, 0.5, 6]} />
            <meshStandardMaterial color="#FF8C00" emissive="#FF8C00" emissiveIntensity={0.3} />
          </mesh>
          {/* Kouř z komína */}
          <mesh position={[0, 3.5, 0]} castShadow>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color="#696969" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      <Text position={[0, 1.2, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
        {assigned}/{capacity} (click)
      </Text>
      
      {/* Status upgradu */}
      {(hasShaft || hasSmelter) && (
        <Text position={[0, 1.7, 0]} fontSize={0.2} color="orange" anchorX="center" anchorY="middle">
          {hasShaft && hasSmelter ? 'Shaft+Smelter' : hasShaft ? 'Shaft (+30% yield, +10% time)' : 'Smelter (+1 slot, stone→gold)'}
        </Text>
      )}
    </group>
  );
}
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useMemo, useLayoutEffect } from 'react';
import { Group, Mesh, Box3 } from 'three';
import { useFBX } from '@react-three/drei';
import useSandboxStore from '../stores/useSandboxStore';
import { gridToWorld } from '@/utils/grid';
import { SkeletonUtils } from 'three-stdlib';

interface WorkerProps {
  id: string;
  speed?: number;
}

export function Worker({ id }: WorkerProps) {
  const ref = useRef<Group>(null);
  const workerObject = useSandboxStore((state) => state.objects.find((obj) => obj.id === id));
  const currentPosition: [number, number, number] = workerObject ? [workerObject.position[0], 0, workerObject.position[2]] : [0, 0, 0];
  const isVisible = workerObject ? workerObject.state !== 'working' : true;
  const fbx = useFBX('/models/worker/Create_a_humanoid_WOR_0809081906_texture.fbx');
  const model = useMemo(() => (fbx ? SkeletonUtils.clone(fbx) : null), [fbx]);
  const prevPosRef = useRef<[number, number, number] | null>(null);

  // Reset offsetX when the worker's position from the store changes (i.e., store resets)
  useEffect(() => {
    // When store position updates, reflect it directly on mesh
    if (ref.current) {
      ref.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
    }
  }, [currentPosition]);

  // Ensure FBX meshes cast/receive shadow once loaded and remove shiny highlights
  useLayoutEffect(() => {
    if (!model) return;
    const SCALE = 0.01;
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
    // Snap model so its lowest point rests at y=0 within the group
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model);
    const min = box.min.clone();
    model.position.y = -min.y + 0.02;
  }, [model]);

  // jednoduchá animační smyčka: pouze rotace a snap pozice
  useFrame(() => {
    if (!ref.current) return;
    // Snap position directly from store
    ref.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);

    // Rotate towards movement direction if the worker is moving
    const path = workerObject?.path;
    let dirX = 0;
    let dirZ = 0;
    if (workerObject?.state === 'moving' && path && path.length > 0) {
      const [gx, gz] = path[0];
      const tx = gridToWorld(gx);
      const tz = gridToWorld(gz);
      dirX = tx - currentPosition[0];
      dirZ = tz - currentPosition[2];
    } else if (prevPosRef.current) {
      dirX = currentPosition[0] - prevPosRef.current[0];
      dirZ = currentPosition[2] - prevPosRef.current[2];
    }
    prevPosRef.current = [...currentPosition];

    const len = Math.hypot(dirX, dirZ);
    if (len > 1e-4) {
      const desiredYaw = Math.atan2(dirX, dirZ); // face along +Z
      const currentYaw = ref.current.rotation.y;
      // shortest signed angle difference between currentYaw and desiredYaw
      const delta = desiredYaw - currentYaw;
      const deltaYaw = Math.atan2(Math.sin(delta), Math.cos(delta));
      ref.current.rotation.y = currentYaw + deltaYaw * 0.25;
    }
  });

  return (
    <group ref={ref} position={currentPosition} visible={isVisible}>
      {/* FBX models are often authored in centimeters; scale down to meters */}
      {model && <primitive object={model} scale={0.01} />}
    </group>
  );
}
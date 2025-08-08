import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { Mesh } from 'three';
import useSandboxStore from '../stores/useSandboxStore';

interface WorkerProps {
  id: string;
  speed?: number;
}

export function Worker({ id }: WorkerProps) {
  const ref = useRef<Mesh>(null);
  const objects = useSandboxStore((state) => state.objects);

  const workerObject = objects.find((obj) => obj.id === id);
  const currentPosition: [number, number, number] = workerObject ? workerObject.position : [0, 0.5, 0];
  const isVisible = workerObject ? workerObject.state !== 'working' : true;

  // Reset offsetX when the worker's position from the store changes (i.e., store resets)
  useEffect(() => {
    // When store position updates, reflect it directly on mesh
    if (ref.current) {
      ref.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
    }
  }, [currentPosition]);

  // jednoduchá animační smyčka
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.01; // placeholder „života“
    // position is driven by systems; mesh follows store state
    ref.current.position.set(currentPosition[0], currentPosition[1], currentPosition[2]);
  });

  return (
    <mesh ref={ref} position={currentPosition} castShadow visible={isVisible}>
      <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
      <meshStandardMaterial />
    </mesh>
  );
}
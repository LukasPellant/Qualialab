import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Mesh } from 'three';
import useSandboxStore from '../stores/useSandboxStore';

interface WorkerProps {
  id: string;
  speed?: number;
}

export function Worker({ id, speed = 0.01 }: WorkerProps) {
  const ref = useRef<Mesh>(null);
  const [offsetX, setOffsetX] = useState(0);
  const objects = useSandboxStore((state) => state.objects);

  const workerObject = objects.find((obj) => obj.id === id);
  const currentPosition = workerObject ? workerObject.position : [0, 0.5, 0];

  // Reset offsetX when the worker's position from the store changes (i.e., store resets)
  useEffect(() => {
    setOffsetX(0);
  }, [currentPosition]);

  // jednoduchá animační smyčka
  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.01; // placeholder „života“
    setOffsetX(prev => prev + speed); // test pohybu
  });

  return (
    <mesh ref={ref} position={[currentPosition[0] + offsetX, currentPosition[1], currentPosition[2]]} castShadow>
      <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
      <meshStandardMaterial />
    </mesh>
  );
}
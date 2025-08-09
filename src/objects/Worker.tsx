import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import { Group, Vector3 } from 'three';
import useSandboxStore from '../stores/useSandboxStore';
import { gridToWorld } from '@/utils/grid';

interface WorkerProps {
  id: string;
  speed?: number;
}

export function Worker({ id }: WorkerProps) {
  const ref = useRef<Group>(null);
  
  // Simple selector without creating new objects each time
  const workerObject = useSandboxStore((state) => state.objects.find((obj) => obj.id === id && obj.type === 'worker'));
  
  // Track previous values to detect changes without causing re-renders
  const prevWorkerDataRef = useRef<any>(null);
  const [workerData, setWorkerData] = useState<any>(null);
  
  useEffect(() => {
    if (!workerObject) {
      if (prevWorkerDataRef.current !== null) {
        setWorkerData(null);
        prevWorkerDataRef.current = null;
      }
      return;
    }
    
    const newData = {
      position: workerObject.position,
      state: workerObject.state,
      path: workerObject.path
    };
    
    // Only update if something actually changed
    const prev = prevWorkerDataRef.current;
    if (!prev || 
        prev.position[0] !== newData.position[0] ||
        prev.position[2] !== newData.position[2] ||
        prev.state !== newData.state ||
        (prev.path?.length || 0) !== (newData.path?.length || 0) ||
        (prev.path && newData.path && prev.path[0] && newData.path[0] && 
         (prev.path[0][0] !== newData.path[0][0] || prev.path[0][1] !== newData.path[0][1]))) {
      setWorkerData(newData);
      prevWorkerDataRef.current = newData;
    }
  }, [workerObject]);
  
  // Local interpolated position to avoid store updates causing FPS drops
  const [localPosition, setLocalPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const targetPositionRef = useRef<Vector3>(new Vector3(0, 0, 0));
  const lastRotationRef = useRef(0);

  // Update target position when store changes
  useEffect(() => {
    if (workerData) {
      targetPositionRef.current.set(workerData.position[0], 0, workerData.position[2]);
      // If this is initial load or teleport, snap immediately
      if (localPosition.distanceTo(targetPositionRef.current) > 5) {
        setLocalPosition(targetPositionRef.current.clone());
      }
    }
  }, [workerData?.position?.[0], workerData?.position?.[2]]);

  // No heavy FBX setup; placeholder only

  // Smooth interpolation to reduce state thrashing
  useFrame(() => {
    if (!ref.current) return;

    // Smooth interpolation to target position (reduces jitter)
    const distance = localPosition.distanceTo(targetPositionRef.current);
    if (distance > 0.01) {
      const newPos = localPosition.clone().lerp(targetPositionRef.current, 0.15);
      setLocalPosition(newPos);
      ref.current.position.copy(newPos);
    } else {
      ref.current.position.copy(targetPositionRef.current);
    }

    // Calculate rotation towards next path node (less frequent calculation)
    if (workerData?.state === 'moving' && workerData.path && workerData.path.length > 0) {
      const [gx, gz] = workerData.path[0];
      const tx = gridToWorld(gx);
      const tz = gridToWorld(gz);
      const dirX = tx - ref.current.position.x;
      const dirZ = tz - ref.current.position.z;
      const len = Math.hypot(dirX, dirZ);
      
      if (len > 0.1) {
        const desiredYaw = Math.atan2(dirX, dirZ);
        const deltaYaw = Math.atan2(Math.sin(desiredYaw - lastRotationRef.current), Math.cos(desiredYaw - lastRotationRef.current));
        lastRotationRef.current += deltaYaw * 0.1;
        ref.current.rotation.y = lastRotationRef.current;
      }
    }
  });

  return (
    <group ref={ref} visible={true}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#cccccc" metalness={0} roughness={1} />
      </mesh>
    </group>
  );
}
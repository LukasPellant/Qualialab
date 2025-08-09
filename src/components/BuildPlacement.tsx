import { useState, useCallback } from 'react';
import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';
import { nanoid } from 'nanoid';
import { setBlocked, worldToGrid } from '@/utils/grid';

export default function BuildPlacement() {
  const { selectedBuildingType, setSelectedBuildingType, addObject } = useSandboxStore();
  const [ghostPos, setGhostPos] = useState<[number, number] | null>(null); // [x, z]

  const getYOffset = useCallback((_type: string | null) => 0, []);

  const handlePointerMove = useCallback((e: any) => {
    if (!selectedBuildingType) return;
    const [x, , z] = e.point.toArray();
    setGhostPos([Math.round(x), Math.round(z)]);
  }, [selectedBuildingType]);

  const handlePointerDown = useCallback((e: any) => {
    if (!selectedBuildingType) return;
    e.stopPropagation();
    const [x, , z] = e.point.toArray().map(Math.round);
    const base: GameObject = { id: nanoid(), type: selectedBuildingType as any, position: [x, 0, z], progress: 0 } as any;
    if (selectedBuildingType === 'farm' || selectedBuildingType === 'mine') {
      (base as any).workerCapacity = 2;
      (base as any).assignedWorkers = [];
    }
    // Prevent spawning inside another building (simple AABB check with padding)
    const pad = 1.5; // conservative half-extent for larger scaled models
    const collides = useSandboxStore.getState().objects.some((o) => {
      if (o.type === 'worker' || o.type === 'mountain' || o.type === 'forest') return false;
      const [ox, , oz] = o.position;
      return Math.abs(ox - x) < pad && Math.abs(oz - z) < pad;
    });
    if (collides) return; // invalid placement
    if (selectedBuildingType === 'house') {
      // House affects population cap via ResourceSystem on next tick
    }
    addObject(base);
    setBlocked(worldToGrid(x), worldToGrid(z));
    setSelectedBuildingType(null);
    setGhostPos(null);
  }, [addObject, selectedBuildingType, setSelectedBuildingType, getYOffset]);

  // Ghost preview mesh
  const Ghost = () => {
    if (!selectedBuildingType || !ghostPos) return null;
    const [x, z] = ghostPos;
    const position: [number, number, number] = [x, 0, z];
    switch (selectedBuildingType) {
      case 'farm':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[3, 0.2, 3]} />
            <meshStandardMaterial color="#00ff00" transparent opacity={0.4} />
          </mesh>
        );
      case 'mine':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[2.5, 1.0, 2.5]} />
            <meshStandardMaterial color="#8888ff" transparent opacity={0.4} />
          </mesh>
        );
      case 'house':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[2.5, 1.6, 2.5]} />
            <meshStandardMaterial color="#ffcc99" transparent opacity={0.4} />
          </mesh>
        );
      default:
        return null;
    }
  };

  const isPlacing = !!selectedBuildingType;

  return (
    <>
      {isPlacing && <Ghost />}
      <mesh
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={isPlacing}
      >
        <planeGeometry args={[64, 64]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.1} />
      </mesh>
    </>
  );
}
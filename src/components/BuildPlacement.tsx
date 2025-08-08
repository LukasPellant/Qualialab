import { useState, useCallback } from 'react';
import useSandboxStore from '@/stores/useSandboxStore';
import { nanoid } from 'nanoid';
import { setBlocked, worldToGrid } from '@/utils/grid';

export default function BuildPlacement() {
  const { selectedBuildingType, setSelectedBuildingType, addObject } = useSandboxStore();
  const [ghostPos, setGhostPos] = useState<[number, number] | null>(null); // [x, z]

  const getYOffset = useCallback((type: string | null) => {
    switch (type) {
      case 'farm':
        return 0.05; // thin slab
      case 'mine':
        return 0.6; // cylinder height ~1.2 → center at 0.6
      case 'house':
        return 0.5; // ~1m total center at 0.5
      case 'building':
        return 1; // generic 2m height box
      default:
        return 0.01;
    }
  }, []);

  const handlePointerMove = useCallback((e: any) => {
    if (!selectedBuildingType) return;
    const [x, , z] = e.point.toArray();
    setGhostPos([Math.round(x), Math.round(z)]);
  }, [selectedBuildingType]);

  const handlePointerDown = useCallback((e: any) => {
    if (!selectedBuildingType) return;
    e.stopPropagation();
    const [x, , z] = e.point.toArray().map(Math.round);
    const y = getYOffset(selectedBuildingType);
    const base: any = { id: nanoid(), type: selectedBuildingType, position: [x, y, z], progress: 0 };
    if (selectedBuildingType === 'farm') {
      base.workerCapacity = 2;
      base.assignedWorkers = [];
    }
    if (selectedBuildingType === 'mine') {
      base.workerCapacity = 2;
      base.assignedWorkers = [];
    }
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
    const position: [number, number, number] = [x, getYOffset(selectedBuildingType), z];
    switch (selectedBuildingType) {
      case 'farm':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[2, 0.1, 2]} />
            <meshStandardMaterial color="#00ff00" transparent opacity={0.4} />
          </mesh>
        );
      case 'mine':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[1.5, 0.8, 1.5]} />
            <meshStandardMaterial color="#8888ff" transparent opacity={0.4} />
          </mesh>
        );
      case 'house':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[1.6, 1, 1.6]} />
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
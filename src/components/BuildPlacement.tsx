import { useState, useCallback } from 'react';
import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';
import { nanoid } from 'nanoid';
import { setBlocked, worldToGrid } from '@/utils/grid';
import useResourceStore from '@/stores/useResourceStore';
import { getBuildingConfig } from '@/data/buildingData';

export default function BuildPlacement() {
  const { selectedBuildingType, setSelectedBuildingType, addObject } = useSandboxStore();
  const resources = useResourceStore();
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
    
    const config = getBuildingConfig(selectedBuildingType);
    if (!config) return;
    
    const base: GameObject = { 
      id: nanoid(), 
      type: selectedBuildingType as any, 
      position: [x, 0, z], 
      progress: 0,
      jobs: { max: config.jobs, assigned: 0 },
      storage: {},
      storageMax: {},
      upgrades: []
    } as any;

    // Set up job system for production buildings
    if (selectedBuildingType === 'farm' || selectedBuildingType === 'mine' || selectedBuildingType === 'forest') {
      (base as any).workerCapacity = config.jobs;
      (base as any).assignedWorkers = [];
    }

    // Set up storage for buildings that have it
    if (config.storage > 0) {
      ['wood', 'stone', 'food', 'gold'].forEach(resource => {
        (base as any).storageMax[resource] = config.storage;
        (base as any).storage[resource] = 0;
      });
    }

    // Prevent spawning inside another building (simple AABB check with padding)
    const pad = 1.5; // conservative half-extent for larger scaled models
    const collides = useSandboxStore.getState().objects.some((o) => {
      if (o.type === 'worker' || o.type === 'mountain' || o.type === 'forest') return false;
      const [ox, , oz] = o.position;
      return Math.abs(ox - x) < pad && Math.abs(oz - z) < pad;
    });
    if (collides) return; // invalid placement

    // Check and deduct resources
    const cost = config.cost;
    const canAfford =
      (cost.wood ?? 0) <= resources.wood &&
      (cost.stone ?? 0) <= resources.stone &&
      (cost.food ?? 0) <= resources.food &&
      (cost.gold ?? 0) <= resources.gold;
    if (!canAfford) return;
    resources.addResources({
      wood: -(cost.wood ?? 0),
      stone: -(cost.stone ?? 0),
      food: -(cost.food ?? 0),
      gold: -(cost.gold ?? 0),
    } as any);
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
      case 'warehouse':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[3.5, 2.0, 3.5]} />
            <meshStandardMaterial color="#8B4513" transparent opacity={0.4} />
          </mesh>
        );
      case 'market':
        return (
          <mesh position={position} castShadow>
            <boxGeometry args={[4.0, 1.5, 4.0]} />
            <meshStandardMaterial color="#DAA520" transparent opacity={0.4} />
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
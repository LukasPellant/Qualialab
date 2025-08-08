import { create } from 'zustand';
import useResourceStore from './useResourceStore';

export type Task =
  | { type: 'gather'; resource: 'wood' | 'stone'; targetId: string }
  | { type: 'build'; blueprint: 'farm' | 'mine'; targetPos: [number, number, number] };

export interface GameObject {
  id: string;
  type: 'worker' | 'building' | 'farm' | 'forest' | 'mine' | 'mountain';
  position: [number, number, number];
  rotation?: [number, number, number];
  path?: [number, number][]; // grid coordinates [x,z]
  state?: 'idle' | 'moving' | 'working' | 'building';
  task?: Task | null;
  stock?: { wood?: number; stone?: number };
  progress?: number; // 0..1 for builds
  targetId?: string;
  timer?: number;
  workerCapacity?: number;
  assignedWorkers?: string[];
  assignedTargetId?: string | null; // only for workers
}

export interface SandboxState {
  objects: GameObject[];
  selectedBuildingType: GameObject['type'] | null;
  reset: () => void;
  setObjects: (objects: GameObject[] | ((prev: GameObject[]) => GameObject[])) => void;
  addObject: (obj: GameObject) => void;
  setSelectedBuildingType: (type: GameObject['type'] | null) => void;
}

const getInitialObjects = (): GameObject[] => [
  { id: 'w1', type: 'worker', position: [0, 0.5, 0], state: 'idle', assignedTargetId: null },
  { id: 'w2', type: 'worker', position: [1, 0.5, 0], state: 'idle', assignedTargetId: null },
  { id: 'w3', type: 'worker', position: [-1, 0.5, 0], state: 'idle', assignedTargetId: null },
  { id: 'farm1', type: 'farm', position: [-2, 0.01, -1], workerCapacity: 2, assignedWorkers: [] },
  { id: 'forest1', type: 'forest', position: [0, 0.5, -4], stock: { wood: 300 }, workerCapacity: 3, assignedWorkers: [] },
];

const useSandboxStore = create<SandboxState>((set) => ({
  objects: getInitialObjects(),
  selectedBuildingType: null,
  reset: () => {
    set({ objects: getInitialObjects() });
    useResourceStore.getState().reset();
  },
  setObjects: (objectsOrFn) =>
    set((state) => ({
      objects:
        typeof objectsOrFn === 'function'
          ? (objectsOrFn as (prev: GameObject[]) => GameObject[])(state.objects)
          : objectsOrFn,
    })),
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),
}));

export default useSandboxStore;
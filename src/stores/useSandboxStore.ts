import { create } from 'zustand';
import useResourceStore from './useResourceStore';

export interface GameObject {
  id: string;
  type: 'worker' | 'building' | 'farm' | 'forest' | 'mine' | 'mountain';
  position: [number, number, number];
  woodStock?: number;
  task?: { type: string; targetId: string; id: string };
  path?: number[][];
  state?: 'idle' | 'moving' | 'working';
  targetId?: string;
  timer?: number;
  assignedWorkerId?: string | null;
}

export interface SandboxState {
  objects: GameObject[];
  selectedBuildingType: GameObject['type'] | null;
  reset: () => void;
  setObjects: (objects: GameObject[]) => void;
  assignWorkerTask: (workerId: string, task: { type: string; targetId: string; id: string }) => void;
  addObject: (obj: GameObject) => void;
  setSelectedBuildingType: (type: GameObject['type'] | null) => void;
}

const getInitialObjects = (): GameObject[] => [
  { id: '1', type: 'worker', position: [0, 0.5, 0], state: 'idle' },
  { id: '2', type: 'worker', position: [1, 0.5, 0], state: 'idle' },
  { id: '3', type: 'worker', position: [-1, 0.5, 0], state: 'idle' },
  { id: '4', type: 'worker', position: [0, 0.5, 1], state: 'idle' },
  { id: '5', type: 'worker', position: [0, 0.5, -1], state: 'idle' },
  { id: '6', type: 'building', position: [2, 0.5, 0] },
  { id: '7', type: 'farm', position: [-2, 0.01, -1] },
  { id: '8', type: 'forest', position: [0, 0.5, -4] },
];

const useSandboxStore = create<SandboxState>((set) => ({
  objects: getInitialObjects(),
  selectedBuildingType: null,
  reset: () => {
    set({ objects: getInitialObjects() });
    useResourceStore.getState().reset();
    console.log('Store reset function called. New objects created.');
  },
  setObjects: (objects) => set({ objects }),
  assignWorkerTask: (workerId, task) => set((state) => ({
    objects: state.objects.map((obj) =>
      obj.id === workerId ? { ...obj, task } : obj
    ),
  })),
  addObject: (obj) => set((state) => ({
    objects: [...state.objects, obj],
  })),
  setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),
  assignIdleWorkersToBuildings: () => set((state) => {
    const newObjects = [...state.objects];
    const idleWorkers = newObjects.filter(o => o.type === 'worker' && o.state === 'idle');
    const availableBuildings = newObjects.filter(o => ['farm', 'mine', 'forest'].includes(o.type) && !o.assignedWorkerId);

    for (const worker of idleWorkers) {
      const building = availableBuildings.shift(); // Get the next available building
      if (building) {
        worker.state = 'moving';
        worker.targetId = building.id;
        building.assignedWorkerId = worker.id;
      } else {
        break; // No more available buildings
      }
    }
    return { objects: newObjects };
  }),
}));

export default useSandboxStore;
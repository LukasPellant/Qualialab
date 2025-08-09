import { create } from 'zustand';
import useResourceStore from './useResourceStore';

export type Task =
  | { type: 'gather'; resource: 'wood' | 'stone'; targetId: string }
  | { type: 'build'; blueprint: 'farm' | 'mine'; targetPos: [number, number, number] };

export interface GameObject {
  id: string;
  type: 'worker' | 'building' | 'farm' | 'forest' | 'mine' | 'mountain' | 'house' | 'townhall' | 'warehouse' | 'market';
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
  // New properties for enhanced system
  jobs?: {
    max: number;
    assigned: number;
  };
  storage?: {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
  };
  storageMax?: {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
  };
  upgrades?: string[];
  buildQueue?: {
    upgradeId: string;
    startTime: number;
    duration: number;
  }[];
}

export interface SandboxState {
  objects: GameObject[];
  selectedBuildingType: GameObject['type'] | null;
  openTownHallId: string | null;
  openMarketId: string | null;
  selectedBuildingId: string | null;
  rates: {
    foodPerMin: number;
    woodPerMin: number;
    stonePerMin: number;
    goldPerMin: number;
    consumptionPerMin: number;
  };
  reset: () => void;
  setObjects: (objects: GameObject[] | ((prev: GameObject[]) => GameObject[])) => void;
  addObject: (obj: GameObject) => void;
  setSelectedBuildingType: (type: GameObject['type'] | null) => void;
  setOpenTownHallId: (id: string | null) => void;
  setOpenMarketId: (id: string | null) => void;
  setSelectedBuildingId: (id: string | null) => void;
  updateRates: (rates: Partial<SandboxState['rates']>) => void;
  addUpgradeToBuilding: (buildingId: string, upgradeId: string) => void;
}

const getInitialObjects = (): GameObject[] => [
  { 
    id: 'town1', 
    type: 'townhall', 
    position: [0, 0, 10],
    jobs: { max: 0, assigned: 0 },
    storage: { wood: 0, stone: 0, food: 0, gold: 0 },
    storageMax: { wood: 500, stone: 500, food: 500, gold: 500 },
    upgrades: []
  },
  { 
    id: 'farm1', 
    type: 'farm', 
    position: [-10, 0, -4], 
    workerCapacity: 2, 
    assignedWorkers: [],
    jobs: { max: 2, assigned: 0 },
    storage: { food: 0 },
    storageMax: { food: 0 },
    upgrades: []
  },
  { 
    id: 'forest1', 
    type: 'forest', 
    position: [12, 0, -10], 
    stock: { wood: 300 }, 
    workerCapacity: 3, 
    assignedWorkers: [],
    jobs: { max: 2, assigned: 0 },
    storage: { wood: 0 },
    storageMax: { wood: 0 },
    upgrades: []
  },
  { 
    id: 'mine1', 
    type: 'mine', 
    position: [-14, 0, 10], 
    workerCapacity: 2, 
    assignedWorkers: [],
    jobs: { max: 2, assigned: 0 },
    storage: { stone: 0 },
    storageMax: { stone: 0 },
    upgrades: []
  },
  // Keep a couple of workers for current loop
  { id: 'w1', type: 'worker', position: [0.5, 0.5, 0.5], state: 'idle', assignedTargetId: null },
  { id: 'w2', type: 'worker', position: [2.5, 0.5, 1.5], state: 'idle', assignedTargetId: null },
];

const useSandboxStore = create<SandboxState>((set) => ({
  objects: getInitialObjects(),
  selectedBuildingType: null,
  openTownHallId: null,
  openMarketId: null,
  selectedBuildingId: null,
  rates: {
    foodPerMin: 0,
    woodPerMin: 0,
    stonePerMin: 0,
    goldPerMin: 0,
    consumptionPerMin: 0,
  },
  reset: () => {
    const objs = getInitialObjects();
    set({ 
      objects: objs,
      openMarketId: null,
      selectedBuildingId: null,
      rates: {
        foodPerMin: 0,
        woodPerMin: 0,
        stonePerMin: 0,
        goldPerMin: 0,
        consumptionPerMin: 0,
      }
    });
    useResourceStore.getState().reset();
    // Reset population based on buildings present
    const cap = objs.reduce((acc, o) => acc + (o.type === 'townhall' ? 10 : o.type === 'house' ? 5 : 0), 0);
    // Lazy import to avoid cycle
    const { default: usePopulationStore } = require('./usePopulationStore');
    usePopulationStore.getState().reset(5, cap || 20);
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
  setOpenTownHallId: (id) => set({ openTownHallId: id }),
  setOpenMarketId: (id) => set({ openMarketId: id }),
  setSelectedBuildingId: (id) => set({ selectedBuildingId: id }),
  updateRates: (rates) => set((state) => ({ rates: { ...state.rates, ...rates } })),
  addUpgradeToBuilding: (buildingId, upgradeId) => set((state) => ({
    objects: state.objects.map(obj => 
      obj.id === buildingId 
        ? { ...obj, upgrades: [...(obj.upgrades || []), upgradeId] }
        : obj
    )
  })),
}));

export default useSandboxStore;
import { create } from 'zustand';

export interface ResourceState {
  wood: number;
  stone: number;
  food: number;
  gold: number;
  addResources: (resources: Partial<Omit<ResourceState, 'reset' | 'addResources'>>) => void;
  reset: () => void;
}

const useResourceStore = create<ResourceState>((set) => ({
  wood: 100,
  stone: 50,
  food: 120,
  gold: 50,
  addResources: (resources) => set((state) => ({
    wood: state.wood + (resources.wood || 0),
    stone: state.stone + (resources.stone || 0),
    food: state.food + (resources.food || 0),
    gold: state.gold + (resources.gold || 0),
  })),
  reset: () => set({
    wood: 100,
    stone: 50,
    food: 120,
    gold: 50,
  }),
}));

export default useResourceStore;

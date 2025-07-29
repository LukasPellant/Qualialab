import { create } from 'zustand';

export interface ResourceState {
  wood: number;
  stone: number;
  food: number;
  gold: number;
  reset: () => void;
}

const useResourceStore = create<ResourceState>((set) => ({
  wood: 10,
  stone: 5,
  food: 20,
  gold: 0,
  reset: () => set({
    wood: 10,
    stone: 5,
    food: 20,
    gold: 0,
  }),
}));

export default useResourceStore;

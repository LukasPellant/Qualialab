import { create } from 'zustand';

export interface PopulationState {
  idle: number;
  cap: number;
  recruitTimer: number; // seconds remaining for current recruit; 0 means idle
  setIdle: (idle: number) => void;
  setCap: (cap: number) => void;
  startRecruit: (seconds: number) => void;
  tickRecruit: () => void;
  reset: (initialIdle?: number, initialCap?: number) => void;
}

const usePopulationStore = create<PopulationState>((set) => ({
  idle: 5,
  cap: 20,
  recruitTimer: 0,
  setIdle: (idle) => set({ idle }),
  setCap: (cap) => set({ cap }),
  startRecruit: (seconds) => set({ recruitTimer: seconds }),
  tickRecruit: () =>
    set((state) => {
      if (state.recruitTimer <= 0) return state;
      const next = state.recruitTimer - 1;
      return { recruitTimer: next } as Partial<PopulationState> as PopulationState;
    }),
  reset: (initialIdle = 5, initialCap = 20) => set({ idle: initialIdle, cap: initialCap, recruitTimer: 0 }),
}));

export default usePopulationStore;



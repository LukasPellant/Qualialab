import { create } from 'zustand';

interface GameObject {
  id: number;
  type: 'worker' | 'building' | 'farm' | 'forest';
  position: [number, number, number];
}

interface SandboxState {
  objects: GameObject[];
  reset: () => void;
}

// Přeměň konstantu na funkci, která vždy vrátí nové pole
const getInitialObjects = (): GameObject[] => [
  { id: 1, type: 'worker', position: [0, 0.5, 0] },
  { id: 2, type: 'building', position: [2, 0.5, 0] },
  { id: 3, type: 'farm', position: [-2, 0.01, -1] },
  { id: 4, type: 'forest', position: [0, 0.5, -4] },
];

const useSandboxStore = create<SandboxState>((set) => ({
  // Zavolej funkci pro získání počátečního stavu
  objects: getInitialObjects(),
  reset: () => {
    // Při resetu zavolej funkci znovu, aby se vytvořil zcela nový stav
    set({ objects: getInitialObjects() });
    console.log('Store reset function called. New objects created.');
  },
}));

export default useSandboxStore;
import useResourceStore from '../stores/useResourceStore';
import useSandboxStore from '../stores/useSandboxStore';

export function runResourceSystem() {
  const { objects } = useSandboxStore.getState();
  const produce = { wood: 0, food: 0, stone: 0, gold: 0 };

  // Každá entita přidá nebo ubere suroviny
  objects.forEach((obj) => {
    switch (obj.type) {
      case 'farm':
        produce.food += 2;
        break;
      case 'forest':
        // pasivní růst dřeva do zásoby lesa
        obj.woodStock = (obj.woodStock ?? 10) + 1;
        break;
      default:
        break;
    }
  });

  useResourceStore.setState((state) => ({
    ...state,
    ...Object.fromEntries(
      Object.entries(produce).map(([k, v]) => [k, state[k as keyof typeof produce] + v])
    ),
  }));
}
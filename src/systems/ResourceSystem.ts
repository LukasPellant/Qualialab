import useResourceStore, { type ResourceState } from '../stores/useResourceStore';
import useSandboxStore, { type GameObject } from '../stores/useSandboxStore';

export function runResourceSystem() {
  const { objects } = useSandboxStore.getState();
  const produce = { wood: 0, food: 0, stone: 0, gold: 0 };

  // Každá entita přidá nebo ubere suroviny
  objects.forEach((obj: GameObject) => {
    switch (obj.type) {
      case 'farm':
        produce.food += 2;
        break;
      case 'forest':
        // pasivní růst dřeva do zásoby lesa
        obj.woodStock = (obj.woodStock ?? 10) + 5; // Increased growth to 5 per tick
        break;
      case 'mine':
        produce.stone += 1;
        produce.gold += 0.1; // Assuming gold is a new resource
        break;
      case 'worker':
        if (obj.task?.type === 'chop') {
          const forest = objects.find(o => o.id === obj.task?.targetId);
          if (forest && (forest.woodStock ?? 0) > 0) {
            produce.wood += 1; // Each worker adds 1 wood
            (forest as GameObject).woodStock = ((forest as GameObject).woodStock ?? 0) - 1;
          }
        } else if (obj.task?.type === 'mine') {
          const mine = objects.find(o => o.id === obj.task?.targetId);
          if (mine) {
            produce.stone += 1;
          }
        }
        break;
      default:
        break;
    }
  });

  useResourceStore.setState((state) => ({
    ...state,
    ...Object.fromEntries(
      Object.entries(produce).map(([k, v]) => [k, (state[k as keyof ResourceState] as number) + v])
    ),
  }));
}

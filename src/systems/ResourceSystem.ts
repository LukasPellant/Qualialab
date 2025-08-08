import useResourceStore from '../stores/useResourceStore';
import useSandboxStore from '../stores/useSandboxStore';

export function runResourceSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  const produce = { wood: 0, food: 0, stone: 0, gold: 0 };

  const updated = objects.map((obj: any) => {
    if (obj.type === 'farm' || obj.type === 'mine' || obj.type === 'forest') {
      const workers = obj.assignedWorkers?.length ?? 0;
      obj.isActive = workers > 0; // hint for UI
    }
    if (obj.type === 'farm') {
      // Resource production moved to WorkerSystem (on arrival); keep zero here to avoid double counting
    }
    if (obj.type === 'mine') {
      // Production handled by WorkerSystem when worker finishes cycle
    }
    if (obj.type === 'forest') {
      // passive stock growth (faster) with higher cap
      const wood = Math.min(300, (obj.stock?.wood ?? 300) + 3);
      return { ...obj, stock: { ...(obj.stock || {}), wood } };
    }
    return obj;
  });

  setObjects(updated);
  // produce is no longer used for farms/mines (handled by WorkerSystem)
  useResourceStore.getState().addResources(produce as any);
}
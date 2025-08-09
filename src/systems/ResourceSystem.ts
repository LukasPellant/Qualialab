import useResourceStore from '../stores/useResourceStore';
import useSandboxStore from '../stores/useSandboxStore';
import usePopulationStore from '@/stores/usePopulationStore';

export function runResourceSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  const population = usePopulationStore.getState();
  const resources = useResourceStore.getState();
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
  resources.addResources(produce as any);

  // Consume food per worker per tick (1s). Target: 1 farm sustains ~3 workers + 1 farmer.
  // Assume farm effective production ~0.133 food/s per active farm (2 food per 15s avg cycles) → simple model:
  const workersCount = updated.filter((o: any) => o.type === 'worker').length;
  const farmsActive = updated.filter((o: any) => o.type === 'farm' && (o.assignedWorkers?.length ?? 0) > 0).length;
  // Base consumption per worker per second
  const baseConsumptionPerWorker = 0.1; // tweakable
  const totalConsumption = workersCount * baseConsumptionPerWorker;
  // Add passive farm production approximation (keeps balance)
  const farmProduction = farmsActive * 0.4; // food per second per active farm
  const netFood = farmProduction - totalConsumption;
  if (netFood !== 0) resources.addResources({ food: netFood } as any);

  // Update population cap from existing buildings
  const capFromBuildings = updated.reduce((acc: number, obj: any) => {
    if (obj.type === 'townhall') return acc + 10;
    if (obj.type === 'house') return acc + 5;
    return acc;
  }, 0);
  if (capFromBuildings !== population.cap) {
    population.setCap(capFromBuildings || population.cap);
  }

  // Auto-recruit logic: if not recruiting and resources allow and under cap
  const canStartRecruit =
    population.recruitTimer <= 0 && population.idle < population.cap && resources.food >= 40 && resources.gold >= 10;
  if (canStartRecruit) {
    // Deduct upfront and start timer (30s)
    resources.addResources({ food: -40, gold: -10 } as any);
    population.startRecruit(30);
  }

  // Progress recruit timer; on completion add +1 idle
  if (population.recruitTimer > 0) {
    population.tickRecruit();
    const after = usePopulationStore.getState();
    if (after.recruitTimer === 0) {
      after.setIdle(after.idle + 1);
    }
  }
}
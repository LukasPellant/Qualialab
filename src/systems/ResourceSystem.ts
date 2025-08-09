import useResourceStore from '../stores/useResourceStore';
import useSandboxStore from '../stores/useSandboxStore';
import usePopulationStore from '@/stores/usePopulationStore';
import useMarketStore from '@/stores/useMarketStore';
import { getBuildingConfig, getUpgradeConfig } from '@/data/buildingData';

export function runResourceSystem() {
  const { objects, setObjects, updateRates } = useSandboxStore.getState() as any;
  const population = usePopulationStore.getState();
  const resources = useResourceStore.getState();
  const market = useMarketStore.getState();
  
  // Calculate total storage capacity
  const totalStorage = objects.reduce((acc: any, obj: any) => {
    if (obj.storageMax) {
      Object.keys(obj.storageMax).forEach(resource => {
        acc[resource] = (acc[resource] || 0) + (obj.storageMax[resource] || 0);
      });
    }
    return acc;
  }, {});

  // Check if we're at storage cap for any resource
  const isStorageFull = (resource: string) => {
    const current = resources[resource as keyof typeof resources] || 0;
    const max = totalStorage[resource] || Infinity;
    return current >= max;
  };

  let rates = {
    foodPerMin: 0,
    woodPerMin: 0, 
    stonePerMin: 0,
    goldPerMin: 0,
    consumptionPerMin: 0,
  };

  const updated = objects.map((obj: any) => {
    const config = getBuildingConfig(obj.type);
    if (!config) return obj;

    // Apply upgrades
    let modifiers = { jobs: 1, yield: 1, cycle: 1, foodPassive: 0, globalFoodConsumption: 1 };
    if (obj.upgrades) {
      obj.upgrades.forEach((upgradeId: string) => {
        const upgrade = getUpgradeConfig(upgradeId);
        if (upgrade?.mods) {
          Object.entries(upgrade.mods).forEach(([key, value]) => {
            const [prop, op] = key.split(':');
            if (op === '+') modifiers[prop as keyof typeof modifiers] = (modifiers[prop as keyof typeof modifiers] || 0) + value;
            if (op === 'x') modifiers[prop as keyof typeof modifiers] = (modifiers[prop as keyof typeof modifiers] || 1) * value;
            if (prop === 'foodPassive') modifiers.foodPassive += value;
          });
        }
      });
    }

    if (obj.type === 'farm' || obj.type === 'mine' || obj.type === 'forest') {
      const workers = obj.assignedWorkers?.length ?? 0;
      obj.isActive = workers > 0 && !isStorageFull(config.base.resource || 'food');
      
      // Calculate production rate per minute
      if (obj.isActive && config.base.resource) {
        const cycleTimeSeconds = (config.base.cycle || 60) * modifiers.cycle;
        const yieldPerCycle = (config.base.yield || 1) * modifiers.yield;
        const ratePerMinute = (yieldPerCycle / cycleTimeSeconds) * 60 * workers;
        rates[`${config.base.resource}PerMin` as keyof typeof rates] += ratePerMinute;
      }

      // Add passive production from upgrades
      if (modifiers.foodPassive > 0) {
        rates.foodPerMin += modifiers.foodPassive;
      }
    }

    if (obj.type === 'forest') {
      // Passive stock growth - regrowth per minute converted to per second
      const regrowthRate = config.base.regrowthRate || 0.2; // per minute  
      const stockCap = config.base.stockCap || 300;
      const currentStock = obj.stock?.wood ?? stockCap;
      const newStock = Math.min(stockCap, currentStock + (regrowthRate / 60)); // per second
      return { ...obj, stock: { ...(obj.stock || {}), wood: newStock } };
    }

    return obj;
  });

  setObjects(updated);

  // Calculate consumption rate
  const workersCount = updated.filter((o: any) => o.type === 'worker').length;
  const baseConsumptionPerWorker = 1.2; // per minute per worker
  
  // Apply global consumption modifiers from shrines
  let globalConsumptionMod = 1;
  updated.forEach((obj: any) => {
    if (obj.upgrades) {
      obj.upgrades.forEach((upgradeId: string) => {
        const upgrade = getUpgradeConfig(upgradeId);
        if (upgrade?.mods?.['globalFoodConsumption:x']) {
          globalConsumptionMod *= upgrade.mods['globalFoodConsumption:x'];
        }
      });
    }
  });
  
  rates.consumptionPerMin = workersCount * baseConsumptionPerWorker * globalConsumptionMod;
  
  // Apply consumption every second
  const foodConsumptionPerSecond = rates.consumptionPerMin / 60;
  if (foodConsumptionPerSecond > 0) {
    resources.addResources({ food: -foodConsumptionPerSecond } as any);
  }

  // Update rates in store
  updateRates(rates);

  // Update population cap from existing buildings
  const capFromBuildings = updated.reduce((acc: number, obj: any) => {
    const config = getBuildingConfig(obj.type);
    return acc + (config?.base.populationCap || 0);
  }, 0);
  
  if (capFromBuildings !== population.cap) {
    population.setCap(capFromBuildings || population.cap);
  }

  // Updated auto-recruit logic - require better food situation
  const netFoodRate = rates.foodPerMin - rates.consumptionPerMin;
  const canStartRecruit =
    population.recruitTimer <= 0 && 
    population.idle < population.cap && 
    resources.food >= 60 && 
    resources.gold >= 10 &&
    netFoodRate > 0.8;
    
  if (canStartRecruit) {
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

  // Update market prices periodically
  market.updatePrices();
}
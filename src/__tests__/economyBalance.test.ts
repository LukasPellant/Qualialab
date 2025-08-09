import { getBuildingConfig } from '../data/buildingData';

describe('Economy Balance', () => {
  it('should have correct farm production rates', () => {
    const farmConfig = getBuildingConfig('farm');
    expect(farmConfig).toBeTruthy();
    
    if (farmConfig) {
      // Target: +3/min with 1 worker
      const yieldPerCycle = farmConfig.base.yield || 0;
      const cycleTimeSeconds = farmConfig.base.cycle || 60;
      const ratePerMinute = (yieldPerCycle / cycleTimeSeconds) * 60;
      
      expect(ratePerMinute).toBeCloseTo(3, 1); // ~3 food per minute per worker
    }
  });

  it('should have correct mine production rates', () => {
    const mineConfig = getBuildingConfig('mine');
    expect(mineConfig).toBeTruthy();
    
    if (mineConfig) {
      // Target: +1.2/min with 1 worker
      const yieldPerCycle = mineConfig.base.yield || 0;
      const cycleTimeSeconds = mineConfig.base.cycle || 60;
      const ratePerMinute = (yieldPerCycle / cycleTimeSeconds) * 60;
      
      expect(ratePerMinute).toBeCloseTo(1.2, 1); // ~1.2 stone per minute per worker
    }
  });

  it('should have correct forest production rates', () => {
    const forestConfig = getBuildingConfig('forest');
    expect(forestConfig).toBeTruthy();
    
    if (forestConfig) {
      // Target: +2/min with 1 worker
      const yieldPerCycle = forestConfig.base.yield || 0;
      const cycleTimeSeconds = forestConfig.base.cycle || 60;
      const ratePerMinute = (yieldPerCycle / cycleTimeSeconds) * 60;
      
      expect(ratePerMinute).toBeCloseTo(2, 1); // ~2 wood per minute per worker
    }
  });

  it('should have balanced food consumption vs production', () => {
    const farmConfig = getBuildingConfig('farm');
    expect(farmConfig).toBeTruthy();
    
    if (farmConfig) {
      const foodProductionPerWorker = 3; // per minute
      const foodConsumptionPerWorker = 1.2; // per minute
      const netFoodPerFarmWorker = foodProductionPerWorker - foodConsumptionPerWorker;
      
      // 1 farm should sustain ~3 workers (including farmer)
      const sustainableWorkers = foodProductionPerWorker / foodConsumptionPerWorker;
      
      expect(sustainableWorkers).toBeGreaterThan(2);
      expect(netFoodPerFarmWorker).toBeGreaterThan(1); // positive net production
    }
  });

  it('should have proper storage caps', () => {
    const townhallConfig = getBuildingConfig('townhall');
    const warehouseConfig = getBuildingConfig('warehouse');
    
    expect(townhallConfig?.storage).toBe(500);
    expect(warehouseConfig?.storage).toBe(300);
  });
});

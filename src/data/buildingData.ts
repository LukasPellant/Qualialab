import buildingsConfig from '../../content/buildings.json';
import upgradesConfig from '../../content/upgrades.json';

export interface BuildingConfig {
  jobs: number;
  base: {
    yield?: number;
    cycle?: number;
    resource?: 'wood' | 'stone' | 'food' | 'gold';
    regrowthRate?: number;
    stockCap?: number;
    populationCap?: number;
  };
  cost: {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
  };
  storage: number;
}

export interface UpgradeConfig {
  parent: string;
  name: string;
  description: string;
  mods: Record<string, any>;
  cost: {
    wood?: number;
    stone?: number;
    food?: number;
    gold?: number;
  };
  buildTime: number;
}

export const BUILDINGS: Record<string, BuildingConfig> = buildingsConfig as any;
export const UPGRADES: Record<string, UpgradeConfig> = upgradesConfig as any;

export function getBuildingConfig(type: string): BuildingConfig | null {
  return BUILDINGS[type] || null;
}

export function getUpgradeConfig(upgradeId: string): UpgradeConfig | null {
  return UPGRADES[upgradeId] || null;
}

export function getUpgradesForBuilding(buildingType: string): Array<{id: string, config: UpgradeConfig}> {
  return Object.entries(UPGRADES)
    .filter(([_, config]) => config.parent === buildingType)
    .map(([id, config]) => ({ id, config }));
}

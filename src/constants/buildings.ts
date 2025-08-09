export type BuildingType = 'farm' | 'mine' | 'house';

export const BUILD_COSTS: Record<BuildingType, { wood?: number; stone?: number; food?: number; gold?: number }> = {
  farm: { wood: 50, stone: 20 },
  mine: { wood: 30, stone: 40 },
  house: { wood: 40, stone: 10 },
};



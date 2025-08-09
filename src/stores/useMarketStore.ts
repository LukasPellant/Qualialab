import { create } from 'zustand';

export interface MarketState {
  prices: {
    wood: number;
    stone: number;
    food: number;
  };
  demand: {
    wood: number;
    stone: number;
    food: number;
  };
  supply: {
    wood: number;
    stone: number;
    food: number;
  };
  lastUpdate: number;
  buyResource: (resource: 'wood' | 'stone' | 'food', amount: number) => number; // returns cost
  sellResource: (resource: 'wood' | 'stone' | 'food', amount: number) => number; // returns revenue
  updatePrices: () => void;
  reset: () => void;
}

const BASE_PRICES = {
  wood: 1,
  stone: 2,
  food: 1.5,
};

const PRICE_ALPHA = 0.4;
const PRICE_CAP = 200;
const DECAY_RATE = 0.1; // 10% decay towards 0 every 30 seconds

const useMarketStore = create<MarketState>((set, get) => ({
  prices: { ...BASE_PRICES },
  demand: { wood: 0, stone: 0, food: 0 },
  supply: { wood: 0, stone: 0, food: 0 },
  lastUpdate: Date.now(),

  buyResource: (resource, amount) => {
    const state = get();
    const totalCost = state.prices[resource] * amount;
    
    // Update demand/supply and recalculate prices
    set(prev => ({
      demand: {
        ...prev.demand,
        [resource]: prev.demand[resource] + amount
      },
      supply: {
        ...prev.supply,
        [resource]: Math.max(0, prev.supply[resource] - amount)
      }
    }));
    
    get().updatePrices();
    return totalCost;
  },

  sellResource: (resource, amount) => {
    const state = get();
    const totalRevenue = state.prices[resource] * amount;
    
    // Update demand/supply and recalculate prices
    set(prev => ({
      supply: {
        ...prev.supply,
        [resource]: prev.supply[resource] + amount
      },
      demand: {
        ...prev.demand,
        [resource]: Math.max(0, prev.demand[resource] - amount)
      }
    }));
    
    get().updatePrices();
    return totalRevenue;
  },

  updatePrices: () => {
    const state = get();
    const now = Date.now();
    const timeDelta = (now - state.lastUpdate) / 1000; // seconds
    
    // Apply decay towards baseline
    const decayFactor = Math.pow(1 - DECAY_RATE, timeDelta / 30); // every 30 seconds
    
    set(prev => {
      const newDemand = {
        wood: prev.demand.wood * decayFactor,
        stone: prev.demand.stone * decayFactor,
        food: prev.demand.food * decayFactor,
      };
      const newSupply = {
        wood: prev.supply.wood * decayFactor,
        stone: prev.supply.stone * decayFactor,
        food: prev.supply.food * decayFactor,
      };
      
      // Calculate new prices
      const newPrices = {
        wood: BASE_PRICES.wood * (1 + PRICE_ALPHA * (newDemand.wood - newSupply.wood) / PRICE_CAP),
        stone: BASE_PRICES.stone * (1 + PRICE_ALPHA * (newDemand.stone - newSupply.stone) / PRICE_CAP),
        food: BASE_PRICES.food * (1 + PRICE_ALPHA * (newDemand.food - newSupply.food) / PRICE_CAP),
      };
      
      // Ensure prices don't go negative
      Object.keys(newPrices).forEach(key => {
        const resource = key as keyof typeof newPrices;
        newPrices[resource] = Math.max(0.1, newPrices[resource]);
      });
      
      return {
        prices: newPrices,
        demand: newDemand,
        supply: newSupply,
        lastUpdate: now,
      };
    });
  },

  reset: () => set({
    prices: { ...BASE_PRICES },
    demand: { wood: 0, stone: 0, food: 0 },
    supply: { wood: 0, stone: 0, food: 0 },
    lastUpdate: Date.now(),
  }),
}));

export default useMarketStore;

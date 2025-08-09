# Game Balance Configuration

This document explains the target production rates, consumption rates, and how to adjust them.

## Target Rates (per assigned worker per minute)

### Production Buildings
- **Farm**: +3 food/min
- **Forest**: +2 wood/min  
- **Mine**: +1.2 stone/min

### Consumption
- **Workers**: -1.2 food/min per worker

### Economic Balance
- 1 Farm with 1 worker should sustain ~2.5 workers total (including the farmer)
- Net food production: +1.8 food/min per farm worker
- Auto-recruit requires: ≥60 food, ≥10 gold, net food rate >0.8/min

## Storage System
- **Town Hall**: 500 units per resource type
- **Warehouse**: +300 units per resource type  
- Production pauses when storage is full

## Configuration Files

### Buildings (`content/buildings.json`)
```json
{
  "farm": {
    "jobs": 2,           // max workers
    "base": {
      "yield": 3,        // food per cycle
      "cycle": 60,       // cycle time in seconds
      "resource": "food"
    },
    "cost": { "wood": 50, "stone": 20 }
  }
}
```

### Upgrades (`content/upgrades.json`)
```json
{
  "farm:fields": {
    "parent": "farm",
    "mods": {
      "jobs:+": 1,        // add 1 job slot
      "yield:x": 1.25     // multiply yield by 1.25
    },
    "cost": { "wood": 30, "stone": 10 }
  }
}
```

## Modifier Syntax
- `property:+` = Add value
- `property:x` = Multiply by value
- Special properties: `foodPassive:+`, `globalFoodConsumption:x`

## Adjusting Balance

1. **Increase production**: Raise `yield` or lower `cycle` time
2. **Change consumption**: Modify `baseConsumptionPerWorker` in `ResourceSystem.ts`
3. **Add storage**: Increase `storage` values in building configs
4. **Modify recruit costs**: Change conditions in `ResourceSystem.ts`

## Market System
- Base prices: wood=1, stone=2, food=1.5 gold
- Price formula: `base × (1 + 0.4 × (demand-supply)/200)`
- 10% price decay every 30 seconds toward baseline

## Testing
Run `npm test` to verify economic balance targets are met.

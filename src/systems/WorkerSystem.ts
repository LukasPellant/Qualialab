import useSandboxStore, { type GameObject, type Task } from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';
import { getBuildingConfig, getUpgradeConfig } from '@/data/buildingData';

export function runWorkerSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  const resourceState = useResourceStore.getState() as any;

  // Compute total storage capacity across all buildings for each resource type
  const totalStorage = objects.reduce((acc: any, obj: any) => {
    if (obj.storageMax) {
      Object.keys(obj.storageMax).forEach((resource) => {
        acc[resource] = (acc[resource] || 0) + (obj.storageMax[resource] || 0);
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const addWithCap = (resource: 'wood' | 'stone' | 'food' | 'gold', amount: number) => {
    if (amount <= 0) {
      resourceState.addResources({ [resource]: amount } as any);
      return;
    }
    const cap = totalStorage[resource] ?? Infinity;
    const current = (resourceState as any)[resource] ?? 0;
    const allowed = Math.max(0, cap - current);
    const delta = Math.min(amount, allowed);
    if (delta > 0) resourceState.addResources({ [resource]: delta } as any);
  };

  let updated: GameObject[] | null = null;

  for (let i = 0; i < objects.length; i += 1) {
    const w = objects[i] as GameObject;
    if (w.type !== 'worker') continue;
    if (w.state === 'working') {
      const nextTimer = (w.timer ?? 0) + 1; // seconds per tick
      if (w.task?.type === 'gather') {
        const targetId = (w.task as Extract<Task, { type: 'gather' }>).targetId;
        const target = (updated || objects).find((o: GameObject) => o.id === targetId);
        
        if (target) {
          const config = getBuildingConfig(target.type);
          if (!config) continue;

          // Apply upgrades to get modified cycle time and yield
          let modifiers = { yield: 1, cycle: 1 };
          if (target.upgrades) {
            target.upgrades.forEach((upgradeId: string) => {
              const upgrade = getUpgradeConfig(upgradeId);
              if (upgrade?.mods) {
                Object.entries(upgrade.mods).forEach(([key, value]) => {
                  const [prop, op] = key.split(':');
                  if (op === 'x' && (prop === 'yield' || prop === 'cycle')) {
                    modifiers[prop as keyof typeof modifiers] *= value;
                  }
                });
              }
            });
          }

          const cycleTime = (config.base.cycle || 60) * modifiers.cycle;
          const yield_ = (config.base.yield || 1) * modifiers.yield;
          
          if (nextTimer >= cycleTime) {
            let targetClone: GameObject | null = null;
            
            if (target?.type === 'forest') {
              const available = Math.max(0, (target.stock?.wood ?? 0));
              const taken = Math.min(yield_, available);
              if (!updated) updated = objects.slice();
              const tIdx = (updated as GameObject[]).findIndex((o: GameObject) => o.id === target.id);
              targetClone = { ...(updated as GameObject[])[tIdx] } as GameObject;
              targetClone.stock = { ...(targetClone.stock || {}), wood: available - taken };
              (updated as GameObject[])[tIdx] = targetClone;
              addWithCap('wood', taken);
            } else if (target?.type === 'mine') {
              addWithCap('stone', yield_);
            } else if (target?.type === 'farm') {
              addWithCap('food', yield_);
            }

            if (!updated) updated = objects.slice();
            const wClone = { ...w } as GameObject;
            if (w.assignedTargetId) {
              // Stay at the worksite and continue working cycles
              wClone.task = { type: 'gather', resource: (w.task as any).resource, targetId: w.assignedTargetId } as any;
              wClone.state = 'working';
            } else {
              wClone.task = null;
              wClone.state = 'idle';
            }
            wClone.timer = 0;
            (updated as GameObject[])[i] = wClone;
          } else {
            // Update timer
            if (!updated) updated = objects.slice();
            const wClone = { ...w } as GameObject;
            wClone.timer = nextTimer;
            (updated as GameObject[])[i] = wClone;
          }
        }
      }
      if (w.task?.type === 'build') {
        const buildTask = w.task as Extract<Task, { type: 'build' }>;
        const target = (updated || objects).find((o: GameObject) => o.position[0] === buildTask.targetPos[0] && o.position[2] === buildTask.targetPos[2]);
        if (target) {
          if (!updated) updated = objects.slice();
          const tIdx = (updated as GameObject[]).findIndex((o: GameObject) => o.position[0] === buildTask.targetPos[0] && o.position[2] === buildTask.targetPos[2]);
          const targetClone = { ...(updated as GameObject[])[tIdx] } as GameObject;
          targetClone.progress = Math.min(1, (targetClone.progress ?? 0) + 0.2);
          (updated as GameObject[])[tIdx] = targetClone;
          if (targetClone.progress >= 1) {
            const wClone = { ...(updated as GameObject[])[i] } as GameObject;
            wClone.task = null;
            wClone.state = 'idle';
            wClone.timer = 0;
            (updated as GameObject[])[i] = wClone;
          }
        }
      }
    }
  }

  if (updated) setObjects(updated);
}

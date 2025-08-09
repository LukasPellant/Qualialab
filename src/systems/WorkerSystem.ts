import useSandboxStore, { type GameObject, type Task } from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';

export function runWorkerSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  const { addResources } = useResourceStore.getState() as any;

  let updated: GameObject[] | null = null;

  for (let i = 0; i < objects.length; i += 1) {
    const w = objects[i] as GameObject;
    if (w.type !== 'worker') continue;
    if (w.state === 'working') {
      const nextTimer = (w.timer ?? 0) + 1; // seconds per tick
      if (w.task?.type === 'gather') {
        if (nextTimer >= 0.5) { // 10x faster cycles
          // gather from forest/mine target
          const targetId = (w.task as Extract<Task, { type: 'gather' }>).targetId;
          const target = (updated || objects).find((o: GameObject) => o.id === targetId);
          let targetClone: GameObject | null = null;
          if (target?.type === 'forest') {
            const available = Math.max(0, (target.stock?.wood ?? 0));
            const taken = Math.min(1, available);
            if (!updated) updated = objects.slice();
            // clone target
            const tIdx = (updated as GameObject[]).findIndex((o: GameObject) => o.id === target.id);
            targetClone = { ...(updated as GameObject[])[tIdx] } as GameObject;
            targetClone.stock = { ...(targetClone.stock || {}), wood: available - taken };
            (updated as GameObject[])[tIdx] = targetClone;
            addResources({ wood: taken });
          } else if (target?.type === 'mine') {
            addResources({ stone: 1 });
          } else if (target?.type === 'farm') {
            addResources({ food: 2 });
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

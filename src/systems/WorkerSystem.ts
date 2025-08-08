import useSandboxStore, { type GameObject, type Task } from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';

export function runWorkerSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  const { addResources } = useResourceStore.getState() as any;

  const updated: GameObject[] = objects.map((o: GameObject) => ({ ...o }));

  for (const w of updated.filter((o: GameObject) => o.type === 'worker')) {
    if (w.state === 'working') {
      w.timer = (w.timer ?? 0) + 1; // seconds per tick
      if (w.task?.type === 'gather') {
        if (w.timer >= 0.5) { // 10x faster cycles
          // gather from forest/mine target
          const targetId = (w.task as Extract<Task, { type: 'gather' }>).targetId;
          const target = updated.find((o) => o.id === targetId);
          if (target?.type === 'forest') {
            const available = Math.max(0, (target.stock?.wood ?? 0));
            const taken = Math.min(1, available);
            target.stock = { ...(target.stock || {}), wood: available - taken };
            addResources({ wood: taken });
          } else if (target?.type === 'mine') {
            addResources({ stone: 1 });
          } else if (target?.type === 'farm') {
            addResources({ food: 2 });
          }

          if (w.assignedTargetId) {
            // Stay at the worksite and continue working cycles
            w.task = { type: 'gather', resource: w.task.resource, targetId: w.assignedTargetId } as any;
            w.state = 'working';
          } else {
            w.task = null;
            w.state = 'idle';
          }
          w.timer = 0;
        }
      }
      if (w.task?.type === 'build') {
        const buildTask = w.task as Extract<Task, { type: 'build' }>;
        const target = updated.find((o) => o.position[0] === buildTask.targetPos[0] && o.position[2] === buildTask.targetPos[2]);
        if (target) {
          target.progress = Math.min(1, (target.progress ?? 0) + 0.2);
          if (target.progress >= 1) {
            w.task = null;
            w.state = 'idle';
            w.timer = 0;
          }
        }
      }
    }
  }

  setObjects(updated);
}

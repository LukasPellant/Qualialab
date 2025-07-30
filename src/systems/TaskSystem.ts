import { assignPath } from './PathSystem';
import useSandboxStore from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';

let last = 0;

export function runTaskSystem() {
  const now = performance.now();
  if (now - last < 100) return;   // 10 Hz
  last = now;

  const { objects } = useSandboxStore.getState();

  objects.forEach((o: any) => {
    if (o.type !== 'worker') return;

    switch (o.state ?? 'idle') {
      case 'idle': {
        // Find the nearest farm, mine, etc.
        const target = objects.find((t: any) => ['farm', 'mine'].includes(t.type));
        if (target) {
          o.state = 'moving';
          o.targetId = target.id;
          assignPath(o, target);
        }
        break;
      }
      case 'moving': {
        if (!o.path || o.path.length === 0) {
          o.state = 'working';
          o.timer = 0;
        }
        break;
      }
      case 'working': {
        o.timer += 1;
        if (o.timer > 5) {
          const target = objects.find((t: any) => t.id === o.targetId);
          if (target) {
            if (target.type === 'farm') {
              useResourceStore.getState().addResources({ food: 2 });
            } else if (target.type === 'mine') {
              useResourceStore.getState().addResources({ stone: 1 });
            }
          }
          o.state = 'idle';
        }
        break;
      }
    }
  });
}
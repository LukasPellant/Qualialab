import { assignPath } from './PathSystem';
import useSandboxStore, { type GameObject } from '../stores/useSandboxStore';

export function runTaskSystem() {
  const { objects } = useSandboxStore.getState();

  objects.forEach((o: GameObject) => {
    if (o.type !== 'worker') return;

    switch (o.state ?? 'idle') {
      case 'idle': {
        // vyhledej nejbližší farmu, mine apod.
        const target = objects.find((t) => ['farm', 'mine'].includes(t.type));
        if (target) {
          o.state = 'moving';
          o.targetId = target.id as string;
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
        o.timer = (o.timer ?? 0) + 1;
        if (o.timer > 5) {
          // přidej suroviny
          // ... (call ResourceStore)
          o.state = 'idle';
        }
        break;
      }
    }
  });
}

import useSandboxStore, { type GameObject } from '../stores/useSandboxStore';
import { nanoid } from 'nanoid';

export function runWorkerSystem() {
  const { objects } = useSandboxStore.getState();

  objects.forEach((o: GameObject) => {
    if (o.type !== 'worker') return;

    switch (o.state ?? 'idle') {
      case 'idle': {
        // vyhledej nejbližší farmu, mine apod.
        const target = objects.find((t) => ['farm', 'mine', 'forest'].includes(t.type));
        if (target) {
          o.state = 'moving';
          o.targetId = target.id;
          // Assign task based on target type
          if (target.type === 'forest') {
            o.task = { type: 'chop', targetId: target.id, id: nanoid() };
          } else if (target.type === 'mine') {
            o.task = { type: 'mine', targetId: target.id, id: nanoid() };
          } else if (target.type === 'farm') {
            o.task = { type: 'farm', targetId: target.id, id: nanoid() };
          }
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
          // ... (call ResourceStore) - This will be handled by ResourceSystem
          o.state = 'idle';
          o.task = undefined; // Clear task after completion
        }
        break;
      }
    }
  });

  useSandboxStore.setState({ objects: [...objects] });
}
import useSandboxStore from '../stores/useSandboxStore';
import useResourceStore from '../stores/useResourceStore';

export function runWorkerSystem() {
  const { objects } = useSandboxStore.getState();
  const { wood, addWood } = useResourceStore.getState();

  objects.forEach((worker) => {
    if (worker.type === 'worker' && worker.state === 'working' && worker.timer === 5) {
      const target = objects.find((o) => o.id === worker.targetId);
      if (target) {
        switch (target.type) {
          case 'forest':
            addWood(1);
            break;
          // Add other resource types here
        }
      }
    }
  });
}

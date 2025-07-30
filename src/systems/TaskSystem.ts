import useSandboxStore from '../stores/useSandboxStore';
import { assignPath } from './PathSystem';

export function runTaskSystem() {
  const { objects, setObjects } = useSandboxStore.getState();

  const workers = objects.filter((o) => o.type === 'worker');
  const buildings = objects.filter((o) => ['farm', 'mine', 'forest'].includes(o.type));

  for (const worker of workers) {
    switch (worker.state ?? 'idle') {
      case 'idle': {
        // Workers remain idle until explicitly assigned a task via assignIdleWorkersToBuildings
        break;
      }

      case 'moving': {
        // If the path is complete, the worker has arrived.
        if (!worker.path || worker.path.length === 0) {
          worker.state = 'working'; // Arrived, now working.
          // The worker will stay in this state until a new task is given.
        }
        break;
      }

      case 'working': {
        // Worker is at their station. They will remain here until a new task is assigned.
        // No automatic task assignment from here.
        break;
      }
    }
  }

  // We need to update the store with the new state of all objects.
  setObjects([...objects]);
}

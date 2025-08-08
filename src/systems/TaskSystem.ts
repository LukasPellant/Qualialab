import useSandboxStore, { type GameObject, type Task } from '@/stores/useSandboxStore';
import { worldToGrid, findPath, findNearestWalkable } from '@/utils/grid';

// Simple FIFO task queues
const taskQueue: Task[] = [];

export function enqueueTask(task: Task) {
  taskQueue.push(task);
}

export function runTaskSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  // Note: workers list currently unused; assignment happens inline over updated objects

  const updated = objects.map((o: GameObject) => ({ ...o }));

  // Ensure workers with assignedTargetId keep a task
  for (const worker of updated.filter((w: GameObject) => w.type === 'worker')) {
    if (!worker.task && worker.assignedTargetId) {
      const target = updated.find((o: GameObject) => o.id === worker.assignedTargetId);
      if (target) {
        worker.task = { type: 'gather', resource: target.type === 'mine' ? 'stone' : 'wood', targetId: target.id } as Task;
        worker.state = 'moving';
      }
    }
  }

  // Assign tasks from queue to idle workers
  for (const worker of updated.filter((w: GameObject) => w.type === 'worker')) {
    if (worker.state === 'idle' && !worker.task && taskQueue.length > 0) {
      const task = taskQueue.shift()!;
      worker.task = task;
      worker.state = 'moving';

      // Determine target position
      let targetPos: [number, number, number];
      if (task.type === 'gather') {
        const target = updated.find((o: GameObject) => o.id === task.targetId);
        if (!target) continue;
        targetPos = target.position;
      } else {
        targetPos = task.targetPos;
      }

      // Compute path in grid coords
      const start = { x: worldToGrid(worker.position[0]), z: worldToGrid(worker.position[2]) };
      let end = { x: worldToGrid(targetPos[0]), z: worldToGrid(targetPos[2]) };
      end = findNearestWalkable(end);
      const path = findPath(start, end);
      worker.path = path as any;
      if (!path || path.length === 0) {
        // Already at destination tile → start working immediately
        worker.state = 'working';
        worker.timer = 0;
      }
    }
  }

  // Ensure moving workers with a task have a computed path
  for (const worker of updated.filter((w: GameObject) => w.type === 'worker')) {
    if (worker.state === 'moving' && worker.task && (!worker.path || worker.path.length === 0)) {
      let targetPos: [number, number, number];
      if (worker.task.type === 'gather') {
        const target = updated.find((o: GameObject) => o.id === worker.task!.targetId);
        if (!target) continue;
        targetPos = target.position;
      } else {
        targetPos = worker.task.targetPos;
      }
      const start = { x: worldToGrid(worker.position[0]), z: worldToGrid(worker.position[2]) };
      let end = { x: worldToGrid(targetPos[0]), z: worldToGrid(targetPos[2]) };
      end = findNearestWalkable(end);
      const path = findPath(start, end);
      worker.path = path as any;
      if (!path || path.length === 0) {
        worker.state = 'working';
        worker.timer = 0;
      }
    }
  }

  setObjects(updated);
}

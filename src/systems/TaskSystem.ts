import useSandboxStore, { type GameObject, type Task } from '@/stores/useSandboxStore';
import { worldToGrid, findPath, findNearestWalkable } from '@/utils/grid';

// Simple FIFO task queues
const taskQueue: Task[] = [];

export function enqueueTask(task: Task) {
  taskQueue.push(task);
}

export function runTaskSystem() {
  const { objects, setObjects } = useSandboxStore.getState() as any;
  let updated: GameObject[] | null = null;

  // Ensure workers with assignedTargetId keep a task
  for (let i = 0; i < objects.length; i += 1) {
    const obj = objects[i] as GameObject;
    if (obj.type !== 'worker') continue;
    if (!obj.task && obj.assignedTargetId) {
      const target = objects.find((o: GameObject) => o.id === obj.assignedTargetId);
      if (target) {
        if (!updated) updated = objects.slice();
        const clone = { ...obj } as GameObject;
        clone.task = { type: 'gather', resource: target.type === 'mine' ? 'stone' : 'wood', targetId: target.id } as Task;
        clone.state = 'moving';
        (updated as GameObject[])[i] = clone;
      }
    }
  }

  // Assign tasks from queue to idle workers
  const baseA = (updated || objects) as GameObject[];
  for (let i = 0; i < baseA.length; i += 1) {
    const worker = baseA[i] as GameObject;
    if (worker.type === 'worker' && worker.state === 'idle' && !worker.task && taskQueue.length > 0) {
      const task = taskQueue.shift()!;
      if (!updated) updated = objects.slice();
      const clone = { ...worker } as GameObject;
      clone.task = task;
      clone.state = 'moving';

      // Determine target position
      let targetPos: [number, number, number];
      if (task.type === 'gather') {
        const target = baseA.find((o: GameObject) => o.id === (task as Extract<Task, { type: 'gather' }>).targetId);
        if (!target) continue;
        targetPos = target.position;
      } else {
        targetPos = task.targetPos;
      }

      // Compute path in grid coords
      const start = { x: worldToGrid(clone.position[0]), z: worldToGrid(clone.position[2]) };
      let end = { x: worldToGrid(targetPos[0]), z: worldToGrid(targetPos[2]) };
      end = findNearestWalkable(end);
      const path = findPath(start, end);
      clone.path = path as any;
      if (!path || path.length === 0) {
        // Already at destination tile → start working immediately
        clone.state = 'working';
        clone.timer = 0;
      }
      (updated as GameObject[])[i] = clone;
    }
  }

  // Ensure moving workers with a task have a computed path
  const baseB = (updated || objects) as GameObject[];
  for (let i = 0; i < baseB.length; i += 1) {
    const worker = baseB[i] as GameObject;
    if (worker.type === 'worker' && worker.state === 'moving' && worker.task && (!worker.path || worker.path.length === 0)) {
      let targetPos: [number, number, number];
      if (worker.task.type === 'gather') {
        const target = baseB.find((o: GameObject) => o.id === (worker.task as Extract<Task, { type: 'gather' }>).targetId);
        if (!target) continue;
        targetPos = target.position;
      } else {
        targetPos = worker.task.targetPos;
      }
      const start = { x: worldToGrid(worker.position[0]), z: worldToGrid(worker.position[2]) };
      let end = { x: worldToGrid(targetPos[0]), z: worldToGrid(targetPos[2]) };
      end = findNearestWalkable(end);
      const path = findPath(start, end);
      if (!updated) updated = objects.slice();
      const clone = { ...worker } as GameObject;
      clone.path = path as any;
      if (!path || path.length === 0) {
        clone.state = 'working';
        clone.timer = 0;
      }
      (updated as GameObject[])[i] = clone;
    }
  }

  if (updated) setObjects(updated);
}

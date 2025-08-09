import { gridToWorld, findPath, worldToGrid, findNearestWalkable } from '@/utils/grid';
import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';

// Throttled movement updates to reduce state churn
let accumulator = 0;
const FAILSAFE_TIME = 3; // seconds without movement before re-pathing

export function runPathSystem(deltaSeconds: number) {
  accumulator += deltaSeconds;
  if (accumulator < 1 / 15) return; // ~15Hz update of store for smoother performance
  const actualDelta = accumulator;
  accumulator = 0;

  const { objects, setObjects } = useSandboxStore.getState() as any;
  const SPEED = 1.5; // m/s
  let updated: GameObject[] | null = null;

  for (let i = 0; i < objects.length; i += 1) {
    const obj = objects[i] as GameObject;
    if (obj.type !== 'worker') continue;
    const w = obj as GameObject;
    
    // Fail-safe: re-path if stuck for too long
    if (w.state === 'moving' && w.task) {
      const stuckTime = (w as any).stuckTime || 0;
      const newStuckTime = stuckTime + actualDelta;
      
      if (newStuckTime > FAILSAFE_TIME) {
        // Re-calculate path to target
        let targetPos: [number, number, number] | null = null;
        if (w.task.type === 'gather' && w.assignedTargetId) {
          const target = objects.find((o: GameObject) => o.id === w.assignedTargetId);
          if (target) targetPos = target.position;
        }
        
        if (targetPos) {
          const start = { x: worldToGrid(w.position[0]), z: worldToGrid(w.position[2]) };
          let end = { x: worldToGrid(targetPos[0]), z: worldToGrid(targetPos[2]) };
          end = findNearestWalkable(end);
          const newPath = findPath(start, end);
          
          if (!updated) updated = objects.slice();
          const clone = { ...w } as GameObject;
          clone.path = newPath && newPath.length > 0 ? newPath.slice(1) : null; // skip current position
          (clone as any).stuckTime = 0;
          
          if (!clone.path || clone.path.length === 0) {
            clone.state = 'working';
            clone.timer = 0;
          }
          (updated as GameObject[])[i] = clone;
          continue;
        }
      }
    }
    
    if (w.state !== 'moving' || !w.path || w.path.length === 0) continue;
    const [gridX, gridZ] = w.path[0];
    const nextX = gridToWorld(gridX);
    const nextZ = gridToWorld(gridZ);
    const dirX = nextX - w.position[0];
    const dirZ = nextZ - w.position[2];
    const len = Math.hypot(dirX, dirZ);
    const step = SPEED * actualDelta; // use actual time delta

    if (len <= step) {
      if (!updated) updated = objects.slice();
      const clone = { ...w } as GameObject;
      clone.position = [nextX, 0, nextZ];
      clone.path = [...(w.path || [])];
      clone.path.shift();
      (clone as any).stuckTime = 0; // reset stuck timer on successful movement
      if (clone.path.length === 0) {
        clone.state = 'working';
        clone.timer = 0;
      }
      (updated as GameObject[])[i] = clone;
      continue;
    }

    if (len > 0) {
      const nx = w.position[0] + (dirX / len) * step;
      const nz = w.position[2] + (dirZ / len) * step;
      if (w.position[0] !== nx || w.position[2] !== nz) {
        if (!updated) updated = objects.slice();
        const clone = { ...w } as GameObject;
        clone.position = [nx, 0, nz];
        (clone as any).stuckTime = 0; // reset stuck timer on movement
        (updated as GameObject[])[i] = clone;
      } else {
        // No movement - increment stuck time
        if (!updated) updated = objects.slice();
        const clone = { ...w } as GameObject;
        (clone as any).stuckTime = ((w as any).stuckTime || 0) + actualDelta;
        (updated as GameObject[])[i] = clone;
      }
    }
  }

  if (updated) setObjects(updated);
}

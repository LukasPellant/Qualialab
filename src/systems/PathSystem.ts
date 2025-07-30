import { findPath, worldToGrid, gridToWorld } from '@/utils/grid';
import useSandboxStore from '@/stores/useSandboxStore';

export function assignPath(entity: any, target: any) {
  if (entity.targetId === target.id && entity.path && entity.path.length > 0) {
    return; // Skip if target is the same and path exists
  }

  const start = {
    x: worldToGrid(entity.position[0]),
    z: worldToGrid(entity.position[2]),
  };
  const end = {
    x: worldToGrid(target.position[0]),
    z: worldToGrid(target.position[2]),
  };

  const path = findPath(start, end);

  if (path.length === 0) {
    console.warn('Path not found for', entity.id, { start, end });
    return;
  }

  // The path is in grid coordinates, so we don't convert it back here.
  // We will convert it step-by-step in the runPathSystem.
  entity.path = path;
}

export function runPathSystem(delta: number) {
  const { objects } = useSandboxStore.getState();
  objects
    objects
    objects
    .filter((o: any) => o.type === 'worker' && o.state === 'moving' && o.path && o.path.length)
    .forEach((w: any) => {
      const [gridX, gridZ] = w.path[0];

      // Convert the next grid point to world coordinates for movement.
      const nextWorldX = gridToWorld(gridX);
      const nextWorldZ = gridToWorld(gridZ);

      const dir = [nextWorldX - w.position[0], 0, nextWorldZ - w.position[2]];
      const len = Math.hypot(dir[0], dir[2]);
      const speed = 2 * delta; // Using a fixed speed of 2 units per second.

      if (len < 0.1) { // Use a small threshold for arrival
        w.position = [nextWorldX, w.position[1], nextWorldZ];
        w.path.shift();
      } else {
        w.position[0] += (dir[0] / len) * speed;
        w.position[2] += (dir[2] / len) * speed;
      }
    });
}

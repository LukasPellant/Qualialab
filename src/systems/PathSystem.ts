import { findPath } from '@/utils/grid';
import useSandboxStore from '@/stores/useSandboxStore';

export function assignPath(entity: any, target: any) {
  if (entity.targetId === target.id && entity.path && entity.path.length > 0) {
    return; // Skip if target is the same and path exists
  }
  const path = findPath(
    { x: Math.round(entity.position[0]), z: Math.round(entity.position[2]) },
    { x: Math.round(target.position[0]), z: Math.round(target.position[2]) }
  );
  if (path.length === 0) {
    console.warn('Path not found', entity.id);
    return;
  }
  entity.path = path;
}

export function runPathSystem(delta: number) {
  const { objects } = useSandboxStore.getState();
  objects
    .filter((o: any) => o.type === 'worker' && o.path && o.path.length)
    .forEach((w: any) => {
      const [nextX, nextZ] = w.path[0];
      const dir = [nextX - w.position[0], 0, nextZ - w.position[2]];
      const len = Math.hypot(dir[0], dir[2]);
      const speed = 0.02 * delta;
      if (len < speed) {
        w.position = [nextX, w.position[1], nextZ];
        w.path.shift();
      } else {
        w.position[0] += (dir[0] / len) * speed;
        w.position[2] += (dir[2] / len) * speed;
      }
    });
}
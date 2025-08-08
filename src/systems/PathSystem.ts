import { gridToWorld } from '@/utils/grid';
import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';

// Moves along precomputed grid path; does not recompute here
export function runPathSystem(deltaSeconds: number) {
  const { objects, setObjects } = useSandboxStore.getState() as any;

  const SPEED = 1.5; // m/s
  const updated = objects.map((o: GameObject) => ({ ...o }));

  for (const w of updated.filter((o: GameObject) => o.type === 'worker')) {
    if (w.state !== 'moving' || !w.path || w.path.length === 0) continue;
    const [gridX, gridZ] = w.path[0];
    const nextX = gridToWorld(gridX);
    const nextZ = gridToWorld(gridZ);
    const dirX = nextX - w.position[0];
    const dirZ = nextZ - w.position[2];
    const len = Math.hypot(dirX, dirZ);
    const step = SPEED * deltaSeconds;

    if (len <= step) {
      // Reaching or overshooting the node → snap
      w.position = [nextX, w.position[1], nextZ];
      w.path.shift();
      if (w.path.length === 0) {
        w.state = 'working';
        w.timer = 0;
      }
      continue;
    }

    if (len > 0) {
      const nx = w.position[0] + (dirX / len) * step;
      const nz = w.position[2] + (dirZ / len) * step;
      w.position = [nx, w.position[1], nz];
    }
  }

  setObjects(updated);
}

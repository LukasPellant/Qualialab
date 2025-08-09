import { gridToWorld } from '@/utils/grid';
import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';

// Moves along precomputed grid path; does not recompute here
export function runPathSystem(deltaSeconds: number) {
  const { objects, setObjects } = useSandboxStore.getState() as any;

  const SPEED = 1.5; // m/s
  let anyChanged = false;
  let updated: GameObject[] | null = null;

  for (let i = 0; i < objects.length; i += 1) {
    const obj = objects[i] as GameObject;
    if (obj.type !== 'worker') continue;
    const w = obj as GameObject;
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
      if (!updated) updated = objects.slice();
      const clone = { ...w } as GameObject;
      clone.position = [nextX, 0, nextZ];
      clone.path = [...(w.path || [])];
      clone.path.shift();
      if (clone.path.length === 0) {
        clone.state = 'working';
        clone.timer = 0;
      }
      (updated as GameObject[])[i] = clone;
      anyChanged = true;
      continue;
    }

    if (len > 0) {
      const nx = w.position[0] + (dirX / len) * step;
      const nz = w.position[2] + (dirZ / len) * step;
      if (w.position[0] !== nx || w.position[2] !== nz) {
        if (!updated) updated = objects.slice();
        const clone = { ...w } as GameObject;
        clone.position = [nx, 0, nz];
        (updated as GameObject[])[i] = clone;
        anyChanged = true;
      }
    }
  }

  if (anyChanged) setObjects(updated!);
}

// Grid dimensions - easy to change
import * as PF from 'pathfinding';

// 2-D array 64x64, 0 = walkable, 1 = blocked
export const GRID_SIZE = 64;
export const gridData = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0)
);

const inBounds = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < GRID_SIZE && y < GRID_SIZE;

export function setBlocked(x: number, z: number, val = 1) {
  if (inBounds(x, z)) {
    gridData[z][x] = val;
  }
}

export const finder = new PF.AStarFinder({
  diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle,
});

export function nearestWalkable(x: number, y: number, maxR = 5): [number, number] | null {
  for (let r = 1; r <= maxR; r++) {
    for (let dx = -r; dx <= r; dx++) {
      const dy = r - Math.abs(dx);
      for (const sign of [-1, 1]) {
        const nx = x + dx, ny = y + dy * sign;
        if (inBounds(nx, ny) && new PF.Grid(gridData).isWalkableAt(nx, ny)) return [nx, ny];
      }
    }
  }
  return null;
}

const DEBUG = true; // Set to true for debugging

export function findPath(from: { x: number; z: number }, to: { x: number; z: number }) {
  let sx = Math.floor(from.x);
  let sy = Math.floor(from.z);
  let ex = Math.floor(to.x);
  let ey = Math.floor(to.z);

  const matrix = gridData.map(row => [...row]); // Deep clone the gridData
  const grid = new PF.Grid(matrix);

  if (DEBUG) {
    console.table({
      sx, sy, ex, ey,
      startWalkable: inBounds(sx, sy) && grid.isWalkableAt(sx, sy),
      endWalkable: inBounds(ex, ey) && grid.isWalkableAt(ex, ey)
    });
  }

  if (!inBounds(sx, sy) || !inBounds(ex, ey)) {
    return [];
  }

  if (!grid.isWalkableAt(ex, ey)) {
    const alt = nearestWalkable(ex, ey);
    if (!alt) return [];
    ex = alt[0];
    ey = alt[1];
  }

  return finder.findPath(sx, sy, ex, ey, grid);
}
import PF from 'pathfinding';

export const GRID_SIZE = 64;
const gridData = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0)
);

// The world is centered at (0,0), but the grid is indexed from (0,0).
// This offset is used to convert between the two coordinate systems.
const OFFSET = GRID_SIZE / 2;

export const worldToGrid = (v: number) => Math.round(v + OFFSET);
export const gridToWorld = (v: number) => v - OFFSET;

// This function modifies the base grid data using GRID coordinates.
export function setBlocked(x: number, z: number, val = 1) {
  if (gridData[z] && gridData[z][x] !== undefined) {
    gridData[z][x] = val;
  }
}

const finder = new PF.AStarFinder({
  diagonalMovement: PF.DiagonalMovement.Never,
});

// This function expects GRID coordinates.
export function findPath(from: { x: number; z: number }, to: { x: number; z: number }) {
  // Clamp coordinates to be safe, preventing out-of-bounds errors.
  const clamp = (v: number) => Math.max(0, Math.min(GRID_SIZE - 1, v));
  const sx = clamp(from.x);
  const sz = clamp(from.z);
  const tx = clamp(to.x);
  const tz = clamp(to.z);

  if (from.x !== sx || from.z !== sz || to.x !== tx || to.z !== tz) {
    console.warn('Pathfinding coordinates were out of bounds and clamped', { from, to });
  }

  // If start and end points are the same, return an empty path.
  if (sx === tx && sz === tz) return [];

  const tempGrid = new PF.Grid(gridData);
  return finder.findPath(sx, sz, tx, tz, tempGrid);
}

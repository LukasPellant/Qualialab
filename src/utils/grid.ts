import PF from 'pathfinding';

// 2‑D pole 64×64, 0 = walkable, 1 = blok
export const GRID_SIZE = 64;
export const gridData = Array.from({ length: GRID_SIZE }, () =>
  Array(GRID_SIZE).fill(0)
);

export function setBlocked(x: number, z: number, val: number = 1) {
  if (gridData[z] && gridData[z][x] !== undefined) gridData[z][x] = val;
}

export const finder = new PF.AStarFinder({
  diagonalMovement: PF.DiagonalMovement.Never,
});

export function findPath(from: { x: number; z: number }, to: { x: number; z: number }) {
  const grid = new PF.Grid(gridData).clone();
  return finder.findPath(from.x, from.z, to.x, to.z, grid);
}

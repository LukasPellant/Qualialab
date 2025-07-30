import { findPath, setBlocked, gridData, GRID_SIZE } from './grid';

describe('Pathfinding', () => {
  beforeEach(() => {
    // Reset the grid before each test
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        gridData[i][j] = 0;
      }
    }
  });

  it('should find a direct path', () => {
    const path = findPath({ x: 0, z: 0 }, { x: 5, z: 5 });
    expect(path.length).toBe(11); // 5 steps right, 5 steps down
  });

  it('should find a path around an obstacle', () => {
    // Block a path
    for (let i = 0; i < 5; i++) {
      setBlocked(2, i);
    }

    const path = findPath({ x: 0, z: 2 }, { x: 4, z: 2 });
    expect(path.length).toBeGreaterThan(5); // Should be longer than the direct path
  });

  it('should return an empty array if no path is found', () => {
    // Completely block the target
    setBlocked(4, 5);
    setBlocked(5, 4);
    setBlocked(6, 5);
    setBlocked(5, 6);

    const path = findPath({ x: 5, z: 5 }, { x: 10, z: 10 });
    // This test is tricky, as the A* might still find a way around.
    // A better test would be to completely wall off the target.
    for (let i = 0; i < GRID_SIZE; i++) {
        setBlocked(i, 7)
    }
    const noPath = findPath({x: 5, z: 5}, {x: 5, z: 10});
    expect(noPath.length).toBe(0);
  });
});

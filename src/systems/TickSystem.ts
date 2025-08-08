/// <reference types="node" />

// Ticking pipeline: Resource → Task → Worker → Event (Path runs per-frame)
import { runResourceSystem } from './ResourceSystem';
import { runTaskSystem } from './TaskSystem';
import { runWorkerSystem } from './WorkerSystem';

const TICK_MS = 1000;
let tickId = 0;
let interval: NodeJS.Timeout | null = null;

export function startGameLoop() {
  if (interval) return;
  interval = setInterval(() => {
    tickId += 1;
    runResourceSystem();
    runTaskSystem();
    runWorkerSystem();
    window.dispatchEvent(new CustomEvent('tick', { detail: tickId }));
  }, TICK_MS);
}

export function stopGameLoop() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
}
/// <reference types="node" />

// Spouští všechny systémy každou sekundu
import { runResourceSystem } from './ResourceSystem';
import { runWorkerSystem } from './WorkerSystem';

const TICK_MS = 1000;
let tickId = 0;
let interval: NodeJS.Timeout | null = null;

export function startGameLoop() {
  if (interval) return;
  interval = setInterval(() => {
    tickId += 1;
    runResourceSystem();
    runWorkerSystem();
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
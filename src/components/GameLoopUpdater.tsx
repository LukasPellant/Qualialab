import { useFrame } from '@react-three/fiber';
import { runPathSystem } from '@/systems/PathSystem';

export default function GameLoopUpdater() {
  useFrame((_, delta) => {
    const clamped = Math.min(delta, 0.05);
    runPathSystem(clamped);
  });
  return null;
}

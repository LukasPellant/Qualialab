import { useFrame } from '@react-three/fiber';
import { runPathSystem } from '@/systems/PathSystem';

// Per-frame updater for smooth movement
export default function GameLoopUpdater() {
  useFrame((_, delta) => {
    runPathSystem(delta);
  });
  return null;
}

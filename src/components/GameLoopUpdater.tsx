import { useFrame } from '@react-three/fiber';
import { runPathSystem } from '../systems/PathSystem';
import { runTaskSystem } from '../systems/TaskSystem';

export default function GameLoopUpdater() {
  useFrame((_state, delta) => {
    runPathSystem(delta);
    runTaskSystem();
  });
  return null;
}

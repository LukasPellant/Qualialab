import { useFrame } from '@react-three/fiber';
import { runPathSystem } from '../systems/PathSystem';

export default function GameLoopUpdater() {
  useFrame((_state, delta) => {
    runPathSystem(delta);
  });
  return null;
}

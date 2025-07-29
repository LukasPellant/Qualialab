import useSandboxStore from '../stores/useSandboxStore';
import useResourceStore from '../stores/useResourceStore';
import { nanoid } from 'nanoid';

export function runWorkerSystem() {
  const { objects, setObjects } = useSandboxStore.getState();
  const res = useResourceStore.getState();

  // Příklad: pokud je dřeva < 20, pošli workera do lesa
  if (res.wood < 20) {
    const forest = objects.find((o) => o.type === 'forest' && (o.woodStock ?? 0) > 0);
    const worker = objects.find((o) => o.type === 'worker' && !o.task);
    if (forest && worker && forest.woodStock) {
      // přiřaď úkol
      worker.task = { type: 'chop', targetId: forest.id, id: nanoid() };
      forest.woodStock -= 1;
      useResourceStore.setState({ wood: res.wood + 1 });
    }
  }

  // Dodatečná logika pohybu / dokončení úkolu by šla sem
  setObjects([...objects]);
}

import { useState } from 'react';
import { type GameObject } from '../stores/useSandboxStore';

interface BuildMenuUIProps {
  onSelectBuilding: (type: GameObject['type']) => void;
}

const BUILDINGS = ['farm', 'mine'];

export default function BuildMenuUI({ onSelectBuilding }: BuildMenuUIProps) {
  const [selected, setSelected] = useState<GameObject['type']>('farm');

  return (
    <div className="absolute bottom-2 right-2 bg-white p-2 rounded shadow">
      <select value={selected} onChange={(e) => {
        setSelected(e.target.value as GameObject['type']);
        onSelectBuilding(e.target.value as GameObject['type']);
      }}>
        {BUILDINGS.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>
    </div>
  );
}

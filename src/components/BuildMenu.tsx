import { useState } from 'react';
import useSandboxStore from '@/stores/useSandboxStore';

const BUILDINGS = ['farm', 'mine'];

export default function BuildMenu() {
  const { selectedBuildingType, setSelectedBuildingType } = useSandboxStore();

  return (
    <div style={{ position: 'fixed', top: 8, right: 8, background: 'white', padding: 8, borderRadius: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
      <select value={selectedBuildingType} onChange={(e) => setSelectedBuildingType(e.target.value as any)}>
        {BUILDINGS.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>
    </div>
  );
}
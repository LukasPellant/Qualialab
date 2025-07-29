import { useEffect, useState } from 'react';
import useResourceStore from '../stores/useResourceStore';
import { Card, CardContent } from '@mui/material';

export default function HUD() {
  const resources = useResourceStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent) => setTick(e.detail);
    window.addEventListener('tick', handler as EventListener);
    return () => window.removeEventListener('tick', handler as EventListener);
  }, []);

  return (
    <Card className="fixed top-2 left-2 p-4 space-y-1 rounded-2xl shadow-xl bg-white/70 backdrop-blur">
      <CardContent className="space-y-1 text-sm">
        <div>Tick: {tick}</div>
        {Object.entries(resources).map(([k, v]) => (
          <div key={k}>
            {k}: {v}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
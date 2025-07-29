import { useEffect, useState } from 'react';
import useResourceStore from '../stores/useResourceStore';
import { Card, CardContent, Typography } from '@mui/material'; // Assuming @mui/material for Card and CardContent

export default function HUD() {
  const resources = useResourceStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent) => setTick(e.detail);
    window.addEventListener('tick', handler as EventListener);
    return () => window.removeEventListener('tick', handler as EventListener);
  }, []);

  return (
    <Card sx={{
      position: 'absolute',
      top: 16,
      left: 16,
      p: 2,
      borderRadius: 2,
      boxShadow: 3,
      bgcolor: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(5px)'
    }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="body2">Tick: {tick}</Typography>
        {Object.entries(resources).filter(([k]) => k !== 'reset').map(([k, v]) => (
          <Typography variant="body2" key={k}>
            {k}: {v}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}

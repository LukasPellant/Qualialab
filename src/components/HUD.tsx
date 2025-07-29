import { useEffect, useState } from 'react';
import useResourceStore from '../stores/useResourceStore';
import { Paper, Typography, Stack, Box } from '@mui/material';

export default function HUD() {
  const resources = useResourceStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent) => setTick(e.detail);
    window.addEventListener('tick', handler as EventListener);
    return () => window.removeEventListener('tick', handler as EventListener);
  }, []);

  return (
    <Paper 
      elevation={3} 
      square
      sx={{
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        p: 1,
        width: '100%',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Typography variant="body2" sx={{ minWidth: '80px' }}>Tick: {tick}</Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          {Object.entries(resources).map(([key, value]) => (
            <Typography variant="body2" key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </Typography>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
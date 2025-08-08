import { useEffect, useState } from 'react';
import useResourceStore from '../stores/useResourceStore';
import usePopulationStore from '@/stores/usePopulationStore';
import { Paper, Typography, Stack, Box } from '@mui/material';

export default function HUD() {
  const { wood, stone, food, gold } = useResourceStore();
  const { idle, cap, recruitTimer } = usePopulationStore();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = (e: CustomEvent) => setTick(e.detail);
    window.addEventListener('tick', handler as EventListener);
    return () => window.removeEventListener('tick', handler as EventListener);
  }, []);

  return (
    <Paper 
      elevation={3} 
      sx={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        p: 1,
        borderRadius: 2,
        backdropFilter: 'blur(5px)',
        zIndex: 10 // Ensure it's above the canvas
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center" sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2" sx={{ minWidth: '80px' }}>Tick: {tick}</Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Typography variant="body2">Wood: {wood}</Typography>
          <Typography variant="body2">Stone: {stone}</Typography>
          <Typography variant="body2">Food: {food}</Typography>
          <Typography variant="body2">Gold: {gold}</Typography>
          <Typography variant="body2">👥 {idle} / {cap}{recruitTimer > 0 ? ` (recruit ${recruitTimer}s)` : ''}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

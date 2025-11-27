import { useEffect, useState } from 'react';
import useResourceStore from '../stores/useResourceStore';
import usePopulationStore from '@/stores/usePopulationStore';
import useSandboxStore from '@/stores/useSandboxStore';
import { Paper, Typography, Stack, Box } from '@mui/material';

export default function HUD() {
  const { wood, stone, food, gold } = useResourceStore();
  const { idle, cap, recruitTimer } = usePopulationStore();
  const { rates } = useSandboxStore();
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
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2">Wood: {Math.floor(wood)}</Typography>
            <Typography variant="caption" color={rates.woodPerMin >= 0 ? 'lightgreen' : 'lightcoral'}>
              {rates.woodPerMin >= 0 ? '↑' : '↓'}{Math.abs(rates.woodPerMin).toFixed(1)}/min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2">Stone: {Math.floor(stone)}</Typography>
            <Typography variant="caption" color={rates.stonePerMin >= 0 ? 'lightgreen' : 'lightcoral'}>
              {rates.stonePerMin >= 0 ? '↑' : '↓'}{Math.abs(rates.stonePerMin).toFixed(1)}/min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2">Food: {Math.floor(food)}</Typography>
            <Typography variant="caption" color={(rates.netFoodPerMin ?? (rates.foodPerMin - rates.consumptionPerMin)) >= 0 ? 'lightgreen' : 'lightcoral'}>
              {(rates.netFoodPerMin ?? (rates.foodPerMin - rates.consumptionPerMin)) >= 0 ? '↑' : '↓'}
              {Math.abs(rates.netFoodPerMin ?? (rates.foodPerMin - rates.consumptionPerMin)).toFixed(1)}/min
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2">Gold: {Math.floor(gold)}</Typography>
            <Typography variant="caption" color={rates.goldPerMin >= 0 ? 'lightgreen' : 'lightcoral'}>
              {rates.goldPerMin >= 0 ? '↑' : '↓'}{Math.abs(rates.goldPerMin).toFixed(1)}/min
            </Typography>
          </Box>
          <Typography variant="body2">👥 {idle} / {cap}{recruitTimer > 0 ? ` (recruit ${recruitTimer}s)` : ''}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

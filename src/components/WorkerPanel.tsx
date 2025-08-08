import { useMemo } from 'react';
import { Paper, Typography, IconButton, Box, Stack, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';
import usePopulationStore from '@/stores/usePopulationStore';

export default function WorkerPanel() {
  const { objects, setObjects, openTownHallId, setOpenTownHallId } = useSandboxStore();
  const { idle, cap, recruitTimer } = usePopulationStore();

  const { buildings, idleWorkers } = useMemo(() => {
    const buildings = objects.filter((o) => ['farm', 'mine', 'forest'].includes(o.type));
    const idleWorkers = objects.filter((o) => o.type === 'worker' && o.state === 'idle');
    return { buildings, idleWorkers } as { buildings: GameObject[]; idleWorkers: GameObject[] };
  }, [objects]);

  const assignOne = (buildingId: string) => {
    setObjects((prev: GameObject[]) => {
      const next = prev.map((o) => ({ ...o }));
      const b = next.find((o) => o.id === buildingId);
      if (!b) return next;
      const capacity = b.workerCapacity ?? 0;
      const assigned = b.assignedWorkers ?? [];
      const freeSlots = Math.max(0, capacity - assigned.length);
      if (freeSlots <= 0) return next;
      const idle = next.find((o) => o.type === 'worker' && o.state === 'idle');
      if (!idle) return next;
      idle.assignedTargetId = b.id;
      b.assignedWorkers = [...assigned, idle.id];
      // Mark worker to move on next TaskSystem tick
      const res = b.type === 'mine' ? 'stone' : b.type === 'forest' ? 'wood' : 'food';
      idle.task = { type: 'gather', resource: res as any, targetId: b.id } as any;
      idle.state = 'moving';
      return next;
    });
  };

  const unassignOne = (buildingId: string) => {
    setObjects((prev: GameObject[]) => {
      const next = prev.map((o) => ({ ...o }));
      const b = next.find((o) => o.id === buildingId);
      if (!b || !b.assignedWorkers || b.assignedWorkers.length === 0) return next;
      const workerId = b.assignedWorkers[b.assignedWorkers.length - 1];
      const w = next.find((o) => o.id === workerId);
      if (w) {
        w.assignedTargetId = null;
        w.task = null;
        w.state = 'idle';
      }
      b.assignedWorkers = b.assignedWorkers.slice(0, -1);
      return next;
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        p: 2,
        borderRadius: 2,
        backdropFilter: 'blur(5px)',
        width: 360,
        maxHeight: 420,
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Work Allocation
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
        Idle: {idleWorkers.length}
      </Typography>
      <Divider sx={{ mb: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
      <Stack spacing={1.5}>
        {buildings.map((b) => (
          <Box key={b.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2">
                {b.type.toUpperCase()} — {b.id}
                {b.type === 'forest' && typeof b.stock?.wood === 'number' && (
                  <>
                    {' '}· Stock: {b.stock.wood}
                  </>
                )}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Assigned {b.assignedWorkers?.length ?? 0} / {b.workerCapacity ?? 0}
              </Typography>
            </Box>
            <IconButton size="small" color="inherit" onClick={() => unassignOne(b.id)}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="inherit" onClick={() => assignOne(b.id)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Dialog open={!!openTownHallId} onClose={() => setOpenTownHallId(null)}>
        <DialogTitle>Town Hall</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Population: {idle} / {cap}</Typography>
          <Typography variant="body2">Recruit: {recruitTimer > 0 ? `${recruitTimer}s remaining` : 'Idle'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTownHallId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}



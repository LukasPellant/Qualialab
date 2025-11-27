import useSandboxStore, { type GameObject } from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';
import { getBuildingConfig } from '@/data/buildingData';
import { Paper, Typography, Select, MenuItem, FormControl, InputLabel, Box, Chip, Stack } from '@mui/material';

const BUILDINGS: GameObject['type'][] = ['farm', 'mine', 'house', 'warehouse', 'market', 'bakery', 'blacksmith', 'lumbermill', 'tavern'];

export default function BuildMenu() {
  const { selectedBuildingType, setSelectedBuildingType } = useSandboxStore();
  const resources = useResourceStore();

  const handleSelectBuilding = (type: GameObject['type']) => {
    setSelectedBuildingType(type);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        p: 2,
        borderRadius: 2,
        backdropFilter: 'blur(5px)',
        width: '200px'
      }}
    >
      <Typography variant="h6" gutterBottom>Build Menu</Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Chip size="small" label={`Wood: ${resources.wood}`} color="default" />
        <Chip size="small" label={`Stone: ${resources.stone}`} color="default" />
        <Chip size="small" label={`Food: ${resources.food}`} color="default" />
        <Chip size="small" label={`Gold: ${resources.gold}`} color="default" />
      </Stack>
      <FormControl fullWidth size="small">
        <InputLabel id="building-select-label" sx={{ color: 'white' }}>Building</InputLabel>
        <Select
          labelId="building-select-label"
          value={selectedBuildingType || ''}
          label="Building"
          onChange={(e) => {
            const newType = e.target.value as GameObject['type'];
            handleSelectBuilding(newType);
          }}
          sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}
        >
          {BUILDINGS.map((b) => {
            const config = getBuildingConfig(b);
            const cost = config?.cost || {};
            const affordable =
              (cost.wood ?? 0) <= resources.wood &&
              (cost.stone ?? 0) <= resources.stone &&
              (cost.food ?? 0) <= resources.food &&
              (cost.gold ?? 0) <= resources.gold;
            return (
              <MenuItem key={b} value={b} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                <span>{b.charAt(0).toUpperCase() + b.slice(1)}</span>
                <Box component="span" sx={{ opacity: affordable ? 1 : 0.5, fontSize: 12 }}>
                  {['wood', 'stone', 'food', 'gold']
                    .filter((k) => (cost as any)[k])
                    .map((k) => `${k[0].toUpperCase() + k.slice(1)}:${(cost as any)[k]}`)
                    .join(' ')}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Paper>
  );
}
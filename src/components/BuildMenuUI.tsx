import { useState } from 'react';
import { type GameObject } from '../stores/useSandboxStore';
import { Paper, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

interface BuildMenuUIProps {
  onSelectBuilding: (type: GameObject['type']) => void;
}

const BUILDINGS: GameObject['type'][] = ['farm', 'mine'];

export default function BuildMenuUI({ onSelectBuilding }: BuildMenuUIProps) {
  const [selected, setSelected] = useState<GameObject['type']>('farm');

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
      <FormControl fullWidth size="small">
        <InputLabel id="building-select-label" sx={{ color: 'white' }}>Building</InputLabel>
        <Select
          labelId="building-select-label"
          value={selected}
          label="Building"
          onChange={(e) => {
            const newType = e.target.value as GameObject['type'];
            setSelected(newType);
            onSelectBuilding(newType);
          }}
          sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' } }}
        >
          {BUILDINGS.map((b) => (
            <MenuItem key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
}
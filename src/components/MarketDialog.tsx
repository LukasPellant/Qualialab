import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useSandboxStore from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';
import useMarketStore from '@/stores/useMarketStore';

export default function MarketDialog() {
  const { openMarketId, setOpenMarketId } = useSandboxStore();
  const resources = useResourceStore();
  const market = useMarketStore();
  const [selectedResource, setSelectedResource] = useState<'wood' | 'stone' | 'food'>('wood');
  const [quantity, setQuantity] = useState(1);

  const isOpen = !!openMarketId;

  const handleBuy = () => {
    const cost = market.buyResource(selectedResource, quantity);
    if (resources.gold >= cost) {
      resources.addResources({ 
        gold: -cost,
        [selectedResource]: quantity 
      } as any);
    }
  };

  const handleSell = () => {
    const resourceAmount = resources[selectedResource];
    if (resourceAmount >= quantity) {
      const revenue = market.sellResource(selectedResource, quantity);
      resources.addResources({ 
        gold: revenue,
        [selectedResource]: -quantity 
      } as any);
    }
  };

  const canBuy = resources.gold >= (market.prices[selectedResource] * quantity);
  const canSell = resources[selectedResource] >= quantity;

  return (
    <Dialog open={isOpen} onClose={() => setOpenMarketId(null)} maxWidth="sm" fullWidth>
      <DialogTitle>Market Trading</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          {/* Current Resources */}
          <Box>
            <Typography variant="h6" gutterBottom>Your Resources</Typography>
            <Stack direction="row" spacing={2}>
              <Chip label={`Wood: ${Math.floor(resources.wood)}`} />
              <Chip label={`Stone: ${Math.floor(resources.stone)}`} />
              <Chip label={`Food: ${Math.floor(resources.food)}`} />
              <Chip label={`Gold: ${Math.floor(resources.gold)}`} color="primary" />
            </Stack>
          </Box>

          <Divider />

          {/* Resource Selection */}
          <Box>
            <Typography variant="h6" gutterBottom>Select Resource</Typography>
            <Stack direction="row" spacing={1}>
              {(['wood', 'stone', 'food'] as const).map((resource) => (
                <Button
                  key={resource}
                  variant={selectedResource === resource ? 'contained' : 'outlined'}
                  onClick={() => setSelectedResource(resource)}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {resource}
                </Button>
              ))}
            </Stack>
          </Box>

          {/* Current Prices */}
          <Box>
            <Typography variant="h6" gutterBottom>Current Prices</Typography>
            <Stack spacing={1}>
              {(['wood', 'stone', 'food'] as const).map((resource) => (
                <Box key={resource} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ textTransform: 'capitalize' }}>{resource}:</Typography>
                  <Typography>{market.prices[resource].toFixed(2)} gold</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Quantity Selection */}
          <Box>
            <Typography variant="h6" gutterBottom>Quantity</Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <Typography variant="h6" sx={{ minWidth: '60px', textAlign: 'center' }}>
                {quantity}
              </Typography>
              <IconButton onClick={() => setQuantity(quantity + 1)}>
                <AddIcon />
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button size="small" onClick={() => setQuantity(5)}>5</Button>
              <Button size="small" onClick={() => setQuantity(10)}>10</Button>
              <Button size="small" onClick={() => setQuantity(20)}>20</Button>
            </Stack>
          </Box>

          {/* Transaction Preview */}
          <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" gutterBottom>Transaction Preview</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Buy {quantity} {selectedResource}:</Typography>
              <Typography color={canBuy ? 'text.primary' : 'error'}>
                {(market.prices[selectedResource] * quantity).toFixed(2)} gold
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Sell {quantity} {selectedResource}:</Typography>
              <Typography color={canSell ? 'text.primary' : 'error'}>
                +{(market.prices[selectedResource] * quantity).toFixed(2)} gold
              </Typography>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenMarketId(null)}>Close</Button>
        <Button 
          variant="contained" 
          color="error"
          onClick={handleSell}
          disabled={!canSell}
        >
          Sell
        </Button>
        <Button 
          variant="contained"
          onClick={handleBuy}
          disabled={!canBuy}
        >
          Buy
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  CardActions,
  
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useSandboxStore from '@/stores/useSandboxStore';
import useResourceStore from '@/stores/useResourceStore';
import { getBuildingConfig, getUpgradesForBuilding, getUpgradeConfig } from '@/data/buildingData';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`building-tabpanel-${index}`}
      aria-labelledby={`building-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function BuildingPanel() {
  const { selectedBuildingId, setSelectedBuildingId, objects, setObjects, addUpgradeToBuilding } = useSandboxStore();
  const resources = useResourceStore();
  const [tabValue, setTabValue] = useState(0);

  const building = objects.find(obj => obj.id === selectedBuildingId);
  const isOpen = !!selectedBuildingId && !!building;

  if (!building) return null;

  const config = getBuildingConfig(building.type);
  const availableUpgrades = getUpgradesForBuilding(building.type);
  const existingUpgrades = building.upgrades || [];

  const assignWorker = () => {
    if (!building.assignedWorkers || !building.workerCapacity) return;
    setObjects((prev) => {
      const next = prev.map(o => ({ ...o }));
      const b = next.find(o => o.id === building.id);
      if (!b) return next;
      const idle = next.find(o => o.type === 'worker' && o.state === 'idle');
      if (!idle || (b.assignedWorkers?.length || 0) >= (b.workerCapacity || 0)) return next;
      
      idle.assignedTargetId = b.id;
      b.assignedWorkers = [...(b.assignedWorkers || []), idle.id];
      const res = b.type === 'mine' ? 'stone' : b.type === 'forest' ? 'wood' : 'food';
      idle.task = { type: 'gather', resource: res as any, targetId: b.id } as any;
      idle.state = 'moving';
      return next;
    });
  };

  const unassignWorker = () => {
    if (!building.assignedWorkers || building.assignedWorkers.length === 0) return;
    setObjects((prev) => {
      const next = prev.map(o => ({ ...o }));
      const b = next.find(o => o.id === building.id);
      if (!b || !b.assignedWorkers || b.assignedWorkers.length === 0) return next;
      const workerId = b.assignedWorkers[b.assignedWorkers.length - 1];
      const w = next.find(o => o.id === workerId);
      if (w) {
        w.assignedTargetId = null;
        w.task = null;
        w.state = 'idle';
      }
      b.assignedWorkers = b.assignedWorkers.slice(0, -1);
      return next;
    });
  };

  const buildUpgrade = (upgradeId: string) => {
    const upgrade = getUpgradeConfig(upgradeId);
    if (!upgrade) return;

    const cost = upgrade.cost;
    const canAfford =
      (cost.wood ?? 0) <= resources.wood &&
      (cost.stone ?? 0) <= resources.stone &&
      (cost.food ?? 0) <= resources.food &&
      (cost.gold ?? 0) <= resources.gold;

    if (!canAfford) return;

    resources.addResources({
      wood: -(cost.wood ?? 0),
      stone: -(cost.stone ?? 0),
      food: -(cost.food ?? 0),
      gold: -(cost.gold ?? 0),
    } as any);

    addUpgradeToBuilding(building.id, upgradeId);
  };

  return (
    <Dialog open={isOpen} onClose={() => setSelectedBuildingId(null)} maxWidth="md" fullWidth>
      <DialogTitle>
        {building.type.charAt(0).toUpperCase() + building.type.slice(1)} - {building.id}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Workers" />
            <Tab label="Storage" />
            <Tab label="Upgrades" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {config?.jobs && config.jobs > 0 ? (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6">Worker Assignment</Typography>
                <Chip 
                  label={`${building.assignedWorkers?.length || 0} / ${building.workerCapacity || 0}`}
                  color="primary"
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RemoveIcon />}
                  onClick={unassignWorker}
                  disabled={!building.assignedWorkers || building.assignedWorkers.length === 0}
                >
                  Remove Worker
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={assignWorker}
                  disabled={(building.assignedWorkers?.length || 0) >= (building.workerCapacity || 0)}
                >
                  Assign Worker
                </Button>
              </Box>
            </Stack>
          ) : (
            <Typography color="text.secondary">This building doesn't use workers.</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {building.storageMax && Object.keys(building.storageMax).length > 0 ? (
            <Stack spacing={2}>
              <Typography variant="h6">Storage</Typography>
              {Object.entries(building.storageMax).map(([resource, max]) => (
                <Box key={resource} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ textTransform: 'capitalize' }}>{resource}:</Typography>
                  <Typography>
                    {building.storage?.[resource as keyof typeof building.storage] || 0} / {max}
                  </Typography>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">This building has no storage.</Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Stack spacing={2}>
            <Typography variant="h6">Available Upgrades</Typography>
            {availableUpgrades.length > 0 ? (
              availableUpgrades.map(({ id, config: upgradeConfig }) => {
                const isBuilt = existingUpgrades.includes(id);
                const cost = upgradeConfig.cost;
                const canAfford = !isBuilt &&
                  (cost.wood ?? 0) <= resources.wood &&
                  (cost.stone ?? 0) <= resources.stone &&
                  (cost.food ?? 0) <= resources.food &&
                  (cost.gold ?? 0) <= resources.gold;

                return (
                  <Card key={id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {upgradeConfig.name}
                        {isBuilt && <Chip label="Built" color="success" size="small" sx={{ ml: 1 }} />}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {upgradeConfig.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {Object.entries(cost).map(([resource, amount]) => (
                          <Chip
                            key={resource}
                            label={`${resource}: ${amount}`}
                            size="small"
                            color={(resources as any)[resource] >= amount ? 'default' : 'error'}
                          />
                        ))}
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        disabled={isBuilt || !canAfford}
                        onClick={() => buildUpgrade(id)}
                      >
                        {isBuilt ? 'Built' : 'Build'}
                      </Button>
                    </CardActions>
                  </Card>
                );
              })
            ) : (
              <Typography color="text.secondary">No upgrades available for this building.</Typography>
            )}
          </Stack>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSelectedBuildingId(null)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

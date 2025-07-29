import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Worker, Building, Farm, Forest, Mine, Mountain } from '../objects/index';
import useSandboxStore, { type GameObject } from '../stores/useSandboxStore';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import HUD from '../components/HUD';
import BuildMenu3D from '../components/BuildMenu3D';
import BuildMenuUI from '../components/BuildMenuUI';
import GameLoopUpdater from '../components/GameLoopUpdater';
import { startGameLoop } from '../systems/TickSystem';
import { nanoid } from 'nanoid';

export default function SandboxPage() {
  const { objects, reset, assignWorkerTask, addObject } = useSandboxStore();
  const [selectedBuildingType, setSelectedBuildingType] = useState<GameObject['type']>('farm');

  useEffect(() => {
    console.log('Event listener for R key attached.');
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', event.key);
      if (event.key === 'R' || event.key === 'r') {
        console.log('R key detected. Calling reset()...');
        reset();
        console.log('Scene reset.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      console.log('Event listener for R key removed.');
    };
  }, [reset]);

  useEffect(() => {
    startGameLoop();
  }, []);

  const workers = objects.filter((obj): obj is GameObject => obj.type === 'worker');

  const handleAssignChopTask = (workerId: string) => {
    assignWorkerTask(workerId, { type: 'chop', targetId: '8', id: `task-${workerId}-${Date.now()}` }); // Assign to forest (ID 8)
  };

  const handleBuild = (type: GameObject['type'], position: [number, number, number]) => {
    addObject({ id: nanoid(), type: type, position: position });
  };

  return (
    <div style={{ maxWidth: '1920px', maxHeight: '1080px', width: '100%', height: '100%', margin: 'auto', border: '2px solid #FF69B4', position: 'relative' }}>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 50 }} style={{ width: '100%', height: '100%', aspectRatio: '16 / 9', objectFit: 'contain' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <GameLoopUpdater />
        <BuildMenu3D onBuild={handleBuild} selectedBuildingType={selectedBuildingType} />

        {/* Dynamicky generované placeholdery */}
        {objects.map((obj: GameObject) => {
          switch (obj.type) {
            case 'worker':
              return <Worker key={obj.id} id={obj.id} />;
            case 'building':
              const { id: buildingId, ...buildingProps } = obj;
              return <Building key={buildingId} {...buildingProps} />;
            case 'farm':
              const { id: farmId, ...farmProps } = obj;
              return <Farm key={farmId} {...farmProps} />;
            case 'forest':
              const { id: forestId, ...forestProps } = obj;
              return <Forest key={forestId} {...forestProps} />;
            case 'mine':
              const { id: mineId, ...mineProps } = obj;
              return <Mine key={mineId} {...mineProps} />;
            case 'mountain':
              const { id: mountainId, ...mountainProps } = obj;
              return <Mountain key={mountainId} {...mountainProps} />;
            default:
              return null;
          }
        })}

        <OrbitControls makeDefault />
        <Stats />
        <BuildMenu3D onBuild={handleBuild} selectedBuildingType={selectedBuildingType} />
      </Canvas>

      <HUD />
      <BuildMenuUI onSelectBuilding={setSelectedBuildingType} />

      {/* UI Overlay - Workers */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        left: 16,
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        p: 2,
        borderRadius: 2,
        // Removed maxHeight and overflowY for dynamic sizing
      }}>
        <Typography variant="h6" gutterBottom>Workers</Typography>
        <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
          <Table size="small" aria-label="workers table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Task</TableCell>
                <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((worker: GameObject) => (
                <TableRow key={worker.id}>
                  <TableCell sx={{ color: 'white', borderBottom: 'none' }}>{worker.id}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: 'none' }}>{worker.task ? `${worker.task.type} (Target: ${worker.task.targetId})` : 'Idle'}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: 'none' }}>
                    <Button variant="outlined" size="small" onClick={() => handleAssignChopTask(worker.id)}>
                      Assign Chop
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
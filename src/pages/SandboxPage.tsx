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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'R' || event.key === 'r') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reset]);

  useEffect(() => {
    startGameLoop();
  }, []);

  const workers = objects.filter((obj): obj is GameObject => obj.type === 'worker');

  const handleAssignChopTask = (workerId: string) => {
    assignWorkerTask(workerId, { type: 'chop', targetId: '8', id: `task-${workerId}-${Date.now()}` });
  };

  const handleBuild = (type: GameObject['type'], position: [number, number, number]) => {
    addObject({ id: nanoid(), type: type, position: position });
  };

  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      <HUD />
      <Canvas 
        shadows 
        camera={{ position: [8, 8, 8], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

        <GameLoopUpdater />
        <BuildMenu3D onBuild={handleBuild} selectedBuildingType={selectedBuildingType} />

        {objects.map((obj) => {
          const { id, type, ...rest } = obj;
          switch (type) {
            case 'worker':
              return <Worker key={id} id={id} />;
            case 'building':
              return <Building key={id} {...rest} />;
            case 'farm':
              return <Farm key={id} {...rest} />;
            case 'forest':
              return <Forest key={id} {...rest} />;
            case 'mine':
              return <Mine key={id} {...rest} />;
            case 'mountain':
              return <Mountain key={id} {...rest} />;
            default:
              return null;
          }
        })}

        <OrbitControls makeDefault />
        <Stats />
      </Canvas>

      <BuildMenuUI onSelectBuilding={setSelectedBuildingType} />

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
          width: '350px'
        }}
      >
        <Typography variant="h6" gutterBottom>Workers</Typography>
        <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
          <Table size="small">
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
                  <TableCell sx={{ color: 'white', borderBottom: 'none' }}>{worker.id.substring(0, 5)}...</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: 'none' }}>{worker.task ? `${worker.task.type}` : 'Idle'}</TableCell>
                  <TableCell sx={{ color: 'white', borderBottom: 'none' }}>
                    <Button variant="outlined" size="small" onClick={() => handleAssignChopTask(worker.id)} sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                      Chop
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

import { Box, AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { QuantumInk } from '../QuantumInk';

function Sandbox() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const quantumInk = new QuantumInk(containerRef.current);
      return () => {
        quantumInk.destroy();
      };
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            QualiaLab
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        ref={containerRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0, // Ensure canvas is behind AppBar if needed
        }}
      >
      </Box>
    </Box>
  );
}

export default Sandbox;

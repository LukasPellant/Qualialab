import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const SandboxLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'rgba(80, 0, 80, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
            QualiaLab
          </Typography>
          <Button color="inherit" component={Link} to="/video-archive">Video Archiv</Button> {/* Corrected path */}
          <Button color="inherit" component={Link} to="/projects">Projekty</Button>
          <Button color="inherit" component={Link} to="/sandbox">Sandbox</Button>
          <Button color="inherit" component={Link} to="/about">O projektu</Button>
          <Button color="inherit" component={Link} to="/equipment">Vybavení</Button>
        </Toolbar>
      </AppBar>
      {/* The Outlet will render the SandboxPage, which will fill the remaining space */}
      <Outlet />
    </Box>
  );
};

export default SandboxLayout;
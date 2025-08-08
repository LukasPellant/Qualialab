
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'rgba(80, 0, 80, 0.9)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
            QualiaLab
          </Typography>
          <Button color="inherit" component={Link} to="/video-archive">Video Archiv</Button>
          <Button color="inherit" component={Link} to="/projects">Projekty</Button>
          <Button color="inherit" component={Link} to="/sandbox">Sandbox</Button>
          <Button color="inherit" component={Link} to="/about">O projektu</Button>
          <Button color="inherit" component={Link} to="/equipment">Vybavení</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" disableGutters maxWidth={false} sx={{ flexGrow: 1, backgroundColor: 'transparent' }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ bgcolor: 'background.paper', p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} QualiaLab
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;


import { Typography, Container, Box, AppBar, Toolbar, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import GrainIcon from '@mui/icons-material/Grain';

function Sandbox() {
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
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)', // 64px je výška Appbaru
          background: 'radial-gradient(circle, rgba(63,94,251,0.1) 0%, rgba(252,70,107,0.1) 100%)',
        }}
      >
        <Container maxWidth="md">
          <Paper 
            elevation={12} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px'
            }}
          >
            <GrainIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h2" component="h1" gutterBottom>
              Sandbox
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Již brzy zde naleznete interaktivní hřiště pro experimenty s Three.js a particle simulacemi.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Sandbox;

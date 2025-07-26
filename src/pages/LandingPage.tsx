
import { Link } from 'react-router-dom';
import { Button, Typography, Container, Box, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import { keyframes } from '@emotion/react';

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 15s ease infinite`,
        color: 'white',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: { xs: '20px', md: '40px' },
            borderRadius: '15px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            QualiaLab
          </Typography>
          <Typography variant="h5" component="h2" paragraph>
            Místo pro FPV videa, projekty a experimenty.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
            <Button 
              component={Link} 
              to="/archive" 
              variant="contained" 
              color="primary" 
              size="large" 
              startIcon={<PlayArrowIcon />}
            >
              FPV Archiv
            </Button>
            <Button 
              component={Link} 
              to="/projects" 
              variant="outlined" 
              color="secondary" 
              size="large" 
              startIcon={<CodeIcon />}
            >
              Projekty
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;

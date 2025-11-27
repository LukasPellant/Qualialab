import { AppBar, Toolbar, Typography, Button, Container, Box, useTheme, useMediaQuery } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const navItems = [
    { label: 'Video Archiv', path: '/video-archive' },
    { label: 'Projekty', path: '/projects' },
    { label: 'Sandbox', path: '/sandbox' },
    { label: 'O projektu', path: '/about' },
    { label: 'Vybavení', path: '/equipment' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: 'rgba(5, 5, 17, 0.7)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 80 }}>
            <Typography
              variant="h4"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                fontWeight: 800,
                background: `linear-gradient(135deg, #ffffff 0%, ${theme.palette.primary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              QualiaLab
            </Typography>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      component={Link}
                      to={item.path}
                      sx={{
                        color: isActive ? 'primary.main' : 'text.secondary',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: isActive ? '100%' : '0%',
                          height: '2px',
                          bgcolor: 'primary.main',
                          transition: 'all 0.3s ease',
                          transform: 'translateX(-50%)',
                          opacity: isActive ? 1 : 0,
                        },
                        '&:hover': {
                          color: 'primary.light',
                          bgcolor: 'transparent',
                          '&::after': {
                            width: '50%',
                            opacity: 0.5,
                          },
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        component="main"
        maxWidth={false}
        sx={{
          flexGrow: 1,
          py: 4,
          px: { xs: 2, md: 4, lg: 8 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Container>

      <Box
        component="footer"
        sx={{
          bgcolor: 'rgba(5, 5, 17, 0.9)',
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          mt: 'auto',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} QualiaLab. All systems nominal.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainLayout;

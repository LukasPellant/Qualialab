import { Typography, Container, Box, Card, CardContent, Chip, Stack, Grid, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { RocketLaunch, Science, Construction, ArrowForward } from '@mui/icons-material';

const projects = [
  {
    title: 'FPV Video Platforma',
    description: 'Webová stránka pro nahrávání a sdílení FPV videí. Postaveno na Reactu s Material-UI a připraveno pro nasazení na Cloudflare.',
    status: 'Ve vývoji',
    tags: ['React', 'TypeScript', 'Material-UI', 'Cloudflare'],
    icon: <RocketLaunch fontSize="large" color="secondary" />,
    link: '/video-archive'
  },
  {
    title: 'Three.js Particle Simulator',
    description: 'Interaktivní simulátor částic v reálném čase s využitím WebGL a Three.js. Umožňuje uživatelům experimentovat s různými fyzikálními parametry.',
    status: 'Plánováno',
    tags: ['Three.js', 'WebGL', 'JavaScript'],
    icon: <Science fontSize="large" color="primary" />,
    link: '/sandbox'
  },
  {
    title: 'Amazing Hand',
    description: 'Open-source, 3D tisknutelná robotická ruka. Projekt zaměřený na robotiku a 3D tisk.',
    status: 'Plánováno',
    tags: ['Robotika', '3D Tisk', 'Open Source'],
    icon: <Construction fontSize="large" color="info" />,
    link: '/projects'
  }
];

function Projects() {
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            Moje Projekty
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Experimenty, nástroje a technologie, na kterých pracuji.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px -10px ${theme.palette.primary.main}20`,
                  borderColor: theme.palette.primary.main,
                }
              }}>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{
                    mb: 3,
                    p: 2,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: '50%',
                    width: 'fit-content',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {project.icon}
                  </Box>

                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                    {project.title}
                  </Typography>

                  <Typography paragraph color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                    {project.description}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                      label={project.status}
                      size="small"
                      color={project.status === 'Ve vývoji' ? 'warning' : project.status === 'Plánováno' ? 'info' : 'default'}
                      variant="outlined"
                    />
                  </Stack>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                    {project.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: 'none' }}
                      />
                    ))}
                  </Box>

                  <Button
                    component={Link}
                    to={project.link}
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    fullWidth
                    sx={{ mt: 'auto' }}
                  >
                    Detail projektu
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Projects;

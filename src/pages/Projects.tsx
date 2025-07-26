
import { Typography, Container, Box, AppBar, Toolbar, Card, CardContent, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const projects = [
  {
    title: 'FPV Video Platforma',
    description: 'Webová stránka pro nahrávání a sdílení FPV videí. Postaveno na Reactu s Material-UI a připraveno pro nasazení na Cloudflare.',
    status: 'Ve vývoji',
    tags: ['React', 'TypeScript', 'Material-UI', 'Cloudflare']
  },
  {
    title: 'Three.js Particle Simulator',
    description: 'Interaktivní simulátor částic v reálném čase s využitím WebGL a Three.js. Umožňuje uživatelům experimentovat s různými fyzikálními parametry.',
    status: 'Plánováno',
    tags: ['Three.js', 'WebGL', 'JavaScript']
  },
  {
    title: 'Amazing Hand',
    description: 'Open-source, 3D tisknutelná robotická ruka. Projekt zaměřený na robotiku a 3D tisk.',
    status: 'Plánováno',
    tags: ['Robotika', '3D Tisk', 'Open Source']
  }
];

function Projects() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
            QualiaLab
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Moje Projekty
        </Typography>
        <Stack spacing={4}>
          {projects.map((project, index) => (
            <Card key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {project.title}
                </Typography>
                <Chip label={project.status} color={project.status === 'Ve vývoji' ? 'warning' : project.status === 'Plánováno' ? 'info' : 'default'} sx={{ mb: 2 }} />
                <Typography paragraph color="text.secondary" sx={{ textAlign: 'center' }}>
                  {project.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Stack direction="row" spacing={1}>
                  {project.tags.map(tag => <Chip key={tag} label={tag} />)}
                </Stack>
              </Box>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

export default Projects;

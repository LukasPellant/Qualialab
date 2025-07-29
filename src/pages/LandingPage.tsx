import { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Button, Card, CardContent, CardMedia, Chip, Stack, CircularProgress, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

interface VideoFile {
  name: string;
  uid: string;
  thumbnail: string;
  droneSize?: string;
}

const WORKER_BASE_URL = 'https://video-upload-worker.pellant-lukas.workers.dev';

const projects = [
  {
    title: 'FPV Video Platforma',
    description: 'Webová stránka pro nahrávání a sdílení FPV videí. Postaveno na Reactu s Material-UI a připraveno pro nasazení na Cloudflare.',
    status: 'Ve vývoji',
    tags: ['React', 'TypeScript', 'Material-UI', 'Cloudflare'],
    link: '/archive'
  },
  {
    title: 'Three.js Particle Simulator',
    description: 'Interaktivní simulátor částic v reálném čase s využitím WebGL a Three.js. Umožňuje uživatelům experimentovat s různými fyzikálními parametry.',
    status: 'Plánováno',
    tags: ['Three.js', 'WebGL', 'JavaScript'],
    link: '/sandbox'
  },
  {
    title: 'Amazing Hand',
    description: 'Open-source, 3D tisknutelná robotická ruka. Projekt zaměřený na robotiku a 3D tisk.',
    status: 'Plánováno',
    tags: ['Robotika', '3D Tisk', 'Open Source'],
    link: '/projects'
  }
];

function LandingPage() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);

  const fetchVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const response = await fetch(`${WORKER_BASE_URL}/list-videos`);
      const result = await response.json();

      if (result.success) {
        const fetchedVideos: VideoFile[] = result.videos.map((video: any) => ({
          name: video.meta.name || `Video ${video.uid.substring(0, 8)}`,
          uid: video.uid,
          thumbnail: `https://videodelivery.net/${video.uid}/thumbnails/thumbnail.jpg?time=2s&width=600`,
          droneSize: video.meta.droneSize,
        }));
        setVideos(fetchedVideos.slice(0, 3)); // Get top 3 videos
      } else {
        console.error('Chyba při načítání videí:', result.error);
      }
    } catch (error) {
      console.error('Chyba sítě nebo serveru při načítání videí:', error);
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return (
    <Box sx={{ animation: `${fadeIn} 1s ease-out` }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: 12,
          pb: 8,
          background: 'transparent', // Use global theme background
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', animation: `${fadeIn} 1.5s ease-out` }}>
            Vítejte v QualiaLab
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, animation: `${fadeIn} 2s ease-out`, color: 'rgba(255, 255, 255, 0.7)' }}>
            Místo pro experimenty, vývoj a kreativní FPV létání.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} to="/archive" sx={{ animation: `${float} 3s ease-in-out infinite` }}>
            Prozkoumat videa
          </Button>
        </Container>
      </Box>

      {/* Sections */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* FPV Archive Preview */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Archiv FPV Videa
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Procházejte sbírku mých FPV videí, filtrovatelnou podle velikosti dronu.
          </Typography>
          <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" justifyContent="center">
            {loadingVideos ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                <CircularProgress />
                <Typography variant="h6" ml={2}>Načítám náhledy videí...</Typography>
              </Box>
            ) : (
              videos.length > 0 ? (
                videos.map((video) => (
                  <Card
                    key={video.uid}
                    sx={{
                      width: { xs: '100%', sm: '45%', md: '30%', lg: '22%' },
                      maxWidth: '280px'
                    }}
                  >
                    <CardActionArea component={Link} to={`/videos/${video.uid}`}>
                      <CardMedia
                        component="img"
                        image={video.thumbnail}
                        alt={video.name}
                        sx={{ height: 140, objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div" noWrap>
                          {video.name}
                        </Typography>
                        {video.droneSize && (
                          <Typography variant="body2" color="text.secondary">
                            {video.droneSize}
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary">Žádná videa k zobrazení.</Typography>
              )
            )}
          </Stack>
        </Box>

        {/* Projects Preview */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Projekty
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            Přehled mých aktuálních i plánovaných projektů.
          </Typography>
          <Stack spacing={4}>
            {projects.map((project, index) => (
              <Card key={index} sx={{ display: 'flex', flexDirection: 'column', ':hover': { boxShadow: 20 }, transition: 'all 0.3s' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {project.title}
                  </Typography>
                  <Chip label={project.status} color={project.status === 'Ve vývoji' ? 'warning' : project.status === 'Plánováno' ? 'info' : 'default'} sx={{ mb: 2 }} />
                  <Typography paragraph color="text.secondary" sx={{ textAlign: 'center' }}>
                    {project.description}
                  </Typography>
                  <Button component={Link} to={project.link} variant="outlined">Více informací</Button>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1}>
                    {project.tags.map(tag => <Chip key={tag} label={tag} />)}
                  </Stack>
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* Three.js Demo */}
        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Interaktivní 3D Demo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Zábavná a interaktivní ukázka s využitím Three.js.
          </Typography>
          <Box sx={{ height: 400, backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, ':hover': { boxShadow: 20 }, transition: 'all 0.3s' }}>
            <Button component={Link} to="/sandbox" variant="contained" color="secondary" size="large">
              Spustit demo
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;
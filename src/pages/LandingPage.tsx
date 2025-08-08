import { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Button, Card, CardContent, CardMedia, Chip, Stack, CircularProgress, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { PlayArrow, InfoOutlined, KeyboardArrowDown } from '@mui/icons-material';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;

const underlineGrow = keyframes`
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
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
    description: 'Archiv a přehrávač FPV videí. Rychlé, čisté a připravené pro sdílení.',
    status: 'Ve vývoji',
    tags: ['React', 'TypeScript', 'Cloudflare'],
    link: '/video-archive'
  },
  {
    title: 'Three.js Experiments',
    description: 'Lehké interaktivní prototypy a fyzikální experimenty v prohlížeči.',
    status: 'Plánováno',
    tags: ['Three.js', 'WebGL'],
    link: '/sandbox'
  },
  {
    title: 'Amazing Hand',
    description: '3D tisknutelná robotická ruka. Průzkum mechaniky a řízení.',
    status: 'Plánováno',
    tags: ['Robotika', '3D Tisk'],
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
        setVideos(fetchedVideos.slice(0, 6));
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
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Minimal accent overlay */}
      <Box sx={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(800px 300px at 80% -10%, rgba(178,107,255,0.12), transparent)'
      }} />

      {/* Hero */}
      <Box sx={{ position: 'relative', pt: { xs: 10, sm: 12 }, pb: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.01em',
              background: 'linear-gradient(90deg, #D291FF, #B26BFF, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              animation: `${fadeIn} 900ms ease-out`,
            }}
          >
            QualiaLab
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ height: 3, width: 160, bgcolor: 'primary.main', transformOrigin: 'left', transform: 'scaleX(0)', animation: `${underlineGrow} 800ms 200ms ease-out forwards`, borderRadius: 2 }} />
          </Box>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: 720, mx: 'auto' }}>
            Kreativní FPV videa, experimentální projekty a technologie.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ alignItems: 'center' }}>
            <Button variant="contained" color="primary" size="large" component={Link} to="/video-archive" startIcon={<PlayArrow />} sx={{ animation: `${float} 3s ease-in-out infinite` }}>
              Archiv videí
            </Button>
            <Button variant="outlined" color="secondary" size="large" component={Link} to="/about" startIcon={<InfoOutlined />}>O projektu</Button>
          </Stack>
        </Container>
        <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <KeyboardArrowDown sx={{ fontSize: 36, color: 'rgba(255,255,255,0.7)' }} />
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Latest Videos */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Nejnovější videa
          </Typography>
          {loadingVideos ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="120px">
              <CircularProgress />
              <Typography variant="h6" ml={2}>Načítám náhledy...</Typography>
            </Box>
          ) : videos.length > 0 ? (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}>
              {videos.map((video) => (
                <Card key={video.uid}>
                  <CardActionArea component={Link} to={`/video-archive?uid=${video.uid}`}>
                    <CardMedia component="img" image={video.thumbnail} alt={video.name} sx={{ height: 180, objectFit: 'cover' }} />
                    <CardContent>
                      <Typography gutterBottom variant="subtitle1" noWrap>{video.name}</Typography>
                      {video.droneSize && <Chip size="small" label={video.droneSize} />}
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">Žádná videa k zobrazení.</Typography>
          )}
        </Box>

        {/* Projects */}
        <Box sx={{ my: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Projekty
          </Typography>
          <Stack spacing={3}>
            {projects.map((project, index) => (
              <Card key={index}>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h5">{project.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{project.description}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip label={project.status} size="small" color={project.status === 'Ve vývoji' ? 'warning' : 'default'} />
                      {project.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
                      <Box sx={{ flex: 1 }} />
                      <Button component={Link} to={project.link} variant="outlined" size="small">Otevřít</Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;
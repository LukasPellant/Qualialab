import { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Button, Card, CardContent, CardMedia, Chip, Stack, CircularProgress, CardActionArea, useTheme, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { PlayArrow, InfoOutlined, KeyboardArrowDown, RocketLaunch, Science, Construction } from '@mui/icons-material';

// Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(0, 243, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(0, 243, 255, 0.6), 0 0 10px rgba(188, 19, 254, 0.4); }
  100% { box-shadow: 0 0 5px rgba(0, 243, 255, 0.2); }
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
    link: '/video-archive',
    icon: <RocketLaunch fontSize="large" color="secondary" />
  },
  {
    title: 'Three.js Experiments',
    description: 'Lehké interaktivní prototypy a fyzikální experimenty v prohlížeči.',
    status: 'Plánováno',
    tags: ['Three.js', 'WebGL'],
    link: '/sandbox',
    icon: <Science fontSize="large" color="primary" />
  },
  {
    title: 'Amazing Hand',
    description: '3D tisknutelná robotická ruka. Průzkum mechaniky a řízení.',
    status: 'Plánováno',
    tags: ['Robotika', '3D Tisk'],
    link: '/projects',
    icon: <Construction fontSize="large" color="info" />
  }
];

function LandingPage() {
  const theme = useTheme();
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
      {/* Hero Background Effects */}
      <Box sx={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100vw',
        height: '100vh',
        background: `radial-gradient(circle at 50% 50%, ${theme.palette.primary.main}15 0%, transparent 60%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          pt: { xs: 12, md: 20 },
          pb: { xs: 8, md: 12 },
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              animation: `${fadeIn} 1s ease-out`,
              textShadow: `0 0 40px ${theme.palette.primary.main}40`,
              mb: 2
            }}
          >
            QualiaLab
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            color="text.secondary"
            sx={{
              mb: 6,
              maxWidth: 800,
              animation: `${fadeIn} 1s ease-out 0.2s backwards`,
              fontWeight: 400
            }}
          >
            Kreativní FPV videa, experimentální projekty a technologie budoucnosti.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{ animation: `${fadeIn} 1s ease-out 0.4s backwards` }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/video-archive"
              startIcon={<PlayArrow />}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                animation: `${glow} 3s infinite`
              }}
            >
              Archiv videí
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/about"
              startIcon={<InfoOutlined />}
              sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
            >
              O projektu
            </Button>
          </Stack>
        </Box>

        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          pb: 8,
          animation: `${float} 3s ease-in-out infinite`
        }}>
          <KeyboardArrowDown sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
        </Box>

        {/* Latest Videos */}
        <Box sx={{ my: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700 }}>
              Nejnovější videa
            </Typography>
            <Button component={Link} to="/video-archive" color="secondary">Zobrazit vše</Button>
          </Box>

          {loadingVideos ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress color="secondary" />
            </Box>
          ) : videos.length > 0 ? (
            <Grid container spacing={3}>
              {videos.map((video) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={video.uid}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea component={Link} to={`/video-archive?uid=${video.uid}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={video.thumbnail}
                          alt={video.name}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease'
                          }}
                        />
                        <Box sx={{
                          position: 'absolute',
                          inset: 0,
                          bgcolor: 'rgba(0,0,0,0.3)',
                          opacity: 0,
                          transition: 'opacity 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': { opacity: 1 }
                        }}>
                          <PlayArrow sx={{ fontSize: 64, color: 'white', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }} />
                        </Box>
                      </Box>
                      <CardContent sx={{ width: '100%' }}>
                        <Typography gutterBottom variant="h6" noWrap sx={{ fontWeight: 600 }}>{video.name}</Typography>
                        {video.droneSize && (
                          <Chip
                            size="small"
                            label={video.droneSize}
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(4px)'
                            }}
                          />
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">Žádná videa k zobrazení.</Typography>
          )}
        </Box>

        {/* Projects */}
        <Box sx={{ my: 12 }}>
          <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontWeight: 700, mb: 6 }}>
            Vybrané Projekty
          </Typography>
          <Grid container spacing={4}>
            {projects.map((project, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{
                  height: '100%',
                  p: 2,
                  background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: theme.palette.primary.main,
                  }
                }}>
                  <CardContent>
                    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: '50%', width: 'fit-content' }}>
                      {project.icon}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                      {project.description}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                      <Chip
                        label={project.status}
                        size="small"
                        color={project.status === 'Ve vývoji' ? 'warning' : 'default'}
                        variant="outlined"
                      />
                      {project.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                      ))}
                    </Stack>
                    <Button
                      component={Link}
                      to={project.link}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 3 }}
                    >
                      Prozkoumat
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;
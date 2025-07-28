
import { useState, useEffect, useCallback } from 'react';
import { Container, Stack, Card, CardActionArea, CardMedia, CardContent, Typography, Box, CircularProgress, TextField, ToggleButtonGroup, ToggleButton } from '@mui/material';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Link } from 'react-router-dom';

interface VideoFile {
  name: string;
  uid: string;
  thumbnail: string;
  droneSize?: string;
}

const WORKER_BASE_URL = 'https://video-upload-worker.pellant-lukas.workers.dev';

function VideoArchive() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [droneSizeFilter, setDroneSizeFilter] = useState<string | null>(null);

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
        setVideos(fetchedVideos);
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

  const handleDroneSizeFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    setDroneSizeFilter(newFilter);
  };

  const filteredVideos = videos
    .filter(video =>
      video.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(video =>
        droneSizeFilter ? video.droneSize === droneSizeFilter : true
    );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <TextField 
          label="Hledat videa..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '50%' }}
        />
        <ToggleButtonGroup
            value={droneSizeFilter}
            exclusive
            onChange={handleDroneSizeFilterChange}
            aria-label="drone size filter"
        >
            <ToggleButton value="5inch" aria-label="5 inch">
                5inch
            </ToggleButton>
            <ToggleButton value="2inch" aria-label="2 inch">
                2inch
            </ToggleButton>
            <ToggleButton value="whoop" aria-label="whoop">
                Whoop
            </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loadingVideos ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="h6" ml={2}>Načítám videa...</Typography>
        </Box>
      ) : (
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" justifyContent="center">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
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
            <Box textAlign="center" py={10}>
              <VideocamOffIcon sx={{ fontSize: 80, color: 'grey.700' }} />
              <Typography variant="h5" color="text.secondary" mt={2}>
                Nenašli jsme žádná videa odpovídající vašemu hledání.
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </Container>
  );
}

export default VideoArchive;



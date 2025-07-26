
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';

const VideoPlayerPage = () => {
  const { uid } = useParams<{ uid: string }>();

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={8} sx={{ p: 2, background: '#2C2C4A' }}>
        <Box sx={{ maxWidth: '100%', mx: 'auto', mb: 2 }}>
          <iframe
            src={`https://iframe.videodelivery.net/${uid}`}
            style={{ border: 'none', width: '100%', aspectRatio: '16 / 9', borderRadius: '8px' }}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.light' }}>
            Video {uid}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default VideoPlayerPage;

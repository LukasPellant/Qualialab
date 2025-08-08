
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, Typography, Box, Stack, Button, Breadcrumbs, Link as MLink, Divider, List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const VideoPlayerPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Container maxWidth={false} sx={{ my: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '220px 1fr' }, gap: 3 }}>
        {/* Left nav */}
        <Paper elevation={6} sx={{ p: 2, position: 'sticky', top: 88, height: 'fit-content', bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Navigace</Typography>
          <Divider sx={{ mb: 1 }} />
          <List dense>
            <ListItemButton component={RouterLink} to="/">
              <ListItemIcon><HomeIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Domů" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/video-archive">
              <ListItemIcon><VideoLibraryIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Archiv videí" />
            </ListItemButton>
            <ListItemButton component={RouterLink} to="/about">
              <ListItemIcon><InfoOutlinedIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="O projektu" />
            </ListItemButton>
          </List>
        </Paper>

        {/* Centered player */}
        <Box>
          <Breadcrumbs sx={{ mb: 1 }}>
            <MLink component={RouterLink} to="/">Domů</MLink>
            <MLink component={RouterLink} to="/video-archive">Archiv</MLink>
            <Typography color="text.primary">Přehrávač</Typography>
          </Breadcrumbs>
          <Paper elevation={8} sx={{ p: { xs: 1.5, sm: 2 }, background: '#2C2C4A' }}>
            <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 2 }}>
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', borderRadius: '10px', overflow: 'hidden' }}>
                <iframe
                  src={`https://iframe.videodelivery.net/${id}`}
                  style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                  title={`Video ${id}`}
                ></iframe>
              </Box>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={1}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'primary.light', mb: 0 }}>
                Video {id}
              </Typography>
              <Button variant="outlined" component={RouterLink} to="/video-archive">Zpět do archivu</Button>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default VideoPlayerPage;

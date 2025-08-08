import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Chip,
  Breadcrumbs,
  Link as MLink,
  InputAdornment,
  Paper,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link, useSearchParams } from 'react-router-dom';

interface VideoFile {
  uid: string;
  name: string;
  thumbnail: string;
  droneSize?: string;
  date?: string;
  location?: string;
  camera?: string;
  description?: string;
  tags?: string[];
  notes?: string;
}

const WORKER_BASE_URL = 'https://video-upload-worker.pellant-lukas.workers.dev';

const VideoArchive = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [search, setSearch] = useState('');
  const [droneFilter, setDroneFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<VideoFile | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch(`${WORKER_BASE_URL}/list-videos`);
      const result = await res.json();
      if (result.success) {
        const mapped: VideoFile[] = result.videos.map((v: any) => ({
          uid: v.uid,
          name: v.meta.name || `Video ${v.uid.substring(0, 8)}`,
          thumbnail: `https://videodelivery.net/${v.uid}/thumbnails/thumbnail.jpg?time=2s&width=600`,
          droneSize: v.meta.droneSize,
          date: v.meta.date,
          location: v.meta.location,
          camera: v.meta.camera,
          description: v.meta.description,
          tags: v.meta.tags,
          notes: v.meta.notes,
        }));
        setVideos(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  useEffect(() => {
    const uid = searchParams.get('uid');
    if (uid && videos.length > 0) {
      const found = videos.find((v) => v.uid === uid) || null;
      setSelected(found);
    }
  }, [searchParams, videos]);

  const filtered = videos
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .filter((v) => (droneFilter ? v.droneSize === droneFilter : true));

  const handleSelect = (v: VideoFile) => {
    setSelected(v);
    const next = new URLSearchParams(searchParams);
    next.set('uid', v.uid);
    setSearchParams(next);
  };

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: 2 }}>
      <Breadcrumbs sx={{ mb: 1 }}>
        <MLink component={Link} to="/">Domů</MLink>
        <Typography color="text.secondary">Archiv</Typography>
        {selected && <Typography color="text.primary" noWrap maxWidth={280}>{selected.name}</Typography>}
      </Breadcrumbs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '260px 1fr' }, gap: 3, alignItems: 'start' }}>
        {/* Left: Sidebar navigation & controls */}
        <Paper elevation={6} sx={{ p: 2, position: 'sticky', top: 88, height: 'fit-content', bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Navigace</Typography>
          <Divider sx={{ mb: 1 }} />
          <List dense sx={{ mb: 1 }}>
            <ListItemButton component={Link} to="/">
              <ListItemIcon><HomeIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Domů" />
            </ListItemButton>
            <ListItemButton component={Link} to="/video-archive">
              <ListItemIcon><VideoLibraryIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="Archiv videí" />
            </ListItemButton>
            <ListItemButton component={Link} to="/about">
              <ListItemIcon><InfoOutlinedIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
              <ListItemText primary="O projektu" />
            </ListItemButton>
          </List>

          <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Hledat</Typography>
          <TextField
            fullWidth
            placeholder="Hledat videa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
            sx={{ mb: 1 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1, mt: 1 }}>Filtr</Typography>
          <ToggleButtonGroup value={droneFilter} exclusive onChange={(_, v) => setDroneFilter(v)} size="small" fullWidth>
            {['5inch', '2inch', 'whoop'].map((label) => (
              <ToggleButton key={label} value={label}>{label}</ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Chip label={`${filtered.length} videí`} size="small" color="primary" sx={{ mt: 1 }} />

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Naposledy přidané</Typography>
          <List dense>
            {videos.slice(0, 6).map((v) => (
              <ListItemButton key={v.uid} onClick={() => handleSelect(v)} selected={selected?.uid === v.uid}>
                <ListItemText primaryTypographyProps={{ noWrap: true }} primary={v.name} secondary={v.droneSize} />
              </ListItemButton>
            ))}
          </List>
        </Paper>

        {/* Right: centered player + grid below */}
        <Box>
          {/* Centered player card */}
          <Paper elevation={8} sx={{ p: 2, mb: 2 }}>
            {!selected ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">Vyber video z panelu vlevo</Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 2 }}>
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                    <iframe
                      src={`https://iframe.videodelivery.net/${selected.uid}`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      title={selected.name}
                    />
                  </Box>
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={1} sx={{ maxWidth: 1200, mx: 'auto' }}>
                  <Typography variant="h5" gutterBottom noWrap>{selected.name}</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    <Button startIcon={<DownloadIcon />}>Stáhnout</Button>
                    <Button startIcon={<ShareIcon />} onClick={() => navigator.clipboard.writeText(window.location.href)}>Sdílet</Button>
                  </Stack>
                </Stack>
              </>
            )}
          </Paper>

          {/* Grid of results below */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
            gap: 2,
          }}>
            {filtered.map((v) => (
              <Card key={v.uid} onClick={() => handleSelect(v)} sx={{ cursor: 'pointer' }}>
                <CardMedia component="img" src={v.thumbnail} alt={v.name} sx={{ height: 140, objectFit: 'cover' }} />
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="subtitle2" noWrap>{v.name}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    {v.droneSize && <Chip label={v.droneSize} size="small" />}
                    {v.date && <Chip label={v.date} size="small" variant="outlined" />}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoArchive;
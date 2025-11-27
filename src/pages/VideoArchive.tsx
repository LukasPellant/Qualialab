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
  useTheme,
  Grow,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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
  const theme = useTheme();
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [search, setSearch] = useState('');
  const [droneFilter, setDroneFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<VideoFile | null>(null);
  const [adminKey, setAdminKey] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveMeta = async () => {
    if (!selected) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/stream/meta/${selected.uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({
          meta: {
            name: selected.name,
            droneSize: selected.droneSize,
            date: selected.date,
            location: selected.location,
            camera: selected.camera,
            description: selected.description,
            tags: selected.tags,
            notes: selected.notes,
          }
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <MLink component={Link} to="/" color="inherit" underline="hover">Domů</MLink>
        <Typography color="primary">Archiv</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' }, gap: 4, alignItems: 'start' }}>
        {/* Left: Sidebar controls */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            position: 'sticky',
            top: 100,
            height: 'fit-content',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Filtrování</Typography>

          <TextField
            fullWidth
            placeholder="Hledat videa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
              sx: { borderRadius: 2 }
            }}
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Kategorie</Typography>
          <ToggleButtonGroup
            value={droneFilter}
            exclusive
            onChange={(_, v) => setDroneFilter(v)}
            size="small"
            fullWidth
            orientation="vertical"
            sx={{ mb: 3 }}
          >
            {['5inch', '2inch', 'whoop'].map((label) => (
              <ToggleButton
                key={label}
                value={label}
                sx={{
                  justifyContent: 'flex-start',
                  pl: 2,
                  border: 'none',
                  borderRadius: '8px !important',
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }
                }}
              >
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">Nalezeno</Typography>
            <Chip label={`${filtered.length}`} size="small" color="primary" variant="outlined" />
          </Box>
        </Paper>

        {/* Right: Content */}
        <Box>
          {/* Active Player */}
          <Grow in={!!selected} timeout={500}>
            <Box sx={{ mb: 6, display: selected ? 'block' : 'none' }}>
              {selected && (
                <Paper
                  elevation={0}
                  sx={{
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.primary.main}40`,
                    boxShadow: `0 0 40px -10px ${theme.palette.primary.main}20`
                  }}
                >
                  <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16/9', bgcolor: 'black' }}>
                    <iframe
                      src={`https://iframe.videodelivery.net/${selected.uid}`}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                      title={selected.name}
                    />
                  </Box>

                  <Box sx={{ p: 3 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="flex-start" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>{selected.name}</Typography>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          {selected.droneSize && <Chip label={selected.droneSize} size="small" color="secondary" />}
                          {selected.date && <Chip label={selected.date} size="small" variant="outlined" />}
                        </Stack>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                          {selected.description || 'Žádný popis k dispozici.'}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1}>
                        <Button variant="outlined" startIcon={<DownloadIcon />}>Stáhnout</Button>
                        <Button variant="outlined" startIcon={<ShareIcon />} onClick={() => navigator.clipboard.writeText(window.location.href)}>Sdílet</Button>
                      </Stack>
                    </Stack>

                    {/* Admin Section Toggle */}
                    <Box sx={{ mt: 4 }}>
                      <Button
                        size="small"
                        onClick={() => {
                          const el = document.getElementById('admin-panel');
                          if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
                        }}
                        sx={{ color: 'text.secondary' }}
                      >
                        Upravit Metadata (Admin)
                      </Button>

                      <Box id="admin-panel" sx={{ display: 'none', mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                        <Stack spacing={2}>
                          <TextField label="Admin Key" type="password" size="small" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} fullWidth />
                          <TextField label="Název" size="small" value={selected.name} onChange={(e) => setSelected({ ...selected, name: e.target.value })} fullWidth />
                          <Button variant="contained" disabled={!adminKey || isSaving} onClick={saveMeta}>Uložit</Button>
                        </Stack>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          </Grow>

          {/* Grid of videos */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            {search ? 'Výsledky hledání' : 'Všechna videa'}
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', xl: 'repeat(3, 1fr)' },
            gap: 3,
          }}>
            {filtered.map((v) => (
              <Card
                key={v.uid}
                onClick={() => handleSelect(v)}
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover .play-icon': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1.1)',
                  },
                  '&:hover .thumbnail': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    src={v.thumbnail}
                    alt={v.name}
                    className="thumbnail"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                    }}
                  />
                  <Box
                    className="play-icon"
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <PlayArrowIcon sx={{ color: 'white' }} />
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                    <Chip label={v.droneSize || 'FPV'} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', height: 24 }} />
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>{v.name}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{v.date || 'Neznámé datum'}</Typography>
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
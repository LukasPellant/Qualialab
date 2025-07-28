import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  
  CardMedia,
  CardContent,
  List,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  Button,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { Link } from 'react-router-dom';

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
const DRAWER_WIDTH = 300;

const VideoArchive = () => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  
  const [search, setSearch] = useState('');
  const [droneFilter, setDroneFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [collapsed, setCollapsed] = useState(false);
  const [selected, setSelected] = useState<VideoFile | null>(null);

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
      console.error("Failed to fetch videos:", error);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const filtered = videos
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
    .filter((v) => (droneFilter ? v.droneSize === droneFilter : true));

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box
        sx={{
          width: collapsed ? 56 : DRAWER_WIDTH,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1,
            py: 1,
            justifyContent: collapsed ? 'center' : 'space-between',
          }}
        >
          {!collapsed && <Typography variant="h6">Archiv</Typography>}
          <Button onClick={() => setCollapsed((c) => !c)} size="small">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </Button>
        </Box>
        {!collapsed && (
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              label="Hledat videa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
            <ToggleButtonGroup
              value={droneFilter}
              exclusive
              onChange={(_, v) => setDroneFilter(v)}
              sx={{ mt: 1 }}
              size="small"
              fullWidth
            >
              <ToggleButton value="5inch">5inch</ToggleButton>
              <ToggleButton value="2inch">2inch</ToggleButton>
              <ToggleButton value="whoop">Whoop</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => v && setViewMode(v)}
              sx={{ mt: 1 }}
              size="small"
              fullWidth
            >
              <ToggleButton value="grid">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {viewMode === 'grid' && (
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent="center"
              sx={{ p: 1 }}
            >
              {filtered.map((v) => (
                <Card
                  key={v.uid}
                  sx={{ width: 120, m: 0.5, cursor: 'pointer' }}
                  onClick={() => setSelected(v)}
                  raised={selected?.uid === v.uid}
                >
                  <CardMedia
                    component="img"
                    src={v.thumbnail}
                    alt={v.name}
                    sx={{ height: 68, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="caption" noWrap>
                      {v.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
          {viewMode === 'list' && (
            <List>
              {filtered.map((v) => (
                <React.Fragment key={v.uid}>
                  <ListItemButton component="li" selected={selected?.uid === v.uid} alignItems="flex-start" onClick={() => setSelected(v)}>
                    <ListItemAvatar>
                      <Avatar variant="square" src={v.thumbnail} sx={{ width: 64, height: 36 }} />
                    </ListItemAvatar>
                    <ListItemText primary={v.name} secondary={v.date} />
                  </ListItemButton>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {!selected ? (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h5" color="text.secondary">
              Vyber video z playlistu
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ position: 'relative', width: '100%', pb: '56.25%' }}>
              <iframe
                src={`https://iframe.videodelivery.net/${selected.uid}`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5">{selected.name}</Typography>
              {selected.description && <Typography variant="body2" sx={{ mt: 1 }}>{selected.description}</Typography>}
              {selected.tags && selected.tags.length > 0 && (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {selected.tags.map((t) => (<Chip key={t} label={t} size="small" />))}
                </Stack>
              )}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button startIcon={<DownloadIcon />}>Stáhnout</Button>
                <Button startIcon={<ShareIcon />}>Sdílet</Button>
                <Button component={Link} to={`/projects?video=${selected.uid}`}>Zobrazit v projektech</Button>
              </Stack>
            </Box>
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', boxShadow: 1, borderRadius: 1 }}>
              <Typography variant="subtitle1">Další informace</Typography>
              {selected.date && <Typography variant="body2">Datum: {selected.date}</Typography>}
              {selected.location && <Typography variant="body2">Lokace: {selected.location}</Typography>}
              {selected.camera && <Typography variant="body2">Dron/kamera: {selected.camera}</Typography>}
              {selected.notes && <Typography variant="body2">Poznámky: {selected.notes}</Typography>}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default VideoArchive;
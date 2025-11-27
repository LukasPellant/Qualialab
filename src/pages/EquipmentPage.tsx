import { Typography, Container, Box, Paper, Grid, Stack, useTheme } from '@mui/material';
import { FlightTakeoff, Videocam, Build } from '@mui/icons-material';

const equipment = [
  {
    category: 'Drony',
    icon: <FlightTakeoff fontSize="large" color="primary" />,
    items: [
      { name: '5" Freestyle Build', desc: 'Apex Frame, T-Motor F60 PRO V, DJI O3 Air Unit' },
      { name: '3.5" Cinewhoop', desc: 'Cinelog35 V2, DJI O3, Naked GoPro ready' },
      { name: 'Tiny Whoop', desc: 'Mobula6 2024, ELRS' }
    ]
  },
  {
    category: 'Video & FPV',
    icon: <Videocam fontSize="large" color="secondary" />,
    items: [
      { name: 'Goggles', desc: 'DJI Goggles 2' },
      { name: 'Radio', desc: 'RadioMaster Boxer (ELRS 2.4GHz)' },
      { name: 'Action Cam', desc: 'GoPro Hero 11 Black Mini' }
    ]
  },
  {
    category: 'Dílna',
    icon: <Build fontSize="large" color="info" />,
    items: [
      { name: '3D Tiskárna', desc: 'Bambu Lab A1 Mini' },
      { name: 'Pájecí stanice', desc: 'Pinecil V2' },
      { name: 'Nabíječka', desc: 'ISDT 608AC' }
    ]
  }
];

const EquipmentPage = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          Vybavení
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Hardware, který mě drží ve vzduchu.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {equipment.map((section, index) => (
          <Grid size={{ xs: 12, md: 4 }} key={index}>
            <Paper sx={{
              height: '100%',
              p: 3,
              bgcolor: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 4,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                borderColor: theme.palette.primary.main,
              }
            }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                  {section.icon}
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {section.category}
                </Typography>
              </Stack>

              <Stack spacing={2}>
                {section.items.map((item, i) => (
                  <Box key={i} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.light' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default EquipmentPage;

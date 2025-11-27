import { Typography, Container, Box, Paper, Stack, Divider } from '@mui/material';
import { InfoOutlined, AutoAwesome, Bolt } from '@mui/icons-material';

const AboutPage = () => {

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
          O projektu
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Mise, vize a technologie za QualiaLab.
        </Typography>
      </Box>

      <Paper sx={{
        p: { xs: 3, md: 5 },
        bgcolor: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 4
      }}>
        <Stack spacing={4}>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <InfoOutlined color="primary" fontSize="large" />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                Co je QualiaLab?
              </Typography>
            </Stack>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              QualiaLab je osobní experimentální prostor zaměřený na průnik FPV létání, moderních webových technologií a robotiky.
              Cílem je nejen dokumentovat lety a stavby dronů, ale také zkoumat nové způsoby interakce a vizualizace dat.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <AutoAwesome color="secondary" fontSize="large" />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                Filozofie
              </Typography>
            </Stack>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Věřím v "Learning by Doing". Každý projekt zde prezentovaný je výsledkem zvědavosti a touhy pochopit, jak věci fungují pod kapotou.
              Od ladění PID regulátorů na dronu až po optimalizaci renderování ve Three.js.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Bolt color="warning" fontSize="large" />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                Technologie
              </Typography>
            </Stack>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Tento web je postaven na moderním stacku:
            </Typography>
            <Box component="ul" sx={{ pl: 2, typography: 'body1', lineHeight: 1.8 }}>
              <li><strong>Frontend:</strong> React, TypeScript, Material-UI (v6), Vite</li>
              <li><strong>Backend:</strong> Cloudflare Pages Functions, Cloudflare Workers</li>
              <li><strong>Video:</strong> Cloudflare Stream</li>
              <li><strong>Design:</strong> Custom Glassmorphism Theme</li>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AboutPage;

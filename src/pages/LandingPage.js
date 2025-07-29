import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Typography, Container, Box, Button, Card, CardContent, CardMedia, Chip, Stack, CircularProgress, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { keyframes } from '@emotion/react';
// Keyframes for animations
const fadeIn = keyframes `
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const float = keyframes `
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;
const WORKER_BASE_URL = 'https://video-upload-worker.pellant-lukas.workers.dev';
const projects = [
    {
        title: 'FPV Video Platforma',
        description: 'Webová stránka pro nahrávání a sdílení FPV videí. Postaveno na Reactu s Material-UI a připraveno pro nasazení na Cloudflare.',
        status: 'Ve vývoji',
        tags: ['React', 'TypeScript', 'Material-UI', 'Cloudflare'],
        link: '/archive'
    },
    {
        title: 'Three.js Particle Simulator',
        description: 'Interaktivní simulátor částic v reálném čase s využitím WebGL a Three.js. Umožňuje uživatelům experimentovat s různými fyzikálními parametry.',
        status: 'Plánováno',
        tags: ['Three.js', 'WebGL', 'JavaScript'],
        link: '/sandbox'
    },
    {
        title: 'Amazing Hand',
        description: 'Open-source, 3D tisknutelná robotická ruka. Projekt zaměřený na robotiku a 3D tisk.',
        status: 'Plánováno',
        tags: ['Robotika', '3D Tisk', 'Open Source'],
        link: '/projects'
    }
];
function LandingPage() {
    const [videos, setVideos] = useState([]);
    const [loadingVideos, setLoadingVideos] = useState(true);
    const fetchVideos = useCallback(async () => {
        setLoadingVideos(true);
        try {
            const response = await fetch(`${WORKER_BASE_URL}/list-videos`);
            const result = await response.json();
            if (result.success) {
                const fetchedVideos = result.videos.map((video) => ({
                    name: video.meta.name || `Video ${video.uid.substring(0, 8)}`,
                    uid: video.uid,
                    thumbnail: `https://videodelivery.net/${video.uid}/thumbnails/thumbnail.jpg?time=2s&width=600`,
                    droneSize: video.meta.droneSize,
                }));
                setVideos(fetchedVideos.slice(0, 3)); // Get top 3 videos
            }
            else {
                console.error('Chyba při načítání videí:', result.error);
            }
        }
        catch (error) {
            console.error('Chyba sítě nebo serveru při načítání videí:', error);
        }
        finally {
            setLoadingVideos(false);
        }
    }, []);
    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);
    return (_jsxs(Box, { sx: { animation: `${fadeIn} 1s ease-out` }, children: [_jsx(Box, { sx: {
                    pt: 12,
                    pb: 8,
                    background: 'transparent', // Use global theme background
                    color: 'white',
                    textAlign: 'center',
                }, children: _jsxs(Container, { maxWidth: "md", children: [_jsx(Typography, { variant: "h2", component: "h1", gutterBottom: true, sx: { fontWeight: 'bold', animation: `${fadeIn} 1.5s ease-out` }, children: "V\u00EDtejte v QualiaLab" }), _jsx(Typography, { variant: "h5", component: "p", color: "text.secondary", sx: { mb: 4, animation: `${fadeIn} 2s ease-out`, color: 'rgba(255, 255, 255, 0.7)' }, children: "M\u00EDsto pro experimenty, v\u00FDvoj a kreativn\u00ED FPV l\u00E9t\u00E1n\u00ED." }), _jsx(Button, { variant: "contained", color: "primary", size: "large", component: Link, to: "/archive", sx: { animation: `${float} 3s ease-in-out infinite` }, children: "Prozkoumat videa" })] }) }), _jsxs(Container, { maxWidth: "lg", sx: { py: 6 }, children: [_jsxs(Box, { sx: { my: 6 }, children: [_jsx(Typography, { variant: "h4", component: "h2", gutterBottom: true, align: "center", sx: { fontWeight: 'bold' }, children: "Archiv FPV Videa" }), _jsx(Typography, { variant: "body1", align: "center", color: "text.secondary", sx: { mb: 4 }, children: "Proch\u00E1zejte sb\u00EDrku m\u00FDch FPV vide\u00ED, filtrovatelnou podle velikosti dronu." }), _jsx(Stack, { direction: "row", spacing: 2, useFlexGap: true, flexWrap: "wrap", justifyContent: "center", children: loadingVideos ? (_jsxs(Box, { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100px", children: [_jsx(CircularProgress, {}), _jsx(Typography, { variant: "h6", ml: 2, children: "Na\u010D\u00EDt\u00E1m n\u00E1hledy vide\u00ED..." })] })) : (videos.length > 0 ? (videos.map((video) => (_jsx(Card, { sx: {
                                        width: { xs: '100%', sm: '45%', md: '30%', lg: '22%' },
                                        maxWidth: '280px'
                                    }, children: _jsxs(CardActionArea, { component: Link, to: `/videos/${video.uid}`, children: [_jsx(CardMedia, { component: "img", image: video.thumbnail, alt: video.name, sx: { height: 140, objectFit: 'cover' } }), _jsxs(CardContent, { children: [_jsx(Typography, { gutterBottom: true, variant: "h6", component: "div", noWrap: true, children: video.name }), video.droneSize && (_jsx(Typography, { variant: "body2", color: "text.secondary", children: video.droneSize }))] })] }) }, video.uid)))) : (_jsx(Typography, { variant: "body1", color: "text.secondary", children: "\u017D\u00E1dn\u00E1 videa k zobrazen\u00ED." }))) })] }), _jsxs(Box, { sx: { my: 6 }, children: [_jsx(Typography, { variant: "h4", component: "h2", gutterBottom: true, align: "center", sx: { fontWeight: 'bold' }, children: "Projekty" }), _jsx(Typography, { variant: "body1", align: "center", color: "text.secondary", sx: { mb: 4 }, children: "P\u0159ehled m\u00FDch aktu\u00E1ln\u00EDch i pl\u00E1novan\u00FDch projekt\u016F." }), _jsx(Stack, { spacing: 4, children: projects.map((project, index) => (_jsxs(Card, { sx: { display: 'flex', flexDirection: 'column', ':hover': { boxShadow: 20 }, transition: 'all 0.3s' }, children: [_jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, children: project.title }), _jsx(Chip, { label: project.status, color: project.status === 'Ve vývoji' ? 'warning' : project.status === 'Plánováno' ? 'info' : 'default', sx: { mb: 2 } }), _jsx(Typography, { paragraph: true, color: "text.secondary", sx: { textAlign: 'center' }, children: project.description }), _jsx(Button, { component: Link, to: project.link, variant: "outlined", children: "V\u00EDce informac\u00ED" })] }), _jsx(Box, { sx: { p: 2, pt: 0 }, children: _jsx(Stack, { direction: "row", spacing: 1, children: project.tags.map(tag => _jsx(Chip, { label: tag }, tag)) }) })] }, index))) })] }), _jsxs(Box, { sx: { my: 6, textAlign: 'center' }, children: [_jsx(Typography, { variant: "h4", component: "h2", gutterBottom: true, sx: { fontWeight: 'bold' }, children: "Interaktivn\u00ED 3D Demo" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { mb: 4 }, children: "Z\u00E1bavn\u00E1 a interaktivn\u00ED uk\u00E1zka s vyu\u017Eit\u00EDm Three.js." }), _jsx(Box, { sx: { height: 400, backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, ':hover': { boxShadow: 20 }, transition: 'all 0.3s' }, children: _jsx(Button, { component: Link, to: "/sandbox", variant: "contained", color: "secondary", size: "large", children: "Spustit demo" }) })] })] })] }));
}
export default LandingPage;

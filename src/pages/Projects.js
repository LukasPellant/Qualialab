import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Container, Box, AppBar, Toolbar, Card, CardContent, Chip, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
const projects = [
    {
        title: 'FPV Video Platforma',
        description: 'Webová stránka pro nahrávání a sdílení FPV videí. Postaveno na Reactu s Material-UI a připraveno pro nasazení na Cloudflare.',
        status: 'Ve vývoji',
        tags: ['React', 'TypeScript', 'Material-UI', 'Cloudflare']
    },
    {
        title: 'Three.js Particle Simulator',
        description: 'Interaktivní simulátor částic v reálném čase s využitím WebGL a Three.js. Umožňuje uživatelům experimentovat s různými fyzikálními parametry.',
        status: 'Plánováno',
        tags: ['Three.js', 'WebGL', 'JavaScript']
    },
    {
        title: 'Amazing Hand',
        description: 'Open-source, 3D tisknutelná robotická ruka. Projekt zaměřený na robotiku a 3D tisk.',
        status: 'Plánováno',
        tags: ['Robotika', '3D Tisk', 'Open Source']
    }
];
function Projects() {
    return (_jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(AppBar, { position: "static", children: _jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", component: Link, to: "/", sx: { flexGrow: 1, color: 'inherit', textDecoration: 'none' }, children: "QualiaLab" }) }) }), _jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsx(Typography, { variant: "h2", component: "h1", gutterBottom: true, children: "Moje Projekty" }), _jsx(Stack, { spacing: 4, children: projects.map((project, index) => (_jsxs(Card, { sx: { display: 'flex', flexDirection: 'column' }, children: [_jsxs(CardContent, { sx: { flexGrow: 1 }, children: [_jsx(Typography, { variant: "h5", component: "h2", gutterBottom: true, children: project.title }), _jsx(Chip, { label: project.status, color: project.status === 'Ve vývoji' ? 'warning' : project.status === 'Plánováno' ? 'info' : 'default', sx: { mb: 2 } }), _jsx(Typography, { paragraph: true, color: "text.secondary", sx: { textAlign: 'center' }, children: project.description })] }), _jsx(Box, { sx: { p: 2, pt: 0 }, children: _jsx(Stack, { direction: "row", spacing: 1, children: project.tags.map(tag => _jsx(Chip, { label: tag }, tag)) }) })] }, index))) })] })] }));
}
export default Projects;

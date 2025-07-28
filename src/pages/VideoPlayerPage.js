import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
const VideoPlayerPage = () => {
    const { id } = useParams();
    console.log("VideoPlayerPage received ID:", id); // Log the received ID
    return (_jsx(Container, { maxWidth: "lg", sx: { my: 4 }, children: _jsxs(Paper, { elevation: 8, sx: { p: 2, background: '#2C2C4A' }, children: [_jsx(Box, { sx: { maxWidth: '100%', mx: 'auto', mb: 2 }, children: _jsx("iframe", { src: `https://iframe.videodelivery.net/${id}`, style: { border: 'none', width: '100%', aspectRatio: '16 / 9', borderRadius: '8px' }, allow: "accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;", allowFullScreen: true }) }), _jsx(Box, { sx: { textAlign: 'center' } })] }) }));
};
export default VideoPlayerPage;

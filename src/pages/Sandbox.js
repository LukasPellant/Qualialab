import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Container, Box, AppBar, Toolbar, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import GrainIcon from '@mui/icons-material/Grain';
import { useEffect, useRef } from 'react';
import { QuantumInk } from '../QuantumInk'; // Adjust path as needed
function Sandbox() {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef.current) {
            const quantumInk = new QuantumInk(containerRef.current);
            return () => {
                quantumInk.destroy();
            };
        }
    }, []);
    return (_jsxs(Box, { sx: { flexGrow: 1 }, children: [_jsx(AppBar, { position: "static", children: _jsx(Toolbar, { children: _jsx(Typography, { variant: "h6", component: Link, to: "/", sx: { flexGrow: 1, color: 'inherit', textDecoration: 'none' }, children: "QualiaLab" }) }) }), _jsx(Box, { ref: containerRef, sx: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 'calc(100vh - 64px)', // 64px je výška Appbaru
                    background: 'radial-gradient(circle, rgba(63,94,251,0.1) 0%, rgba(252,70,107,0.1) 100%)',
                    position: 'relative', // Needed for absolute positioning of canvas if desired
                    zIndex: 1000,
                }, children: [] })] }));
}
export default Sandbox;

import { useRef, useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton, Collapse } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import useLogStore from '../stores/useLogStore';

export default function CommandLog() {
    const { logs, clearLogs } = useLogStore();
    const bottomRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (bottomRef.current && expanded) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, expanded]);

    return (
        <Paper
            sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                width: 320,
                maxHeight: expanded ? 300 : 40,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 20,
                pointerEvents: 'auto',
                transition: 'max-height 0.3s ease',
            }}
        >
            <Box sx={{
                p: 1,
                borderBottom: expanded ? '1px solid rgba(255,255,255,0.1)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
            }}
                onClick={() => setExpanded(!expanded)}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Command Log {logs.length > 0 && `(${logs.length})`}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {expanded && (
                        <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); clearLogs(); }}
                            sx={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                            <DeleteSweepIcon fontSize="small" />
                        </IconButton>
                    )}
                    <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ maxHeight: 250, overflowY: 'auto', p: 1, display: 'flex', flexDirection: 'column-reverse' }}>
                    <div ref={bottomRef} />
                    {logs.map((log) => (
                        <Box key={log.id} sx={{ mb: 0.5 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mr: 1 }}>
                                {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </Typography>
                            <Typography
                                variant="body2"
                                component="span"
                                sx={{
                                    color:
                                        log.type === 'error' ? '#ff5252' :
                                            log.type === 'success' ? '#69f0ae' :
                                                log.type === 'warning' ? '#ffd740' :
                                                    '#e0e0e0'
                                }}
                            >
                                {log.message}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Paper>
    );
}

import { create } from 'zustand';

export interface LogEntry {
    id: string;
    timestamp: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system';
}

interface LogState {
    logs: LogEntry[];
    addLog: (message: string, type?: LogEntry['type']) => void;
    clearLogs: () => void;
}

const useLogStore = create<LogState>((set) => ({
    logs: [],
    addLog: (message, type = 'info') => set((state) => ({
        logs: [
            {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                message,
                type,
            },
            ...state.logs.slice(0, 99), // Keep last 100 logs
        ],
    })),
    clearLogs: () => set({ logs: [] }),
}));

export default useLogStore;

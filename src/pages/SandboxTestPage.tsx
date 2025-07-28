import { useEffect, useRef } from 'react';
import { QuantumInk } from '../QuantumInk';

const SandboxTestPage: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) return;

        const quantumInk = new QuantumInk(currentMount);

        // Cleanup
        return () => {
            quantumInk.destroy();
        };
    }, []);

    return (
        <div ref={mountRef} style={{ width: '800px', height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none' }}>
            {/* Canvas will be appended here */}
        </div>
    );
};

export default SandboxTestPage;

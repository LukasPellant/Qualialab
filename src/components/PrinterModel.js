import React from 'react';
import { useGLTF } from '@react-three/drei';

const PrinterModel = React.forwardRef(({ ...props }, ref) => { // Use forwardRef
    const { scene } = useGLTF('/models//printer/printer.gltf'); //  Adjust path if needed
    return <primitive object={scene} ref={ref} {...props} />; // Pass ref down
});

export default PrinterModel;
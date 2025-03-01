import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PrinterModel = React.forwardRef(({ scale = 1, ...props }, ref) => {
    const { scene } = useGLTF('/models/printer/printer.gltf');
    const boxRef = useRef();

    useEffect(() => {
        if (scene && boxRef.current) {
            const modelBox = new THREE.Box3().setFromObject(scene);
            const center = modelBox.getCenter(new THREE.Vector3());
            boxRef.current.position.copy(center);
            //You might need to adjust Printer y position
        }
    }, [scene]);

    return (
        <group ref={ref} {...props}>
            <primitive object={scene} scale={scale} />

            {/* Invisible Bounding Box */}
            <mesh
                ref={boxRef}
                onClick={(event) => {
                    event.stopPropagation();
                    props.onClick(event);
                }}
                onPointerOver={(event) => {
                    event.stopPropagation();
                    props.onPointerOver(event); // Ensure this is called!
                }}
                onPointerOut={(event) => {
                    event.stopPropagation();
                    props.onPointerOut(event);  // Ensure this is called!
                }}
            >
                <boxGeometry args={[2, 2.5, 2.2]} /> {/* Adjust as needed */}
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
});

export default PrinterModel;
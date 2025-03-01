import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const PrinterModel = React.forwardRef(({ scale = 1, ...props }, ref) => {
    const { scene } = useGLTF('/models/printer/printer.gltf'); // Corrected path
    const boxRef = useRef();

    useEffect(() => {
        if (scene && boxRef.current) {
            const modelBox = new THREE.Box3().setFromObject(scene);
            const center = modelBox.getCenter(new THREE.Vector3());
            boxRef.current.position.copy(center);
        }
    }, [scene]);

    return (
        <group ref={ref} {...props} rotation={[0, Math.PI / 2, 0]}> {/* Rotate 90 degrees around Y-axis */}
            <primitive object={scene} scale={scale} receiveShadow castShadow/>
            <mesh
                ref={boxRef}
                onClick={(event) => {
                    event.stopPropagation();
                    props.onClick(event);
                }}
                onPointerOver={(event) => {
                    event.stopPropagation();
                    props.onPointerOver(event);
                }}
                onPointerOut={(event) => {
                    event.stopPropagation();
                    props.onPointerOut(event);
                }}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[2, 2.5, 2.2]} />
                <meshBasicMaterial transparent opacity={0} />
            </mesh>
        </group>
    );
});

export default PrinterModel;
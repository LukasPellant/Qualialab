// src/app/components/Scene.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Button from './Button';

const Scene = () => {
    const [isFPVMenuVisible, setIsFPVMenuVisible] = useState(false);
    const fpvButtonRef = useRef<THREE.Group>(null); // Reference k FPV buttonu
    const [fpvButtonPosition, setFpvButtonPosition] = useState([0, 0, 0]);

    useEffect(() => {
        if (fpvButtonRef.current) {
            setFpvButtonPosition(fpvButtonRef.current.position.toArray());
        }
    }, [isFPVMenuVisible]);


    const handleClickProjects = () => {
        alert('Projects button clicked!');
    };

    const handleClickFPV = () => {
        setIsFPVMenuVisible(!isFPVMenuVisible); // Toggle viditelnosti menu
    };

    const handleClickEquipment = () => {
        alert('Equipment button clicked!');
    };

    const handleClickRecordings = () => {
        alert('Recordings button clicked!');
    };

    const buttonSpacing = 3; // Mezi tlačítky
    const menuVerticalOffset = -1.5; // Offset pod FPV tlačítkem

    return (
        <Canvas
            style={{ width: '100%', height: '100vh' }}
            gl={{ alpha: false }}
            camera={{ position: [buttonSpacing / 2, 0, 5] }} // Nastavení kamery
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <OrbitControls />
            <Button
                text="Projects"
                onClick={handleClickProjects}
                icon="/icons/printer.png"
                position={[-buttonSpacing / 2, 0, 0]}
            />
            <Button
                text="FPV"
                onClick={handleClickFPV}
                icon="/icons/fpv.png"
                position={[buttonSpacing / 2, 0, 0]}
                ref={fpvButtonRef}
            />
            {isFPVMenuVisible && (
                <>
                    <Button
                        text="Equipment"
                        onClick={handleClickEquipment}
                        icon={null} // No icon
                        position={[fpvButtonPosition[0], fpvButtonPosition[1] + menuVerticalOffset, fpvButtonPosition[2]]} // Positioning
                    />
                    <Button
                        text="Recordings"
                        onClick={handleClickRecordings}
                        icon={null} // No icon
                        position={[fpvButtonPosition[0], fpvButtonPosition[1] + (2*menuVerticalOffset), fpvButtonPosition[2]]} // Positioning
                    />
                </>
            )}
        </Canvas>
    );
};

export default Scene;
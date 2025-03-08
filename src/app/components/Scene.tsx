"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import Button from './Button';
import { DoubleSide, MeshBasicMaterial, PlaneGeometry, VideoTexture } from 'three';
import Camera from './Camera';
import * as THREE from 'three';

const Scene = () => {
    const [isFPVMenuVisible, setIsFPVMenuVisible] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 10));
    const [targetLookAt, setTargetLookAt] = useState(new THREE.Vector3(0, 0, 0));
    const [isOrbitControlsEnabled, setIsOrbitControlsEnabled] = useState(false);
    const fpvButtonRef = useRef<THREE.Group>(null);
    const [fpvButtonPosition, setFpvButtonPosition] = useState([0, 0, 0]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const orbitControlsRef = useRef<OrbitControls>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);

    useEffect(() => {
        if (fpvButtonRef.current) {
            setFpvButtonPosition(fpvButtonRef.current.position.toArray());
        }
    }, [isFPVMenuVisible]);

    useEffect(() => {
        if (isVideoPlaying && videoRef.current) {
            videoRef.current.src = "/records/video.mp4";
            videoRef.current.muted = true;
            videoRef.current.loop = true;
            videoRef.current.play();
        } else if (!isVideoPlaying && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isVideoPlaying]);

    const setCameraView = (position: THREE.Vector3, lookAt: THREE.Vector3) => {
        setTargetPosition(position);
        setTargetLookAt(lookAt);
    };

    const handleClickProjects = () => {
        setCameraView(new THREE.Vector3(-1.5, 0, 10), new THREE.Vector3(-1.5, 0, 0));
    };

    const handleClickFPV = () => {
        setIsFPVMenuVisible(!isFPVMenuVisible);
        setCameraView(new THREE.Vector3(1.5, 0, 10), new THREE.Vector3(1.5, 0, 0));
    };

    const handleClickEquipment = () => {
        setCameraView(new THREE.Vector3(fpvButtonPosition[0], fpvButtonPosition[1] + menuVerticalOffset, 10), new THREE.Vector3(fpvButtonPosition[0], fpvButtonPosition[1] + menuVerticalOffset, 0));
    };

    const handleClickRecordings = () => {
        setIsVideoPlaying(true);
        setIsFPVMenuVisible(false);
        setCameraView(new THREE.Vector3(0, -5, 10), new THREE.Vector3(0, -5, 0));
    };

    const resetAll = () => {
        setIsFPVMenuVisible(false);
        setIsVideoPlaying(false);
        setCameraView(new THREE.Vector3(0, 0, 10), new THREE.Vector3(0, 0, 0));
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                resetAll();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const buttonSpacing = 3;
    const menuVerticalOffset = -1.5;
    const videoWidth = 4;
    const videoHeight = 3;
    const videoPosition = [0, -5, 0];

    const texture = (isVideoPlaying && videoRef.current) ? new VideoTexture(videoRef.current) : null;

    const handlePointerDown = () => {
        setIsOrbitControlsEnabled(true);
    };

    const handlePointerUp = () => {
        setIsOrbitControlsEnabled(false);
    };

    useEffect(() => {
        const controls = orbitControlsRef.current;
        if (controls) {
            const onChange = () => {
                // Důkladná kontrola:
                if (isOrbitControlsEnabled && cameraRef.current && cameraRef.current.position && controls.target) {
                    if (isOrbitControlsEnabled) { // Dodatečná kontrola
                        setTargetPosition(cameraRef.current.position.clone());
                        setTargetLookAt(controls.target.clone());
                    }
                }
            };
            controls.addEventListener('change', onChange);
            return () => controls.removeEventListener('change', onChange);
        }
    }, [isOrbitControlsEnabled, orbitControlsRef, cameraRef]);


    return (
        <Canvas
            style={{ width: '100%', height: '100vh' }}
            gl={{ alpha: false }}
            camera={{ position: [0, 0, 10], fov: 50 }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            ref={cameraRef}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[2, 2, 2]} intensity={1} />
            <OrbitControls

            />
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
                        icon={null}
                        position={[fpvButtonPosition[0], fpvButtonPosition[1] + menuVerticalOffset, fpvButtonPosition[2]]}
                    />
                    <Button
                        text="Recordings"
                        onClick={handleClickRecordings}
                        icon={null}
                        position={[fpvButtonPosition[0], fpvButtonPosition[1] + (2 * menuVerticalOffset), fpvButtonPosition[2]]}
                    />
                </>
            )}

            {isVideoPlaying && texture && (
                <mesh position={videoPosition} rotation={[0, 0, 0]}>
                    <planeGeometry args={[videoWidth, videoHeight]} />
                    <meshBasicMaterial side={DoubleSide} map={texture} toneMapped={false} />
                </mesh>
            )}

            <Html>
                <video ref={videoRef} style={{ display: 'none' }} />
            </Html>
            <Camera targetPosition={targetPosition} targetLookAt={targetLookAt} />
        </Canvas>
    );
};

export default Scene;
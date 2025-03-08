"use client";

import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

interface CameraProps {
    targetPosition: Vector3;
    targetLookAt: Vector3; // Přidáme targetLookAt
}

const Camera = ({ targetPosition, targetLookAt }: CameraProps) => {
    const { camera } = useThree();

    useFrame(() => {
        if (camera) {
            camera.position.lerp(targetPosition, 0.05);
            camera.lookAt(targetLookAt); // Nastavíme lookAt ZDE
        }
    });

    return null;
};

export default Camera;
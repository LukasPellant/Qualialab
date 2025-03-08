// src/app/components/Button.tsx
"use client";

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { TextureLoader } from 'three';
import { useLoader } from '@react-three/fiber'

interface ButtonProps {
    text: string;
    onClick?: () => void;
    icon: string | null;
    position: [number, number, number]
}

const Button = React.forwardRef<THREE.Group, ButtonProps>(({ text, onClick, icon, position }: ButtonProps, ref) => {
    const [hovered, setHovered] = useState(false);
    const [scale, setScale] = useState(1);
    const groupRef = useRef<THREE.Group>(null);
    const texture = icon ? useLoader(TextureLoader, icon) : null;

    useFrame(() => { // ODSTRANÍME KOMENTÁŘE
        // Plynulá změna scale
        if (hovered && scale < 1.15) {
            setScale(scale + 0.01);
        } else if (!hovered && scale > 1) {
            setScale(scale - 0.01);
        }

        // Aplikace scale na group
        if (groupRef.current) {
            groupRef.current.scale.set(scale, scale, scale);
        }
    });

    const hoverColor = '#009eff';
    const defaultColor = 'white';

    return (
        <group
            ref={ref}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            position={position}
        >
            <Text
                position={[0, -0.3, 0]}
                fontSize={0.5}
                color={hovered ? hoverColor : defaultColor}
                anchorX="center"
                anchorY="middle"
                curveSegments={32}
                bevelEnabled
                bevelThickness={0.1}
                bevelOffset={0.0}
                bevelSize={0.05}
                bevelSegments={8}
                font="/fonts/Roboto-Regular.ttf"
                text={text}
            />
            {hovered && texture && (
                <mesh position={[0, 0.7, 0]}>
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial map={texture} transparent={true} />
                </mesh>
            )}
        </group>
    );
});

Button.displayName = 'Button';
export default Button;
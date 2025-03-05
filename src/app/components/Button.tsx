// src/app/components/Button.tsx
"use client";

import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import Image from 'next/image'; // Import Image
import { TextureLoader, PlaneGeometry, MeshBasicMaterial } from 'three'; // Import TextureLoader
import { useLoader } from '@react-three/fiber';

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
    const [hovered, setHovered] = useState(false);
    const [scale, setScale] = useState(1);
    const groupRef = useRef<THREE.Group>(null); // Reference to the group
    const texture = useLoader(TextureLoader, '/icons/printer.png')

    useFrame(() => {
        if (hovered && scale < 1.15) {
            setScale(scale + 0.01);
        } else if (!hovered && scale > 1) {
            setScale(scale - 0.01);
        }
        if (groupRef.current) {
            groupRef.current.scale.set(scale, scale, scale);
        }
    });

    const hoverColor = '#009eff'; // Barva při najetí myší
    const defaultColor = 'white'; // Defaultní barva textu

    return (
        <group
            ref={groupRef}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <Text
                position={[0, -0.3, 0]} // Posuň text dolů
                fontSize={0.5}
                color={hovered ? hoverColor : defaultColor} // Ternární operátor pro barvu
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
             {hovered && (
                <mesh position={[0, 0.7, 0]}>
                  <planeGeometry args={[1, 1]} />
                  <meshBasicMaterial map={texture} transparent={true} />
                </mesh>
            )}
        </group>
    );
};

export default Button;
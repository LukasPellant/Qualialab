import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const FPVDroneModel = ({ color, ...props }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <mesh position={[0, 0, 0]}><boxGeometry args={[1, 0.2, 0.6]} /><meshStandardMaterial color={color || "gray"} /></mesh>
            <mesh position={[0.6, 0, 0.4]}><boxGeometry args={[0.8, 0.05, 0.05]} /><meshStandardMaterial color="darkgray" /></mesh>
            <mesh position={[-0.6, 0, 0.4]}><boxGeometry args={[0.8, 0.05, 0.05]} /><meshStandardMaterial color="darkgray" /></mesh>
            <mesh position={[0.6, 0, -0.4]}><boxGeometry args={[0.8, 0.05, 0.05]} /><meshStandardMaterial color="darkgray" /></mesh>
            <mesh position={[-0.6, 0, -0.4]}><boxGeometry args={[0.8, 0.05, 0.05]} /><meshStandardMaterial color="darkgray" /></mesh>
            <mesh position={[1.0, 0.05, 0.4]}><cylinderGeometry args={[0.2, 0.2, 0.02, 16]} /><meshStandardMaterial color="lightgray" /></mesh>
            <mesh position={[-1.0, 0.05, 0.4]}><cylinderGeometry args={[0.2, 0.2, 0.02, 16]} /><meshStandardMaterial color="lightgray" /></mesh>
            <mesh position={[1.0, 0.05, -0.4]}><cylinderGeometry args={[0.2, 0.2, 0.02, 16]} /><meshStandardMaterial color="lightgray" /></mesh>
            <mesh position={[-1.0, 0.05, -0.4]}><cylinderGeometry args={[0.2, 0.2, 0.02, 16]} /><meshStandardMaterial color="lightgray" /></mesh>
        </group>
    );
};

export default FPVDroneModel;
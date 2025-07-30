import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import useSandboxStore from '@/stores/useSandboxStore';
import { setBlocked } from '@/utils/grid';
import { nanoid } from 'nanoid';
import * as THREE from 'three';
import { Mine, Farm } from '../objects';

export default function BuildPlacement() {
  const { scene, camera } = useThree();
  const { selectedBuildingType, addObject } = useSandboxStore();
  const [hovered, setHovered] = useState(false);
  const [position, setPosition] = useState<[number, number, number]>([0, 0.5, 0]);

  const planeRef = useRef<THREE.Mesh>(null);
  const previewRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (planeRef.current) {
      const intersects = new THREE.Raycaster(
        camera.position,
        camera.getWorldDirection(new THREE.Vector3()).negate()
      ).intersectObject(planeRef.current);

      if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;
        setPosition([
          Math.round(intersectPoint.x),
          0.5,
          Math.round(intersectPoint.z),
        ]);
      }
    }
  });

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(material => {
              material.transparent = true;
              material.opacity = 0.4;
            });
          } else {
            obj.material.transparent = true;
            obj.material.opacity = 0.4;
          }
        }
      });
    }
  }, [selectedBuildingType]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (selectedBuildingType) {
      addObject({ id: nanoid(), type: selectedBuildingType, position: position });
      setBlocked(position[0], position[2]);
    }
  };

  return (
    <>
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        visible={false}
        onPointerMove={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <planeGeometry args={[64, 64]} />
      </mesh>
      {hovered && selectedBuildingType && (
        <group ref={previewRef} position={position}>
          {selectedBuildingType === 'mine' && <Mine />}
          {selectedBuildingType === 'farm' && <Farm />}
        </group>
      )}
    </>
  );
}

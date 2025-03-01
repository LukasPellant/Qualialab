// src/components/CameraControls.js
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const CameraControls = ({ targetPosition, onResetCamera }) => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    camera.position.set(0, 1, 7);
    controls.current.target.set(0,1.5,0);
  }, [camera]);

    useEffect(() => {
        const handleContextMenu = (event) => {
            event.preventDefault();
            onResetCamera();
        };

      const currentControls = controls.current
        if (currentControls) {
            currentControls.domElement.addEventListener('contextmenu', handleContextMenu);
        }

        return () => {
            if (currentControls) {
                currentControls.domElement.removeEventListener('contextmenu', handleContextMenu);
            }
        };
    }, [onResetCamera, controls]);

      useEffect(() => {
        console.log("CameraControls - targetPosition changed:", targetPosition); // Add this
        if (targetPosition && controls.current) {
          camera.position.x = targetPosition[0];
          camera.position.y = targetPosition[1] - 1;
          camera.position.z = targetPosition[2] + 4;
          controls.current.target.set(targetPosition[0], targetPosition[1], targetPosition[2]);
        }
    }, [targetPosition, camera, controls]);

  useFrame(() => {
    controls.current?.update();
  });

  return (
    <OrbitControls
      ref={controls}
      args={[camera, gl.domElement]}
      enablePan={false}
    />
  );
};

export default CameraControls;
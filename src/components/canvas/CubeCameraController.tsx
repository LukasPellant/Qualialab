// src/components/canvas/CubeCameraController.tsx
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface CubeFace {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  cameraPosition: [number, number, number];
  lookAt: [number, number, number];
}

const CubeCameraController = () => {
  const { camera, gl } = useThree();
  const isDraggingRef = useRef<boolean>(false);
  const sphericalRef = useRef(new THREE.Spherical());
  const targetSphericalRef = useRef(new THREE.Spherical());
  const lastFaceRef = useRef<string>('front'); // Track the last non-top/bottom face
  
  // Define the cube faces with consistent distance
  const viewDistance = 16;
  const cubeFaces: CubeFace[] = [
    { 
      id: 'front', 
      position: [0, 0, -12], 
      rotation: [0, 0, 0], 
      cameraPosition: [0, 0, -12 + viewDistance], 
      lookAt: [0, 0, -12] 
    },
    { 
      id: 'right', 
      position: [12, 0, 0], 
      rotation: [0, -Math.PI/2, 0], 
      cameraPosition: [12 - viewDistance, 0, 0], 
      lookAt: [12, 0, 0] 
    },
    { 
      id: 'back', 
      position: [0, 0, 12], 
      rotation: [0, Math.PI, 0], 
      cameraPosition: [0, 0, 12 - viewDistance], 
      lookAt: [0, 0, 12] 
    },
    { 
      id: 'left', 
      position: [-12, 0, 0], 
      rotation: [0, Math.PI/2, 0], 
      cameraPosition: [-12 + viewDistance, 0, 0], 
      lookAt: [-12, 0, 0] 
    },
    { 
      id: 'top', 
      position: [0, 12, 0], 
      rotation: [-Math.PI/2, 0, 0], 
      cameraPosition: [0, 12 - viewDistance, 0], 
      lookAt: [0, 12, 0] 
    },
    { 
      id: 'bottom', 
      position: [0, -12, 0], 
      rotation: [Math.PI/2, 0, 0], 
      cameraPosition: [0, -12 + viewDistance, 0], 
      lookAt: [0, -12, 0] 
    },
  ];
  
  // Track current active face and control state
  const [activeFace, setActiveFace] = useState<CubeFace>(cubeFaces[0]);
  const [targetFace, setTargetFace] = useState<CubeFace | null>(null);
  
  // Mouse state tracking
  const mouseStateRef = useRef({
    isMouseDown: false,
    lastMouseX: 0,
    lastMouseY: 0
  });
  
  // Function to find the nearest face to snap to
  const findNearestFace = () => {
    // Get camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    
    let nearestFace = activeFace;
    let maxDot = -Infinity;
    
    cubeFaces.forEach(face => {
      // Vector from camera to face center
      const faceCenter = new THREE.Vector3(...face.lookAt);
      const toFace = new THREE.Vector3()
        .subVectors(faceCenter, camera.position)
        .normalize();
      
      // Calculate alignment (dot product)
      const dot = cameraDirection.dot(toFace);
      
      if (dot > maxDot) {
        maxDot = dot;
        nearestFace = face;
      }
    });
    
    return nearestFace;
  };
  
  // Update lastFaceRef when face changes
  useEffect(() => {
    if (activeFace) {
      // Always update lastFaceRef for all faces - treating all faces equally
      lastFaceRef.current = activeFace.id;
      
      // Send the current face to window for CubeEnvironment
      if (window) {
        // @ts-ignore
        window.lastHorizontalFace = activeFace.id;
      }
    }
  }, [activeFace]);
  
  // Initial setup
  useEffect(() => {
    if (camera && activeFace) {
      // Initial camera setup
      camera.position.set(
        activeFace.cameraPosition[0],
        activeFace.cameraPosition[1],
        activeFace.cameraPosition[2]
      );
      camera.lookAt(
        activeFace.lookAt[0],
        activeFace.lookAt[1],
        activeFace.lookAt[2]
      );
      
      // Initialize spherical coordinates
      const position = new THREE.Vector3().copy(camera.position);
      sphericalRef.current.setFromVector3(position);
      targetSphericalRef.current.copy(sphericalRef.current);
    }
    
    // Set initial cursor
    gl.domElement.style.cursor = 'grab';
  }, [camera, gl.domElement, activeFace]);
  
  // Setup mouse event listeners
  useEffect(() => {
    if (!gl.domElement) return;
    
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button
      
      mouseStateRef.current.isMouseDown = true;
      isDraggingRef.current = true;
      mouseStateRef.current.lastMouseX = e.clientX;
      mouseStateRef.current.lastMouseY = e.clientY;
      
      gl.domElement.style.cursor = 'grabbing';
      
      // Cancel any in-progress transition
      if (targetFace) {
        setTargetFace(null);
      }
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseStateRef.current.isMouseDown) return;
      
      const deltaX = e.clientX - mouseStateRef.current.lastMouseX;
      const deltaY = e.clientY - mouseStateRef.current.lastMouseY;
      
      // Adjust rotation speed
      const rotationSpeed = 0.005;
      
      // Update spherical coordinates based on mouse movement
      targetSphericalRef.current.theta -= deltaX * rotationSpeed;
      targetSphericalRef.current.phi = THREE.MathUtils.clamp(
        targetSphericalRef.current.phi + deltaY * rotationSpeed,
        Math.PI * 0.1, // Min (to avoid gimbal lock)
        Math.PI * 0.9  // Max (to avoid gimbal lock)
      );
      
      mouseStateRef.current.lastMouseX = e.clientX;
      mouseStateRef.current.lastMouseY = e.clientY;
    };
    
    const onMouseUp = () => {
      if (!mouseStateRef.current.isMouseDown) return;
      
      mouseStateRef.current.isMouseDown = false;
      isDraggingRef.current = false;
      gl.domElement.style.cursor = 'grab';
      
      // Find the nearest face to snap to
      const nearest = findNearestFace();
      setTargetFace(nearest);
      
      // Expose the active face to the global scope
      if (window) {
        // @ts-ignore
        window.currentFace = nearest.id;
      }
      
      console.log('Snapping to face:', nearest.id);
    };
    
    // Add event listeners
    gl.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    // Clean up
    return () => {
      gl.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [camera, gl, activeFace, cubeFaces, targetFace]);
  
  // Check for manual navigation requests
  useEffect(() => {
    const checkTargetFace = () => {
      if (window && 'targetFace' in window) {
        // @ts-ignore
        const requestedFace = window.targetFace;
        // @ts-ignore
        window.targetFace = null; // Clear the request
        
        // Find the requested face
        const face = cubeFaces.find(f => f.id === requestedFace);
        if (face && face.id !== activeFace.id) {
          setTargetFace(face);
          console.log('Navigating to face:', face.id);
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkTargetFace, 200);
    return () => clearInterval(interval);
  }, [activeFace, cubeFaces]);
  
  // Animation frame loop for camera movement
  useFrame(() => {
    if (targetFace && !isDraggingRef.current) {
      // Get target position
      const targetPosition = new THREE.Vector3(...targetFace.cameraPosition);
      const targetLookAt = new THREE.Vector3(...targetFace.lookAt);
      
      // Calculate distance to target
      const distanceToTarget = camera.position.distanceTo(targetPosition);
      
      // Adaptive lerp factor
      const maxDistance = 20;
      const progress = 1 - (distanceToTarget / maxDistance);
      const easeIn = progress * progress * progress; // Cubic easing
      const lerpFactor = 0.02 + easeIn * 0.48;
      
      // Smoothly transition to target position
      camera.position.lerp(targetPosition, lerpFactor);
      
      // Handle camera orientation
      const currentDirection = new THREE.Vector3();
      camera.getWorldDirection(currentDirection);
      
      const targetDirection = new THREE.Vector3().subVectors(targetLookAt, targetPosition).normalize();
      
      // Use quaternion slerp for smoother rotation
      const currentQ = camera.quaternion.clone();
      
      // Create a temporary camera to get the target quaternion
      const tempCamera = new THREE.PerspectiveCamera();
      tempCamera.position.copy(camera.position);
      tempCamera.lookAt(targetLookAt);
      
      // Smoothly interpolate quaternions
      camera.quaternion.slerp(tempCamera.quaternion, lerpFactor);
      
      // Check if we're close enough to complete transition
      if (distanceToTarget < 0.05) {
        setActiveFace(targetFace);
        setTargetFace(null);
        
        // Ensure camera is exactly at the right position
        camera.position.copy(targetPosition);
        
        // Look at the target, but keep vertical orientation
        camera.lookAt(targetLookAt);
        
        console.log('Transition complete to', targetFace.id);
      }
    } else if (isDraggingRef.current) {
      // When dragging, update spherical coordinates WITHOUT modifying radius
      sphericalRef.current.theta = THREE.MathUtils.lerp(
        sphericalRef.current.theta, 
        targetSphericalRef.current.theta, 
        0.2
      );
      
      sphericalRef.current.phi = THREE.MathUtils.lerp(
        sphericalRef.current.phi, 
        targetSphericalRef.current.phi, 
        0.2
      );
      
      // Convert spherical to cartesian
      const newPosition = new THREE.Vector3().setFromSpherical(sphericalRef.current);
      camera.position.copy(newPosition);
      
      // Look at origin
      camera.lookAt(0, 0, 0);
    }
  });
  
  return null;
};

export default CubeCameraController;
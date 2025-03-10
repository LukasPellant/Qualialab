// src/components/canvas/CircularCameraController.tsx
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

interface CircularCameraControllerProps {
  panelCount?: number;
  radius?: number;
  height?: number;
  viewDistance?: number;
  startInCenter?: boolean;
  normalFOV?: number;
  wideFOV?: number;
  dragAreaHeightPercent?: number; // New prop: What percentage of screen height from bottom is draggable
}

const CircularCameraController = ({ 
  panelCount = 5,
  radius = 15,
  height = 0,
  viewDistance = 8,
  startInCenter = true,
  normalFOV = 45,
  wideFOV = 65,
  dragAreaHeightPercent = 33 // Default to bottom 33% of screen
}: CircularCameraControllerProps) => {
  const { camera, gl } = useThree();
  const isDraggingRef = useRef(false);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const targetViewDistanceRef = useRef(viewDistance);
  const currentViewDistanceRef = useRef(viewDistance);
  const targetFOVRef = useRef(normalFOV);
  const currentFOVRef = useRef(normalFOV);
  
  // Add debug state
  const [mouseDebug, setMouseDebug] = useState({
    x: 0,
    y: 0,
    dragging: false,
    inDragArea: false
  });
  
  // Track current active panel
  const [activePanelIndex, setActivePanelIndex] = useState(-1); // -1 means center
  
  // Mouse state tracking
  const mouseStartRef = useRef(0);
  const mouseLastRef = useRef(0);
  
  // Calculate angle for each panel
  const panelAngle = (Math.PI * 2) / panelCount;
  
  // Function to check if mouse position is in the draggable area (bottom third)
  const isInDragArea = (y: number): boolean => {
    const windowHeight = window.innerHeight;
    const dragAreaStart = windowHeight * (1 - dragAreaHeightPercent / 100);
    return y >= dragAreaStart;
  };
  
  // Function to set camera to center position
  const centerCamera = () => {
    camera.position.set(0, height, 0);
    camera.lookAt(0, height, -radius);
    
    // Reset camera properties
    currentViewDistanceRef.current = viewDistance;
    targetViewDistanceRef.current = viewDistance;
    currentFOVRef.current = normalFOV;
    targetFOVRef.current = normalFOV;
    camera.fov = normalFOV;
    camera.updateProjectionMatrix();
    
    setActivePanelIndex(-1);
    
    if (window) {
      // @ts-ignore
      window.currentPanelIndex = -1;
      // @ts-ignore
      window.isAtCenter = true;
    }
  };
  
  // Function to position camera for a specific panel
  const positionCameraForPanel = (panelIndex) => {
    const angle = panelIndex * panelAngle;
    
    // Position camera at fixed distance from center
    const x = Math.sin(-angle) * viewDistance;
    const z = Math.cos(-angle) * viewDistance;
    
    // Look at the panel
    const lookAtX = Math.sin(-angle) * radius;
    const lookAtZ = Math.cos(-angle) * radius;
    
    camera.position.set(x, height, z);
    camera.lookAt(lookAtX, height, lookAtZ);
    
    // Reset camera properties
    currentViewDistanceRef.current = viewDistance;
    targetViewDistanceRef.current = viewDistance;
    currentFOVRef.current = normalFOV;
    targetFOVRef.current = normalFOV;
    camera.fov = normalFOV;
    camera.updateProjectionMatrix();
    
    currentAngleRef.current = angle;
    targetAngleRef.current = angle;
    
    // Update panel index tracking
    setActivePanelIndex(panelIndex);
    if (window) {
      // @ts-ignore
      window.currentPanelIndex = panelIndex;
      // @ts-ignore
      window.isAtCenter = false;
    }
  };
  
  // Find the nearest panel to the current angle
  const snapToNearestPanel = () => {
    let angle = targetAngleRef.current;
    
    // Normalize angle to 0-2π
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    
    // Find closest panel
    const closestPanelIndex = Math.round(angle / panelAngle) % panelCount;
    
    // Navigate to this panel
    positionCameraForPanel(closestPanelIndex);
  };
  
  // Debug UI for mouse tracking
  useEffect(() => {
    // Create debug UI
    const createDebugUI = () => {
      const debugContainer = document.createElement('div');
      debugContainer.id = 'mouse-debug';
      debugContainer.style.position = 'fixed';
      debugContainer.style.top = '10px';
      debugContainer.style.right = '10px';
      debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      debugContainer.style.color = 'white';
      debugContainer.style.padding = '10px';
      debugContainer.style.borderRadius = '5px';
      debugContainer.style.fontFamily = 'monospace';
      debugContainer.style.zIndex = '1000';
      
      const debugButton = document.createElement('button');
      debugButton.textContent = 'Test Mouse';
      debugButton.style.display = 'block';
      debugButton.style.marginTop = '10px';
      debugButton.style.padding = '5px 10px';
      debugButton.style.backgroundColor = '#4ade80';
      debugButton.style.border = 'none';
      debugButton.style.borderRadius = '3px';
      debugButton.style.cursor = 'pointer';
      
      debugButton.addEventListener('mousedown', () => {
        debugButton.style.backgroundColor = '#22c55e';
      });
      
      debugButton.addEventListener('mouseup', () => {
        debugButton.style.backgroundColor = '#4ade80';
        alert('Mouse is working correctly!');
      });
      
      debugContainer.appendChild(document.createTextNode('Mouse Debug:'));
      debugContainer.appendChild(document.createElement('br'));
      const debugText = document.createElement('div');
      debugText.id = 'debug-text';
      debugContainer.appendChild(debugText);
      debugContainer.appendChild(debugButton);
      
      document.body.appendChild(debugContainer);
      
      return debugText;
    };
    
    // Add or find debug UI
    let debugText = document.getElementById('debug-text');
    if (!debugText) {
      debugText = createDebugUI();
    }
    
    // Update debug information
    const updateDebugInfo = () => {
      if (debugText) {
        debugText.textContent = `
X: ${mouseDebug.x.toFixed(0)}
Y: ${mouseDebug.y.toFixed(0)}
Dragging: ${mouseDebug.dragging ? 'Yes' : 'No'}
In Drag Area: ${mouseDebug.inDragArea ? 'Yes' : 'No'}
Panel: ${activePanelIndex}
FOV: ${camera.fov.toFixed(1)}
`;
      }
    };
    
    // Set up interval to update debug info
    const interval = setInterval(updateDebugInfo, 100);
    
    return () => {
      clearInterval(interval);
    };
  }, [mouseDebug, activePanelIndex, camera.fov]);
  
  // Initial setup
  useEffect(() => {
    if (startInCenter) {
      centerCamera();
    } else {
      positionCameraForPanel(0);
    }
    
    gl.domElement.style.cursor = 'grab';
  }, [camera, gl.domElement, panelCount, radius, height, viewDistance]);
  
  // Setup mouse event listeners
  useEffect(() => {
    if (!gl.domElement) return;
    
    // Create a visual indicator for the drag area
    const createDragAreaIndicator = () => {
        const indicator = document.createElement('div');
        indicator.id = 'drag-area-indicator';
        
        // Style the indicator to be completely invisible
        indicator.style.position = 'fixed';
        indicator.style.bottom = '0';
        indicator.style.left = '0';
        indicator.style.width = '100%';
        indicator.style.height = `${dragAreaHeightPercent}%`;
        indicator.style.backgroundColor = 'rgba(255, 255, 255, 0)'; // Fully transparent
        indicator.style.border = 'none'; // Remove the border
        indicator.style.zIndex = '5';
        indicator.style.pointerEvents = 'none'; // Ensure it doesn't block mouse events
        
        document.body.appendChild(indicator);
        return indicator;
      };
    // Add the indicator
    const dragIndicator = createDragAreaIndicator();
    
    const onMouseDown = (e) => {
      if (e.button !== 0) return; // Only left mouse button
      
      // Check if in drag area
      const isInDragZone = isInDragArea(e.clientY);
      
      // Update mouse debug with drag area status
      setMouseDebug(prev => ({
        ...prev,
        inDragArea: isInDragZone
      }));
      
      // Only allow dragging in the drag area
      if (!isInDragZone) return;
      
      isDraggingRef.current = true;
      mouseStartRef.current = e.clientX;
      mouseLastRef.current = e.clientX;
      
      // Update mouse debug
      setMouseDebug(prev => ({
        ...prev,
        dragging: true
      }));
      
      // Set wider FOV and increase view distance when starting to drag
      targetFOVRef.current = wideFOV;
      targetViewDistanceRef.current = viewDistance * 1.3; // Zoom out by 30%
      
      gl.domElement.style.cursor = 'grabbing';
      
      // If at center, move to first panel
      if (activePanelIndex === -1) {
        positionCameraForPanel(0);
      }
    };
    
    const onMouseMove = (e) => {
      // Always track mouse position for debugging
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      
      // Check if mouse is in drag area
      const inDragArea = isInDragArea(e.clientY);
      
      // Update debug state
      setMouseDebug(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        inDragArea: inDragArea
      }));
      
      // Update cursor based on whether mouse is in drag area
      if (inDragArea && !isDraggingRef.current) {
        gl.domElement.style.cursor = 'grab';
      } else if (!inDragArea && !isDraggingRef.current) {
        gl.domElement.style.cursor = 'default';
      }
      
      if (!isDraggingRef.current) return;
      
      const deltaX = e.clientX - mouseLastRef.current;
      mouseLastRef.current = e.clientX;
      
      // Update target angle based on mouse movement
      // Use a smaller factor (0.001) as requested for slower rotation
      targetAngleRef.current -= deltaX * 0.005;
    };
    
    const onMouseUp = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      
      // Update mouse debug
      setMouseDebug(prev => ({
        ...prev,
        dragging: false
      }));
      
      // Return to normal FOV and view distance
      targetFOVRef.current = normalFOV;
      targetViewDistanceRef.current = viewDistance;
      
      // Update cursor to match whether we're in the drag area
      const inDragArea = isInDragArea(mousePositionRef.current.y);
      gl.domElement.style.cursor = inDragArea ? 'grab' : 'default';
      
      // Snap to nearest panel
      snapToNearestPanel();
    };
    
    // Touch event handlers for mobile
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      // Check if in drag area
      const isInDragZone = isInDragArea(touch.clientY);
      
      // Update mouse debug with drag area status
      setMouseDebug(prev => ({
        ...prev,
        inDragArea: isInDragZone
      }));
      
      // Only allow dragging in the drag area
      if (!isInDragZone) return;
      
      isDraggingRef.current = true;
      mouseStartRef.current = touch.clientX;
      mouseLastRef.current = touch.clientX;
      
      // Update debug state
      setMouseDebug(prev => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY,
        dragging: true
      }));
      
      // Set wider FOV and increase view distance when starting to drag
      targetFOVRef.current = wideFOV;
      targetViewDistanceRef.current = viewDistance * 1.3; // Zoom out by 30%
      
      // If at center, move to first panel
      if (activePanelIndex === -1) {
        positionCameraForPanel(0);
      }
    };
    
    const onTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      // Update debug state
      setMouseDebug(prev => ({
        ...prev,
        x: touch.clientX,
        y: touch.clientY,
        inDragArea: isInDragArea(touch.clientY)
      }));
      
      const deltaX = touch.clientX - mouseLastRef.current;
      mouseLastRef.current = touch.clientX;
      
      // Update target angle based on touch movement
      // Use a smaller factor for slower rotation
      targetAngleRef.current -= deltaX * 0.001;
    };
    
    const onTouchEnd = () => {
      if (!isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      
      // Update debug state
      setMouseDebug(prev => ({
        ...prev,
        dragging: false
      }));
      
      // Return to normal FOV and view distance
      targetFOVRef.current = normalFOV;
      targetViewDistanceRef.current = viewDistance;
      
      // Snap to nearest panel
      snapToNearestPanel();
    };
    
    // Add event listeners
    gl.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    
    gl.domElement.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    
    // Clean up
    return () => {
      gl.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      gl.domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      
      // Remove the drag area indicator
      if (dragIndicator && dragIndicator.parentNode) {
        dragIndicator.parentNode.removeChild(dragIndicator);
      }
    };
  }, [camera, gl, activePanelIndex, panelAngle, panelCount, wideFOV, normalFOV, viewDistance, dragAreaHeightPercent]);
  
  // Check for navigation requests
  useEffect(() => {
    const checkTargetPanel = () => {
      if (window && 'targetPanel' in window) {
        // @ts-ignore
        const requestedPanel = window.targetPanel;
        
        if (requestedPanel !== null && requestedPanel !== undefined) {
          // Clear the request
          // @ts-ignore
          window.targetPanel = null;
          
          // Make sure the requested panel is valid
          const targetIndex = typeof requestedPanel === 'string'
            ? parseInt(requestedPanel, 10)
            : requestedPanel;
          
          if (targetIndex === -1) {
            // Navigate to center
            centerCamera();
          } else if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < panelCount) {
            // Navigate to specific panel
            positionCameraForPanel(targetIndex);
          }
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkTargetPanel, 200);
    return () => clearInterval(interval);
  }, []);
  
  // Animation frame for smooth transitions
  useFrame((_, delta) => {
    // Skip if we're in center view
    if (activePanelIndex === -1) return;
    
    // Smoothly update FOV
    currentFOVRef.current = THREE.MathUtils.lerp(
      currentFOVRef.current,
      targetFOVRef.current,
      0.1
    );
    
    if (Math.abs(currentFOVRef.current - camera.fov) > 0.1) {
      camera.fov = currentFOVRef.current;
      camera.updateProjectionMatrix();
    }
    
    // Smoothly update view distance
    currentViewDistanceRef.current = THREE.MathUtils.lerp(
      currentViewDistanceRef.current,
      targetViewDistanceRef.current,
      0.1
    );
    
    // Calculate camera position based on current angle and view distance
    const angle = targetAngleRef.current;
    const x = Math.sin(-angle) * currentViewDistanceRef.current;
    const z = Math.cos(-angle) * currentViewDistanceRef.current;
    const lookAtX = Math.sin(-angle) * radius;
    const lookAtZ = Math.cos(-angle) * radius;
    
    // Update camera position and look at target
    camera.position.set(x, height, z);
    camera.lookAt(lookAtX, height, lookAtZ);
    currentAngleRef.current = angle;
  });
  
  return null;
};

export default CircularCameraController;
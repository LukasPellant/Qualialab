// src/hooks/useMousePosition.ts
import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  // Normalized values between -1 and 1
  normalizedX: number;
  normalizedY: number;
}

export default function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0
  });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Calculate normalized values (between -1 and 1)
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX,
        normalizedY
      });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  
  return mousePosition;
}
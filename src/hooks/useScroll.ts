// src/hooks/useScroll.ts
import { useState, useEffect } from 'react';

interface ScrollData {
  scrollY: number;
  scrollProgress: number; // 0 to 1
  direction: 'up' | 'down' | null;
}

export default function useScroll(): ScrollData {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scrollY: 0,
    scrollProgress: 0,
    direction: null
  });
  
  useEffect(() => {
    let lastScrollY = 0;
    
    const updateScrollData = () => {
      const currentScrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? currentScrollY / documentHeight : 0;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      setScrollData({
        scrollY: currentScrollY,
        scrollProgress: progress,
        direction: currentScrollY !== lastScrollY ? direction : null
      });
      
      lastScrollY = currentScrollY;
    };
    
    // Create a custom wheel event handler for full-canvas sites
    const handleWheel = (e: WheelEvent) => {
      // Prevent default scrolling
      e.preventDefault();
      
      // Instead, update a virtual scroll position
      const delta = e.deltaY;
      const newScrollY = Math.max(0, lastScrollY + delta * 0.5);
      
      // Update the last scroll position
      lastScrollY = newScrollY;
      
      // Calculate the page height (can be virtual for canvas-only sites)
      const pageHeight = 5000; // Virtual page height
      const progress = Math.min(1, newScrollY / pageHeight);
      
      setScrollData({
        scrollY: newScrollY,
        scrollProgress: progress,
        direction: delta > 0 ? 'down' : 'up'
      });
    };
    
    // Use wheel event for canvas-only sites
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Clean up
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  return scrollData;
}
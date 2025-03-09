// src/components/FullScreenFix.tsx
'use client'

import { useEffect } from 'react';

/**
 * This component fixes issues with full-screen Three.js canvas
 * by ensuring the correct viewport dimensions are set
 */
const FullScreenFix = () => {
  useEffect(() => {
    // Fix for iOS Safari and other mobile browsers
    const setVH = () => {
      // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
      const vh = window.innerHeight * 0.01;
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Also ensure the body and html are full height
      document.body.style.height = `${window.innerHeight}px`;
      document.documentElement.style.height = `${window.innerHeight}px`;
    };

    // Set on first load
    setVH();
    
    // Update on resize
    window.addEventListener('resize', setVH);
    
    // Update on orientation change
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default FullScreenFix;
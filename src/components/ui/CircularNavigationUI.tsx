// src/components/ui/CircularNavigationUI.tsx
import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiHome, FiCode, FiBook, FiUser, FiMail, FiGrid } from 'react-icons/fi';

interface CircularNavigationUIProps {
  panelCount: number;
}

const CircularNavigationUI: React.FC<CircularNavigationUIProps> = ({ panelCount }) => {
  const [activePanelIndex, setActivePanelIndex] = useState<number>(-1); // Start at center
  const [isAtCenter, setIsAtCenter] = useState<boolean>(true);
  
  // Define panel data
  const panelData = [
    { id: 'home', name: 'Home', icon: <FiHome size={24} /> },
    { id: 'projects', name: 'Projects', icon: <FiCode size={24} /> },
    { id: 'blog', name: 'Blog', icon: <FiBook size={24} /> },
    { id: 'about', name: 'About', icon: <FiUser size={24} /> },
    { id: 'contact', name: 'Contact', icon: <FiMail size={24} /> }
  ].slice(0, panelCount);
  
  // Sync with the camera controller's active panel
  useEffect(() => {
    const checkActivePanel = () => {
      if (window) {
        // Check if we're at center
        // @ts-ignore
        if ('isAtCenter' in window) {
          // @ts-ignore
          const centerState = !!window.isAtCenter;
          setIsAtCenter(centerState);
        }
        
        // Check active panel index
        // @ts-ignore
        if ('currentPanelIndex' in window) {
          // @ts-ignore
          const currentIndex = window.currentPanelIndex;
          if (currentIndex !== activePanelIndex) {
            setActivePanelIndex(currentIndex);
          }
        }
      }
    };
    
    // Check periodically
    const interval = setInterval(checkActivePanel, 200);
    
    return () => clearInterval(interval);
  }, [activePanelIndex, panelCount]);
  
  // Navigation functions
  const navigateToPanel = (index: number) => {
    if (window) {
      // @ts-ignore
      window.targetPanel = index;
    }
  };
  
  const navigateToCenter = () => {
    navigateToPanel(-1);
  };
  
  const navigatePrevious = () => {
    if (isAtCenter) {
      // From center, go to first panel
      navigateToPanel(0);
    } else {
      const newIndex = (activePanelIndex - 1 + panelCount) % panelCount;
      navigateToPanel(newIndex);
    }
  };
  
  const navigateNext = () => {
    if (isAtCenter) {
      // From center, go to first panel
      navigateToPanel(0);
    } else {
      const newIndex = (activePanelIndex + 1) % panelCount;
      navigateToPanel(newIndex);
    }
  };
  
  return (
    <div className="fixed bottom-8 left-0 right-0 mx-auto z-10 flex flex-col items-center">
      {/* Panel name display */}
      <div className="text-white text-xl mb-4 font-medium">
        {isAtCenter ? 'Overview' : panelData[activePanelIndex]?.name || 'Navigation'}
      </div>
      
      {/* Navigation controls */}
      <div className="flex items-center space-x-6">
        {/* Previous button */}
        <button 
          onClick={navigatePrevious}
          className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full transition-colors"
          aria-label="Previous panel"
        >
          <FiArrowLeft size={24} />
        </button>
        
        {/* Center view button */}
        <button
          onClick={navigateToCenter}
          className={`p-3 rounded-full transition-all transform ${
            isAtCenter 
              ? 'bg-teal-500 scale-110' 
              : 'bg-slate-700 hover:bg-slate-600'
          }`}
          aria-label="Center view"
          title="Overview"
        >
          <FiGrid size={24} />
        </button>
        
        {/* Panel indicators */}
        <div className="flex items-center space-x-3">
          {panelData.map((panel, index) => (
            <button
              key={panel.id}
              onClick={() => navigateToPanel(index)}
              className={`p-2 rounded-full transition-all transform ${
                index === activePanelIndex && !isAtCenter
                  ? 'bg-teal-500 scale-110' 
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
              aria-label={`Navigate to ${panel.name}`}
              title={panel.name}
            >
              {panel.icon}
            </button>
          ))}
        </div>
        
        {/* Next button */}
        <button 
          onClick={navigateNext}
          className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full transition-colors"
          aria-label="Next panel"
        >
          <FiArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CircularNavigationUI;
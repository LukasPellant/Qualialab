// src/components/ui/ControlSliders.tsx
import React, { useState, useEffect } from 'react';

interface ControlSlidersProps {
  initialPanelCount: number;
  initialRadius: number;
  initialViewDistance: number;
  panelCountRange: [number, number]; // [min, max]
  radiusRange: [number, number]; // [min, max]
  viewDistanceRange: [number, number]; // [min, max]
}

const ControlSliders: React.FC<ControlSlidersProps> = ({
  initialPanelCount = 8,
  initialRadius = 25,
  initialViewDistance = 8,
  panelCountRange = [3, 12],
  radiusRange = [15, 40],
  viewDistanceRange = [5, 20]
}) => {
  const [panelCount, setPanelCount] = useState(initialPanelCount);
  const [radius, setRadius] = useState(initialRadius);
  const [viewDistance, setViewDistance] = useState(initialViewDistance);

  // Update global values whenever sliders change
  useEffect(() => {
    if (window) {
      // @ts-ignore
      window.configPanelCount = panelCount;
      // @ts-ignore
      window.configRadius = radius;
      // @ts-ignore
      window.configViewDistance = viewDistance;
      
      // Trigger an update event that scene can listen for
      const event = new CustomEvent('sceneConfigUpdated', {
        detail: { panelCount, radius, viewDistance }
      });
      window.dispatchEvent(event);
    }
  }, [panelCount, radius, viewDistance]);

  // Add styles to ensure controls work
  useEffect(() => {
    // Add a style tag to ensure our controls work
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .control-overlay {
        position: fixed !important;
        z-index: 1000 !important;
        pointer-events: auto !important;
      }
      
      .slider-control {
        pointer-events: auto !important;
        cursor: pointer !important;
        touch-action: manipulation !important;
      }
      
      .slider-control:hover {
        opacity: 0.9;
      }
      
      .slider-control:active {
        opacity: 0.8;
      }
    `;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 mx-auto flex justify-center items-center bg-slate-900/80 backdrop-blur-sm p-4 w-full max-w-3xl rounded-lg control-overlay" style={{ zIndex: 1000 }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Panel Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="panelCount" className="text-white text-sm font-medium">
              Panel Count: {panelCount}
            </label>
            <span className="text-slate-300 text-xs">
              {panelCountRange[0]}-{panelCountRange[1]}
            </span>
          </div>
          <input
            id="panelCount"
            type="range"
            min={panelCountRange[0]}
            max={panelCountRange[1]}
            step="1"
            value={panelCount}
            onChange={(e) => setPanelCount(parseInt(e.target.value))}
            className="w-full appearance-none h-2 bg-slate-700 rounded-lg outline-none slider-control [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            style={{ zIndex: 1001, pointerEvents: 'auto' }}
          />
        </div>

        {/* Radius Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="radius" className="text-white text-sm font-medium">
              Radius: {radius}
            </label>
            <span className="text-slate-300 text-xs">
              {radiusRange[0]}-{radiusRange[1]}
            </span>
          </div>
          <input
            id="radius"
            type="range"
            min={radiusRange[0]}
            max={radiusRange[1]}
            step="1"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full appearance-none h-2 bg-slate-700 rounded-lg outline-none slider-control [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            style={{ zIndex: 1001, pointerEvents: 'auto' }}
          />
        </div>

        {/* View Distance Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="viewDistance" className="text-white text-sm font-medium">
              View Distance: {viewDistance}
            </label>
            <span className="text-slate-300 text-xs">
              {viewDistanceRange[0]}-{viewDistanceRange[1]}
            </span>
          </div>
          <input
            id="viewDistance"
            type="range"
            min={viewDistanceRange[0]}
            max={viewDistanceRange[1]}
            step="0.5"
            value={viewDistance}
            onChange={(e) => setViewDistance(parseFloat(e.target.value))}
            className="w-full appearance-none h-2 bg-slate-700 rounded-lg outline-none slider-control [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            style={{ zIndex: 1001, pointerEvents: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlSliders;
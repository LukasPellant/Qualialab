import './App.css';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const EquipmentPage = React.lazy(() => import('./pages/EquipmentPage'));
const Projects = React.lazy(() => import('./pages/Projects'));
const SandboxPage = React.lazy(() => import('./pages/SandboxPage'));
const VideoArchive = React.lazy(() => import('./pages/VideoArchive'));
const VideoPlayerPage = React.lazy(() => import('./pages/VideoPlayerPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="equipment" element={<EquipmentPage />} />
            <Route path="projects" element={<Projects />} />
            <Route path="sandbox" element={<SandboxPage />} />
            <Route path="video-archive" element={<VideoArchive />} />
            <Route path="video/:id" element={<VideoPlayerPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
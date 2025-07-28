import './App.css';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import EquipmentPage from './pages/EquipmentPage';
import Projects from './pages/Projects';
import Sandbox from './pages/Sandbox';
import VideoArchive from './pages/VideoArchive';
import VideoPlayerPage from './pages/VideoPlayerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="video-archive" element={<VideoArchive />} />
          <Route path="video/:id" element={<VideoPlayerPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VideoArchive from './pages/VideoArchive';
import Projects from './pages/Projects';
import Sandbox from './pages/Sandbox';
import AboutPage from './pages/AboutPage';
import EquipmentPage from './pages/EquipmentPage';
import MainLayout from './layouts/MainLayout';
import VideoPlayerPage from './pages/VideoPlayerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/archive" element={<VideoArchive />} />
          <Route path="/videos/:uid" element={<VideoPlayerPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/sandbox" element={<Sandbox />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

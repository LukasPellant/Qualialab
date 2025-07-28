import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './App.css';
import MainLayout from './layouts/MainLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import EquipmentPage from './pages/EquipmentPage';
import Projects from './pages/Projects';
import Sandbox from './pages/Sandbox';
import VideoArchive from './pages/VideoArchive';
import SandboxTestPage from './pages/SandboxTestPage';
function App() {
    return (_jsx(Router, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(MainLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "about", element: _jsx(AboutPage, {}) }), _jsx(Route, { path: "equipment", element: _jsx(EquipmentPage, {}) }), _jsx(Route, { path: "projects", element: _jsx(Projects, {}) }), _jsx(Route, { path: "sandbox", element: _jsx(Sandbox, {}) }), _jsx(Route, { path: "video-archive", element: _jsx(VideoArchive, {}) }), _jsx(Route, { path: "sandbox-test", element: _jsx(SandboxTestPage, {}) })] }) }) }));
}
export default App;

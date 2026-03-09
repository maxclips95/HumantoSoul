import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import AboutUs from './pages/AboutUsPage';
import BabaJaigurudev from './pages/BabaJaigurudev';
import BabaUmakant from './pages/BabaUmakant';
import Contact from './pages/ContactPage';
import Gallery from './pages/GalleryPage';
import Literature from './pages/LiteraturePage';
import Prarthana from './pages/PrarthanaPage';
import DownloadsPage from './pages/DownloadsPage';
import Prophecies from './pages/Prophecies';
import SatvicLifestyle from './pages/SatvicLifestyle';
import Announcements from './components/Announcements';
import AdminLogin from './components/AdminLogin';

import AdminDashboard from './components/AdminDashboard';
import BlogPage from './pages/BlogPage';
import ProphecyDetail from './pages/ProphecyDetail';
import AnnouncementDetail from './pages/AnnouncementDetail';
import VoiceAssistant from './components/common/VoiceAssistant';
import MeditationPage from './pages/MeditationPage';
import VegetarianLivingPage from './pages/VegetarianLivingPage';
import LiberationPage from './pages/LiberationPage';
import PeaceAndSocietyPage from './pages/PeaceAndSocietyPage';
import GlossaryPage from './pages/GlossaryPage';
import VirtualTour from './pages/VirtualTour';
import AppRoutes from './components/common/AppRoutes';

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <Header />
        <main>
          <AppRoutes />
        </main>
        <VoiceAssistant />
        <Footer />

      </ErrorBoundary>
    </div >
  );
}

export default App;

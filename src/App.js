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



function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/baba-jaigurudev" element={<BabaJaigurudev />} />
            <Route path="/baba-umakant" element={<BabaUmakant />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/literature" element={<Literature />} />
            <Route path="/prarthana" element={<Prarthana />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/prophecies" element={<Prophecies />} />
            <Route path="/satvic-lifestyle" element={<SatvicLifestyle />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/prophecy/:id" element={<ProphecyDetail />} />
            <Route path="/announcement/:id" element={<AnnouncementDetail />} />
          </Routes>
        </main>
        <Footer />

      </ErrorBoundary>
    </div>
  );
}

export default App;

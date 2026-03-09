import React, { useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Home from '../../pages/Home';
import AboutUs from '../../pages/AboutUsPage';
import BabaJaigurudev from '../../pages/BabaJaigurudev';
import BabaUmakant from '../../pages/BabaUmakant';
import Contact from '../../pages/ContactPage';
import Gallery from '../../pages/GalleryPage';
import Literature from '../../pages/LiteraturePage';
import Prarthana from '../../pages/PrarthanaPage';
import DownloadsPage from '../../pages/DownloadsPage';
import Prophecies from '../../pages/Prophecies';
import SatvicLifestyle from '../../pages/SatvicLifestyle';
import Announcements from '../Announcements';
import AdminLogin from '../AdminLogin';
import AdminDashboard from '../AdminDashboard';
import BlogPage from '../../pages/BlogPage';
import ProphecyDetail from '../../pages/ProphecyDetail';
import AnnouncementDetail from '../../pages/AnnouncementDetail';
import MeditationPage from '../../pages/MeditationPage';
import VegetarianLivingPage from '../../pages/VegetarianLivingPage';
import LiberationPage from '../../pages/LiberationPage';
import PeaceAndSocietyPage from '../../pages/PeaceAndSocietyPage';
import GlossaryPage from '../../pages/GlossaryPage';
import VirtualTour from '../../pages/VirtualTour';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'ar', 'pt'];

// A wrapper component that extracts the 'lang' parameter and updates i18n
const LanguageWrapper = ({ children }) => {
    const { lang } = useParams();
    const { i18n } = useTranslation();

    useEffect(() => {
        if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
            // Valid language prefix in URL — sync i18n and HTML lang attribute
            if (i18n.language !== lang) {
                i18n.changeLanguage(lang);
            }
            document.documentElement.lang = lang;
        } else {
            // No language prefix — default to English
            document.documentElement.lang = 'en';
        }
    }, [lang, i18n]);

    return children;
};

// All standard routes extracted so we can mount them twice (with and without /:lang prefix)
const CoreRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="baba-jaigurudev" element={<BabaJaigurudev />} />
        <Route path="baba-umakant" element={<BabaUmakant />} />
        <Route path="contact" element={<Contact />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="literature" element={<Literature />} />
        <Route path="prarthana" element={<Prarthana />} />
        <Route path="downloads" element={<DownloadsPage />} />
        <Route path="prophecies" element={<Prophecies />} />
        <Route path="satvic-lifestyle" element={<SatvicLifestyle />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="admin-dashboard" element={<AdminDashboard />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="meditation" element={<MeditationPage />} />
        <Route path="vegetarian-living" element={<VegetarianLivingPage />} />
        <Route path="liberation" element={<LiberationPage />} />
        <Route path="peace-and-society" element={<PeaceAndSocietyPage />} />
        <Route path="glossary" element={<GlossaryPage />} />
        <Route path="virtual-tour" element={<VirtualTour />} />
        <Route path="prophecy/:id" element={<ProphecyDetail />} />
        <Route path="announcement/:id" element={<AnnouncementDetail />} />
    </Routes>
);

const AppRoutes = () => {
    return (
        <Routes>
            {/* Explicitly enumerate ONLY valid language prefixes so React Router
                does NOT match page names like 'about' or 'prophecies' as a language code */}
            {SUPPORTED_LANGUAGES.filter(l => l !== 'en').map(lang => (
                <Route key={lang} path={`/${lang}/*`} element={
                    <LanguageWrapper>
                        <CoreRoutes />
                    </LanguageWrapper>
                } />
            ))}

            {/* Default routes WITHOUT a language prefix (English) */}
            <Route path="/*" element={
                <LanguageWrapper>
                    <CoreRoutes />
                </LanguageWrapper>
            } />
        </Routes>
    );
};

export default AppRoutes;

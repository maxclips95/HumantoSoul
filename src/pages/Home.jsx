// src/pages/Home.jsx
import React from "react";
import Carousel from "../components/Carousel";
import HeroSection from "../components/HeroSection";
import AshramTour from "../components/AshramTour";
import YouTubeFeed from "../components/YouTubeFeed";
import Testimonials from "../components/Testimonials";

import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Human to Soul - Jai Gurudev Spiritual Teachings & Prophecies</title>
        <meta name="description" content="Welcome to Human to Soul. Discover the spiritual teachings of Baba Jai Gurudev, read 2026 prophecies, and explore the Satvic lifestyle for enlightenment." />
        <meta name="keywords" content="Human to Soul, Jai Gurudev, Satsang, Prophecies 2026, Spiritual, Baba Jaigurudev, Santmat" />
      </Helmet>
      <Carousel />
      <HeroSection />
      <AshramTour />
      <YouTubeFeed />
      <Testimonials />
    </>
  );
}

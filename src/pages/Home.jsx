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
        <meta name="description" content="Human to Soul: The official platform for Baba Jai Gurudev's teachings on the Time Change (Yug Parivartan) and the arrival of Satyug." />
        <meta name="keywords" content="Satsang, Spiritual, Master of Time, Owner of Time, Baba Jaigurudev, Baba Umakant Ji, Prophecies, Prophecy, Satyug, Time Change, Yug Cycle, Human to Soul" />
      </Helmet>
      <Carousel />
      <HeroSection />
      <AshramTour />
      <YouTubeFeed />
      <Testimonials />
    </>
  );
}

// src/pages/Home.jsx
import React from "react";
import Carousel from "../components/Carousel";
import HeroSection from "../components/HeroSection";
import AshramTour from "../components/AshramTour";
import YouTubeFeed from "../components/YouTubeFeed";
import Testimonials from "../components/Testimonials";

import SEO from "../components/common/SEO";

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Join the global movement for peace and spiritual unity. Discover powerful peace meditation for the world, spiritual diplomacy, and interfaith wisdom through Baba Jai Gurudev."
        keywords="peace meditation for world, spiritual unity message, global harmony prayer, interfaith wisdom, spiritual diplomacy, Baba Jaigurudev, Satyug"
      />
      <Carousel />
      <HeroSection />
      <AshramTour />
      <YouTubeFeed />
      <Testimonials />
    </>
  );
}

// src/pages/Home.jsx
import React from "react";
import Carousel from "../components/Carousel";
import HeroSection from "../components/HeroSection";
import AshramTour from "../components/AshramTour";
import YouTubeFeed from "../components/YouTubeFeed";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Carousel />
      <HeroSection />
      <AshramTour />
      <YouTubeFeed />
      <Testimonials />
    </>
  );
}

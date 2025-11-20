// src/pages/Home.jsx
import React from "react";
import Carousel from "../components/Carousel";
import HeroSection from "../components/HeroSection";
import YouTubeFeed from "../components/YouTubeFeed";
import Header from "../components/Header";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <Carousel />
      <HeroSection />
      <YouTubeFeed />
      <Testimonials />
    </>
  );
}

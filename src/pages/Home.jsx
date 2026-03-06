// src/pages/Home.jsx
import React from "react";
import Carousel from "../components/Carousel";
import HeroSection from "../components/HeroSection";

import YouTubeFeed from "../components/YouTubeFeed";
import Testimonials from "../components/Testimonials";
import BlueprintHomeSections from "../components/BlueprintHomeSections";
import SEO from "../components/common/SEO";
import StartHere from "../components/StartHere";

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.humantosoul.com/#webpage",
  "url": "https://www.humantosoul.com/",
  "name": "Human to Soul — Inner Transformation, Dhyan Meditation & Spiritual Awakening | Baba Jaigurudev",
  "description": "Global spiritual platform of Baba Jaigurudev Ji Maharaj. Discover dhyan (meditation), satsang, vegetarian living, yog sadhna, prophecies, and the path from Human to Soul — inner peace, liberation (moksha), and God-realization.",
  "isPartOf": { "@id": "https://www.humantosoul.com/#website" },
  "about": {
    "@type": "Thing",
    "name": "Dhyan Meditation, Spiritual Awakening, Satsang, Prophecy, Soul, Moksha, Inner Peace, Vegetarian Living"
  },
  "keywords": "human, soul, God, meditation, dhyan, satsang, baba jaigurudev, baba umakant, inner peace, power, prosperity, yog sadhna, spiritual awakening, moksha, liberation, vegetarian living, mindfulness, guided meditation, holistic wellness",
  "inLanguage": ["en", "hi"],
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["h1", "h2", ".bp-hero__title", ".bp-hero__subtitle"]
  }
};

export default function Home() {
  return (
    <>
      <SEO
        title="Inner Transformation for a Peaceful World | Baba Jaigurudev | Human to Soul"
        description="Discover dhyan meditation, vegetarian living, and spiritual awakening through the transformational teachings of Param Sant Baba Jaigurudev Ji Maharaj. Guided meditation, holistic wellness, inner peace, prophecies, and the path from Human to Soul. Trusted by millions worldwide."
        keywords="human, soul, God, mindfulness, guided meditation, guided meditation for anxiety, guided meditation for beginners, holistic wellness, holistic living, mental wellbeing, mental health, stress reduction, anxiety relief, breathwork, chakra healing, yoga nidra, sound healing, spiritual awakening, conscious living, mind body harmony, manifestation, meditation, dhyan, satsang, baba jaigurudev, baba umakant, jai gurudev, inner peace, power, prosperity, yog sadhna, yoga, sant mat, moksha, liberation, vegetarian living, satvic lifestyle, prophecy, how to find your spiritual path, affirmations for positive energy, spiritual retreat 2026, बाबा जयगुरुदेव, ध्यान, सत्संग, भविष्यवाणी, आंतरिक शांति, मोक्ष"
        url="https://www.humantosoul.com/"
        schema={homeSchema}
        breadcrumbs={[{ name: "Home", url: "https://www.humantosoul.com/" }]}
      />
      {/* BLUEPRINT SECTIONS: Hero, Why Inner Change, Three Pillars, Deeper Philosophy, CTA */}
      <BlueprintHomeSections />
      {/* EXISTING COMPONENTS — preserved for SEO + existing audience */}
      <Carousel />
      <HeroSection />

      {/* START HERE — Journey for new visitors */}
      <StartHere />
      {/* YOUTUBE SHORTS — below Ashram Tour */}
      <YouTubeFeed />
      <Testimonials />
    </>
  );
}

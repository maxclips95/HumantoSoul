import React from 'react';
import SantAndSantMat from '../components/AboutUs';
import SEO from '../components/common/SEO';

export default function AboutUsPage() {
    const aboutSchema = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "url": "https://www.humantosoul.com/about",
        "name": "About Human to Soul - Baba Jaigurudev Spiritual Mission & Sant Mat",
        "description": "Learn about the Human to Soul spiritual mission, Sant Mat path, satsang, and the teachings of Baba Jaigurudev and Baba Umakant Ji for world peace and soul awakening.",
        "publisher": { "@id": "https://www.humantosoul.com/#organization" },
        "inLanguage": ["en", "hi"]
    };
    return (
        <>
            <SEO
                title="About - Human to Soul Global Spiritual Mission | Holistic Wellness & Conscious Living"
                description="The Human to Soul spiritual mission — a trusted global community for mindfulness, holistic wellness, conscious living, and spiritual awakening through Sant Mat and the transformational teachings of Baba Jaigurudev Ji Maharaj. Join millions worldwide on the proven path to inner peace, mental wellbeing, and God-realization. मानव से आत्मा तक का दिव्य मिशन।"
                keywords="human to soul, sant mat, santmat, satsang, baba jaigurudev, baba umakant, jai gurudev, spiritual mission, holistic wellness, holistic living, conscious living, spiritual community, spiritual awakening, mindfulness, guided meditation, mental wellbeing, global wellness, trusted spiritual wisdom, transformational spirituality, online spiritual guidance, spiritual retreats 2026, how to find your spiritual path, meditation, dhyan, yog sadhna, inner peace, God, soul, atma, parmatma, power, prosperity, vegetarianism, non-violence, ahimsa, भक्ति, संतमत, सत्संग, आत्मा"
                url="https://www.humantosoul.com/about"
                schema={aboutSchema}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "About Us", url: "https://www.humantosoul.com/about" }
                ]}
            />
            <SantAndSantMat />
        </>
    );
}
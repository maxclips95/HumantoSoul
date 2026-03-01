import React from 'react';
import Prarthana from '../components/Prarthana';
import SEO from '../components/common/SEO';

export default function PrarthanaPage() {
    const prarthanaSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Prarthana - Prayer, Meditation & Bhajans | Baba Jaigurudev",
        "description": "Prarthana (prayers), bhajans, dhyan mantras, and meditation techniques from Baba Jaigurudev Mission for inner peace, God realization, and soul awakening.",
        "url": "https://www.humantosoul.com/prarthana",
        "author": { "@id": "https://www.humantosoul.com/#organization" },
        "publisher": { "@id": "https://www.humantosoul.com/#organization" },
        "about": {
            "@type": "Thing",
            "name": "Prayer, Meditation, Dhyan, Prarthana, God, Soul, Inner Peace"
        },
        "inLanguage": ["en", "hi"]
    };
    return (
        <>
            <SEO
                title="Prarthana - Guided Meditation, Sound Healing, Mindfulness & Breathwork | Baba Jaigurudev"
                description="Experience transformational Prarthana (prayer), guided meditation, sound healing, breathwork, and mindfulness practices from Baba Jaigurudev Mission. Proven techniques for anxiety relief, nervous system regulation, inner peace, chakra healing, and conscious living. Trusted by millions worldwide. Free for beginners. बाबा जयगुरुदेव — प्रार्थना, ध्यान, भजन।"
                keywords="prarthana, guided meditation, guided meditation for anxiety, guided meditation for beginners, sound healing, breathwork, mindfulness, mindfulness practice, chakra healing, energy healing, yoga nidra, affirmations for positive energy, affirmations for inner peace, manifestation, prayer, meditation, dhyan, bhajan, mantra, God, atma, parmatma, soul, inner peace, peace, power, prosperity, mind body harmony, conscious living, nervous system regulation, anxiety relief, stress reduction, mental wellbeing, spiritual awakening, yog sadhna, yoga, satsang, baba jaigurudev, jai gurudev, sant mat, devotion, bhakti, online meditation, free meditation guide, beginner meditation, holistic wellness, प्रार्थना, ध्यान, भजन, मंत्र, ईश्वर, आत्मा, भक्ति, आंतरिक शांति"
                url="https://www.humantosoul.com/prarthana"
                schema={prarthanaSchema}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Prarthana", url: "https://www.humantosoul.com/prarthana" }
                ]}
            />
            <Prarthana />
        </>
    );
}
import React from 'react';
import BabaJaigurudevComponent from '../components/BabaJaigurudev';
import SEO from '../components/common/SEO';

const babaJaigurudevSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "ProfilePage",
            "url": "https://www.humantosoul.com/baba-jaigurudev",
            "name": "Baba Jaigurudev Ji Maharaj - Life, Teachings, Satsang & Prophecies",
            "description": "Complete biography and divine teachings of Param Sant Baba Jaigurudev Ji Maharaj — spiritual master, prophet, and awakener of souls.",
            "mainEntity": {
                "@id": "https://www.humantosoul.com/baba-jaigurudev#person"
            }
        },
        {
            "@type": "Person",
            "@id": "https://www.humantosoul.com/baba-jaigurudev#person",
            "name": "Baba Jaigurudev",
            "alternateName": [
                "Param Sant Baba Jaigurudev Ji Maharaj",
                "Tulsidas Ji Maharaj",
                "Jai Gurudev",
                "जयगुरुदेव",
                "बाबा जयगुरुदेव",
                "Jai Guru Dev"
            ],
            "description": "Param Sant Baba Jaigurudev Ji Maharaj is a revered spiritual master from Mathura, India. The awakener of souls, preacher of vegetarianism, non-violence, meditation (dhyan), satsang, yog sadhna, and the Sant Mat path. Known globally for accurate prophecies and divine guidance toward God-realization, inner peace, power, and prosperity.",
            "jobTitle": "Param Sant Spiritual Master",
            "nationality": "Indian",
            "birthPlace": {
                "@type": "Place",
                "name": "Uttar Pradesh, India"
            },
            "url": "https://www.humantosoul.com/baba-jaigurudev",
            "image": "https://www.humantosoul.com/assets/images/baba-jaigurudev.jpg",
            "knowsAbout": [
                "Meditation", "Dhyan", "Satsang", "Sant Mat", "Vegetarianism",
                "Yog Sadhna", "Prophecy", "Soul Awakening", "God", "Inner Peace",
                "Power", "Prosperity", "Soul", "Human", "Prarthana", "Bhakti"
            ],
            "affiliation": {
                "@type": "Organization",
                "name": "Jai Gurudev Spiritual Mission",
                "url": "https://www.humantosoul.com"
            },
            "sameAs": [
                "https://www.facebook.com/BabaJaiGurudev",
                "https://www.youtube.com/jaigurudevukm"
            ]
        },
        {
            "@type": "Article",
            "headline": "Param Sant Baba Jaigurudev Ji Maharaj - The Awakener of Souls",
            "description": "Biography and divine teachings of Baba Jaigurudev: meditation, satsang, yog sadhna, prophecies, and the path from Human to Soul.",
            "url": "https://www.humantosoul.com/baba-jaigurudev",
            "author": { "@id": "https://www.humantosoul.com/#organization" },
            "publisher": { "@id": "https://www.humantosoul.com/#organization" },
            "about": { "@id": "https://www.humantosoul.com/baba-jaigurudev#person" },
            "keywords": "Baba Jaigurudev, Jai Gurudev, Satsang, Meditation, Dhyan, Yog Sadhna, Prophecy, Sant Mat, Soul, God"
        }
    ]
};

function BabaJaigurudev() {
    return (
        <>
            <SEO
                title="Baba Jaigurudev - Spiritual Awakening, Guided Meditation & Holistic Wellness | Human to Soul"
                description="Discover the transformational life and teachings of Param Sant Baba Jaigurudev Ji Maharaj — India's most trusted spiritual master for mindfulness, guided meditation, spiritual awakening, holistic wellness, and prophecies. Millions worldwide have found inner peace, mental wellbeing, and conscious living through his proven teachings. Free beginner's guide. बाबा जयगुरुदेव — सत्संग, ध्यान, भविष्यवाणी।"
                keywords="baba jaigurudev, jai gurudev, jaigurudev, param sant, tulsidas ji maharaj, spiritual awakening, spiritual master, guided meditation, mindfulness, holistic wellness, holistic living, mental wellbeing, inner peace, peace, power, prosperity, consciousness, higher self, third eye, self realization, God realization, mind body harmony, transformational spirituality, trusted spiritual wisdom, online spiritual guidance, satsang, meditation, dhyan, yog sadhna, yoga, sant mat, santmat, vegetarianism, prophecy, prophecies, God, soul, atma, parmatma, chakra healing, energy healing, manifestation, law of attraction, affirmations, spiritual community, ujjain ashram, 2026 predictions, how to find your spiritual path, बाबा जयगुरुदेव, जयगुरुदेव, सत्संग, ध्यान, योग साधना, भविष्यवाणी, आत्मा"
                url="https://www.humantosoul.com/baba-jaigurudev"
                schema={babaJaigurudevSchema}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Baba Jaigurudev", url: "https://www.humantosoul.com/baba-jaigurudev" }
                ]}
            />
            <BabaJaigurudevComponent />
        </>
    );
}

export default BabaJaigurudev;
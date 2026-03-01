import React from 'react';
import BabaUmakantComponent from '../components/BabaUmakant';
import SEO from '../components/common/SEO';

const babaUmakantSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "ProfilePage",
            "url": "https://www.humantosoul.com/baba-umakant",
            "name": "Baba Umakant Ji Maharaj - Spiritual Successor, Prophecies & Teachings",
            "description": "Biography and divine teachings of Swami Umakant Ji Maharaj — prophecies, satsang, dhyan, and guidance for inner peace and God-realization.",
            "mainEntity": { "@id": "https://www.humantosoul.com/baba-umakant#person" }
        },
        {
            "@type": "Person",
            "@id": "https://www.humantosoul.com/baba-umakant#person",
            "name": "Baba Umakant",
            "alternateName": [
                "Swami Umakant Ji Maharaj",
                "बाबा उमाकांत",
                "उमाकांत जी महाराज",
                "Umakant Maharaj"
            ],
            "description": "Swami Umakant Ji Maharaj — the spiritual successor carrying forward the divine mission of Baba Jaigurudev. Renowned for prophecies (भविष्यवाणियाँ), satsang, dhyan (meditation), yog sadhna, and guiding millions toward God-realization, inner peace, power, and prosperity.",
            "jobTitle": "Spiritual Master and Successor",
            "nationality": "Indian",
            "url": "https://www.humantosoul.com/baba-umakant",
            "image": "https://www.humantosoul.com/assets/images/baba-umakant.jpg",
            "knowsAbout": [
                "Prophecy", "Dhyan", "Meditation", "Satsang", "Soul Awakening",
                "God", "Inner Peace", "Power", "Prosperity", "Yog Sadhna",
                "Sant Mat", "Human to Soul"
            ],
            "affiliation": {
                "@type": "Organization",
                "name": "Jai Gurudev Spiritual Mission",
                "url": "https://www.humantosoul.com"
            }
        },
        {
            "@type": "Article",
            "headline": "Swami Umakant Ji Maharaj - Prophecies, Satsang & Spiritual Guidance",
            "description": "Teachings of Baba Umakant Ji — prophecies, dhyan, satsang, and the path to inner peace, power, and prosperity.",
            "url": "https://www.humantosoul.com/baba-umakant",
            "author": { "@id": "https://www.humantosoul.com/#organization" },
            "publisher": { "@id": "https://www.humantosoul.com/#organization" },
            "about": { "@id": "https://www.humantosoul.com/baba-umakant#person" },
            "keywords": "Baba Umakant, Swami Umakant Ji, Prophecy, Meditation, Dhyan, Satsang, Inner Peace, God, Soul"
        }
    ]
};

function BabaUmakant() {
    return (
        <>
            <SEO
                title="Baba Umakant Ji Maharaj - Prophecies, Satsang, Dhyan & Spiritual Teachings"
                description="Discover the divine prophecies and spiritual teachings of Swami Umakant Ji Maharaj — successor of Baba Jaigurudev. Satsang, dhyan (meditation), yog sadhna, and the path to God, soul awakening, inner peace, power, and prosperity. बाबा उमाकांत जी महाराज की भविष्यवाणियाँ, सत्संग, और ध्यान।"
                keywords="baba umakant, swami umakant ji, umakant maharaj, prophecy, prophecies, meditation, dhyan, satsang, yog sadhna, yoga, inner peace, power, prosperity, God, soul, atma, parmatma, spiritual master, spiritual awakening, sant mat, santmat, baba jaigurudev, jai gurudev, 2026 predictions, human to soul, बाबा उमाकांत, उमाकांत जी महाराज, भविष्यवाणी, ध्यान, सत्संग, आंतरिक शांति"
                url="https://www.humantosoul.com/baba-umakant"
                schema={babaUmakantSchema}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Baba Umakant", url: "https://www.humantosoul.com/baba-umakant" }
                ]}
            />
            <BabaUmakantComponent />
        </>
    );
}

export default BabaUmakant;
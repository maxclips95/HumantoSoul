import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import '../styles/ContentPage.css';
import './GlossaryPage.css';

const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Sant Mat Spiritual Glossary — Human to Soul",
    "description": "Definitions of Sant Mat and spiritual terms as taught by Param Sant Baba Jaigurudev Ji Maharaj and Swami Umakant Ji Maharaj.",
    "url": "https://www.humantosoul.com/glossary",
    "author": { "@id": "https://www.humantosoul.com/#organization" },
    "inLanguage": ["en", "hi"]
};

const terms = [
    {
        term: 'Atma (आत्मा)',
        english: 'Soul',
        definition: 'The eternal, indestructible soul that resides within every living being. The Atma is a fragment of the Supreme God (Parmatma). It is conscious, blissful, and immortal by nature, but has forgotten its true identity due to entanglement in the material world (Maya).',
        quote: '"The soul is not the body. The body is like a garment worn by the soul. Just as we change clothes, the soul changes bodies."',
        category: 'Core Concepts',
    },
    {
        term: 'Parmatma (परमात्मा)',
        english: 'The Supreme God / Supreme Soul',
        definition: 'The highest, infinite, and formless Supreme Being from whom all creation originates. As taught by Baba Jaigurudev, the Parmatma resides in Satlok — the eternal realm of truth — and every soul (Atma) yearns to reunite with Him.',
        quote: '"The purpose of human birth is to realize the Parmatma — the Supreme Father — and return to Him."',
        category: 'Core Concepts',
    },
    {
        term: 'Dhyan (ध्यान)',
        english: 'Meditation',
        definition: 'The practice of turning the soul\'s complete attention inward to experience the divine. In Sant Mat, Dhyan is not mere relaxation or visualization — it is the direct method (Surat Shabd Yoga) of the soul ascending through inner spiritual realms toward God.',
        quote: '"Without Dhyan, the soul cannot progress. As long as the mind wanders outside, God will not be found."',
        category: 'Practice',
    },
    {
        term: 'Surat Shabd Yoga (सुरत शब्द योग)',
        english: 'Union of the Soul with the Divine Sound',
        definition: '"Surat" is the soul\'s attention; "Shabd" is the divine Sound or Word of God that permeates all creation. This is the specific meditation method taught in Sant Mat — focusing the soul\'s attention on the inner divine Sound to travel to God\'s eternal realm (Satlok).',
        quote: '"All saints have taught the path of Surat Shabd Yoga. There is no other method greater than this."',
        category: 'Practice',
    },
    {
        term: 'Satsang (सत्संग)',
        english: 'Company of Truth / Spiritual Congregation',
        definition: '"Sat" means Truth, "Sang" means company. Satsang is the gathering of souls to listen to divine wisdom, sing God\'s name (bhajans), and receive the teachings of a Sant. As Baba Ji taught — regular Satsang is the medicine for the soul.',
        quote: '"Satsang is that which speaks the truth, hears the truth, and leads toward the truth."',
        category: 'Practice',
    },
    {
        term: 'Naamdaan (नामदान)',
        english: 'Spiritual Initiation / Gift of the Divine Name',
        definition: 'The sacred act by which a living Sant Satguru initiates a seeker into the practice of Surat Shabd Yoga. Naamdaan is given completely free of charge. Currently, Swami Umakant Ji Maharaj grants Naamdaan to all sincere seekers who fulfill the prerequisites (vegetarian diet, no intoxicants).',
        category: 'Practice',
    },
    {
        term: 'Satlok (सतलोक)',
        english: 'The True Home / Eternal Realm of God',
        definition: 'The eternal abode of God (Parmatma) and the original home of all souls. Satlok is a realm of infinite light, infinite bliss, and infinite duration. A soul that reaches Satlok through the practice of Surat Shabd Yoga is freed permanently from the cycle of birth and death.',
        quote: '"In Satlok, life exists beyond breath — limitless, eternal, and full of divine bliss. A soul there becomes as powerful as God Himself."',
        category: 'Spiritual Geography',
    },
    {
        term: 'Kaliyug (कलियुग)',
        english: 'The Age of Darkness / Iron Age',
        definition: 'The current cosmic era (yug), characterized by spiritual decline, materialism, ego, violence, and increasing natural disasters. According to Baba Jaigurudev\'s teachings, we are now in the final, most intense phase of Kaliyug — only a few years remain before the great Yug Parivartan (change of age). This is the most urgent time for spiritual practice.',
        category: 'Cosmic Time',
    },
    {
        term: 'Satyug (सत्युग)',
        english: 'The Age of Truth / Golden Age',
        definition: 'The divine era of truth and righteousness that is now approaching, as spoken by Baba Jaigurudev Ji Maharaj. After the great Yug Parivartan (Change of Time), there will be a period of peace, truth, and spiritual upliftment for humanity. Those who follow a satvic, pure, and spiritually devoted way of life will experience this new era.',
        category: 'Cosmic Time',
    },
    {
        term: 'Yug Parivartan (युग परिवर्तन)',
        english: 'Change of Time',
        definition: 'The imminent divine Change of Time, as prophesied by Baba Jaigurudev Ji Maharaj. We are currently in the final, most turbulent stage of Kaliyug. This transition will involve great upheaval — natural disasters, wars, epidemics — before a new era of truth and peace begins. As said by Baba Jaigurudev and Baba Umakant Ji Maharaj, very little time remains. Those living a pure, vegetarian, and spiritually devoted life will be protected during this transition.',
        category: 'Cosmic Time',
    },
    {
        term: 'Bhavishyavani (भविष्यवाणी)',
        english: 'Prophecy / Divine Prediction',
        definition: 'A divine prophecy or prediction. Baba Jaigurudev Ji Maharaj made hundreds of Bhavishyavanis — about world events, natural calamities, political changes, and the coming of Satyug — many of which have already been fulfilled. These divine prophecies are warnings and guidance for humanity.',
        category: 'Core Concepts',
    },
    {
        term: 'Sant Mat (सन्त मत)',
        english: 'Path of the Saints',
        definition: '"Sant" means Saint; "Mat" means path or belief. Sant Mat is the complete spiritual philosophy and practice taught by the lineage of Sants — from Jogjeet (Kabir Das Ji) through Baba Jaigurudev Ji Maharaj. It emphasizes inner meditation (Surat Shabd Yoga), vegetarianism, non-violence, and service to humanity.',
        category: 'Philosophy',
    },
    {
        term: 'Maya (माया)',
        english: 'Illusion / Material World Attachment',
        definition: 'The cosmic illusion that keeps souls bound to the material world and trapped in the cycle of birth and death. Maya includes attachment to wealth, relationships, ego, and the physical world. Baba Ji taught that only Surat Shabd Yoga can free the soul from Maya\'s grip.',
        category: 'Philosophy',
    },
    {
        term: 'Mukti / Moksha (मुक्ति / मोक्ष)',
        english: 'Liberation / Freedom from the cycle of birth & death',
        definition: 'The ultimate goal of human birth — the permanent liberation of the soul from the endless cycle of birth, death, and rebirth (reincarnation). In Sant Mat, Mukti is achieved by the soul reaching Satlok through the practice of Surat Shabd Yoga under the guidance of a living Sant Satguru.',
        category: 'Core Concepts',
    },
    {
        term: 'Satvic (सात्विक)',
        english: 'Pure / Spiritually Clean',
        definition: 'Relating to the quality of purity. In terms of food, Satvic refers to a pure vegetarian diet (no meat, eggs, fish, onion, garlic) that does not harm any living being and purifies the mind and soul. In terms of lifestyle, it refers to a clean, simple, and spiritually focused way of life.',
        category: 'Lifestyle',
    },
    {
        term: 'Karma (कर्म)',
        english: 'Action / The Law of Cause and Effect',
        definition: 'The universal law by which every action — good or bad — creates an equal and opposite result. The soul carries accumulated Karma across lifetimes. Baba Ji taught that Surat Shabd Yoga and God\'s grace are the only means to cleanse accumulated Karma and free the soul.',
        category: 'Philosophy',
    },
];

const CATEGORIES = ['All', 'Core Concepts', 'Practice', 'Spiritual Geography', 'Cosmic Time', 'Philosophy', 'Lifestyle'];

export default function GlossaryPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = terms.filter(t => {
        const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
        const matchesSearch = !searchTerm ||
            t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.definition.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <SEO
                title="Sant Mat Spiritual Glossary — Atma, Dhyan, Satsang, Satlok | Human to Soul"
                description="A complete spiritual glossary of Sant Mat terms as taught by Param Sant Baba Jaigurudev Ji Maharaj. Definitions of Atma, Parmatma, Dhyan, Surat Shabd Yoga, Satlok, Satsang, Naamdaan, Kaliyug, Satyug, Maya, Moksha, and more."
                keywords="sant mat glossary, spiritual glossary, atma meaning, parmatma meaning, dhyan meaning, surat shabd yoga, satlok, satsang, naamdaan, kaliyug satyug, yug parivartan, mukti, moksha, maya, karma, satvic, baba jaigurudev, baba umakant, spiritual terms"
                url="https://www.humantosoul.com/glossary"
                schema={glossarySchema}
                breadcrumbs={[
                    { name: 'Home', url: 'https://www.humantosoul.com/' },
                    { name: 'Spiritual Glossary', url: 'https://www.humantosoul.com/glossary' },
                ]}
            />

            <article className="content-page">
                {/* HERO */}
                <div className="content-hero" style={{ background: 'linear-gradient(135deg, #4a0000, #c41e3a)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ color: '#f0c030', fontWeight: '600', marginBottom: '12px' }}>Sant Mat & Spiritual Teachings</p>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Georgia, serif', marginBottom: '16px', lineHeight: 1.2 }}>
                            Spiritual Glossary
                        </h1>
                        <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: 1.8, marginBottom: '24px' }}>
                            आध्यात्मिक शब्दकोश — Definitions of key Sant Mat and spiritual terms as taught by Param Sant Baba Jaigurudev Ji Maharaj
                        </p>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="🔍 Search terms... (e.g., Atma, Satsang, Satlok)"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="glossary-search"
                        />
                    </div>
                </div>

                <div className="content-body">
                    {/* Category Filter */}
                    <div className="glossary-filters">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`glossary-filter-btn ${activeCategory === cat ? 'glossary-filter-btn--active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Terms Grid */}
                    <div className="glossary-grid">
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#888' }}>
                                No terms found. Try a different search.
                            </div>
                        )}
                        {filtered.map((item, i) => (
                            <div key={i} className="glossary-card">
                                <div className="glossary-card-header">
                                    <h2 className="glossary-term">{item.term}</h2>
                                    <span className="glossary-english">{item.english}</span>
                                    <span className="glossary-category-badge">{item.category}</span>
                                </div>
                                <p className="glossary-definition">{item.definition}</p>
                                {item.quote && (
                                    <blockquote className="glossary-quote">
                                        {item.quote}
                                    </blockquote>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <section className="content-cta" style={{ marginTop: '40px' }}>
                        <h2>Ready to Walk the Path?</h2>
                        <p>Understanding these terms is just the beginning. The real transformation happens through practice.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            <a href="/meditation" className="bp-btn bp-btn--primary">Learn Dhyan Meditation 🙏</a>
                            <a href="/prophecies" className="bp-btn bp-btn--outline">Watch Satsang Videos →</a>
                        </div>
                    </section>
                </div>
            </article>
        </>
    );
}

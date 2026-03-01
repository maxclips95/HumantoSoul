import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles/ContentPage.css';

const peaceSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Inner Peace and Social Harmony — Teachings of Baba Jaigurudev Ji Maharaj",
    "description": "Baba Jaigurudev Ji taught that lasting peace in society begins with inner transformation. Through dhyan, vegetarianism, and ethical living, individuals and nations can achieve true harmony.",
    "url": "https://www.humantosoul.com/peace-and-society",
    "author": { "@id": "https://www.humantosoul.com/#organization" },
    "publisher": { "@id": "https://www.humantosoul.com/#organization" },
    "keywords": "inner peace, social harmony, peace, anger, stress, baba jaigurudev, sant mat, satya yug, non-violence, vegetarian society, meditation peace, conflict resolution",
    "inLanguage": ["en", "hi"]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How did Baba Jaigurudev teach people to find inner peace?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Baba Jaigurudev Ji Maharaj taught that inner peace comes from dhyan (meditation), vegetarian living, freedom from intoxication, and satsang (spiritual gathering). By following these disciplines, millions of his disciples became moral, hardworking, honest, and disciplined individuals — transforming both their personal lives and their communities."
            }
        },
        {
            "@type": "Question",
            "name": "What is Satya Yug and how does Baba Umakant Ji's mission connect to it?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Satya Yug (the Age of Truth) is the coming golden age of purity, peace, and virtue on Earth. Baba Umakant Ji Maharaj is engaged in establishing Satya Yug by guiding people toward vegetarianism, non-violence, and spiritual practice — stopping cow slaughter, human violence, and intoxication as steps toward this transformation."
            }
        }
    ]
};

export default function PeaceAndSocietyPage() {
    return (
        <>
            <SEO
                title="Inner Peace & Social Harmony — Teachings of Baba Jaigurudev Ji Maharaj"
                description="Baba Jaigurudev Ji Maharaj taught that lasting peace in society begins with inner transformation. Through dhyan (meditation), vegetarianism, non-violence, and ethical living — individuals and nations achieve true harmony. Learn about the mission for Satya Yug."
                keywords="inner peace, social harmony, peace, anger, stress relief, baba jaigurudev, sant mat, satya yug, non-violence, vegetarian society, meditation peace, conflict resolution, how to find peace, सत्य युग, आंतरिक शांति, अहिंसा"
                url="https://www.humantosoul.com/peace-and-society"
                schema={[peaceSchema, faqSchema]}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Peace & Society", url: "https://www.humantosoul.com/peace-and-society" }
                ]}
            />

            <article className="content-page">

                {/* HERO */}
                <div style={{ background: 'linear-gradient(135deg, #003366, #0066cc)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ color: '#90caf9', fontWeight: '600', marginBottom: '12px', fontSize: '1rem' }}>As Taught by Param Sant Baba Jaigurudev Ji Maharaj</p>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Georgia, serif', marginBottom: '20px', lineHeight: 1.2 }}>
                            Inner Peace & Social Harmony
                        </h1>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.9 }}>
                            Baba Jaigurudev Ji transformed tens of millions into peaceful, moral individuals. His mission — continued by Baba Umakant Ji — works toward establishing Satya Yug: a golden age of truth, non-violence, and harmony on Earth.
                        </p>
                    </div>
                </div>

                <div className="content-body">

                    {/* SECTION 1: The Mission's Impact */}
                    <section className="content-section">
                        <h2>The Transformation of Millions</h2>
                        <p>
                            By 1971, Param Sant Baba Jaigurudev Ji Maharaj had over <strong>ten crore (100 million) disciples</strong>. He spread the message of vegetarianism and freedom from intoxication across India, transforming millions of people into <strong>moral, hardworking, honest, and disciplined individuals.</strong>
                        </p>
                        <p>
                            This was not merely personal spiritual improvement — it was a social transformation. Society becomes peaceful when its individuals are peaceful. Baba Jaigurudev Ji guided millions on the path of God-realization and devotion, relieving their suffering and showing them the way to happiness.
                        </p>
                        <p>
                            He also established the power of chanting <strong>"Jaigurudev"</strong> — declaring that chanting this name removes difficulties and reduces suffering at the time of death.
                        </p>
                    </section>

                    {/* SECTION 2: Root of Conflict */}
                    <section className="content-section content-section--shaded">
                        <h2>The Root Cause of Social Conflict</h2>
                        <p>
                            Sant Mat teaches that the root of all external conflict lies within the untrained, impure mind. A mind disturbed by anger, ego, desires, and worldly attachments cannot relate to others with peace and compassion.
                        </p>
                        <p>
                            Without inner discipline, conflict continues — individually and collectively. True and lasting social harmony requires individuals who have transformed from within through:
                        </p>
                        <div className="info-box">
                            <h3>The Three Disciplines of Inner Peace — as taught by Baba Jaigurudev Ji:</h3>
                            <ul>
                                <li><strong>Dhyan (Meditation):</strong> Turning the mind inward to connect with God, calming the restless mind and developing clarity and compassion</li>
                                <li><strong>Vegetarian Living:</strong> Non-violence toward all living beings — reducing anger, purifying the mind, and developing empathy</li>
                                <li><strong>Satsang (Spiritual Gathering):</strong> Regular association with divine teachings to reinforce values, discipline, and purpose</li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 3: The Human Body as Temple */}
                    <section className="content-section">
                        <h2>The Human Body — The Real Temple of Peace</h2>
                        <p>
                            One of the most profound societal teachings of Baba Umakant Ji Maharaj is that external religious divisions — temples, mosques, churches, gurudwaras — are not the source of true peace.
                        </p>
                        <p>
                            As he teaches: <em>"The human body itself is the true temple, mosque, church, and gurudwara, within which the divine vision of God can be attained."</em>
                        </p>
                        <p>
                            When individuals recognize this truth, the basis for religious conflict disappears. All human beings contain the same soul. All souls belong to the same God. The path of Surat Shabd Yoga is for every human being, regardless of their background.
                        </p>
                        <blockquote className="spiritual-quote">
                            "God did not create any caste or religion. He only created human beings. Therefore, the path of saints is for all of humanity."
                            <cite>— Baba Umakant Ji Maharaj</cite>
                        </blockquote>
                    </section>

                    {/* SECTION 4: Satya Yug Mission */}
                    <section className="content-section content-section--shaded">
                        <h2>The Mission for Satya Yug — The Age of Truth</h2>
                        <p>
                            Baba Umakant Ji Maharaj remains constantly engaged in fulfilling his Guru's mission: <strong>to establish Satya Yug on this earth</strong>.
                        </p>
                        <p>
                            This means working toward:
                        </p>
                        <div className="info-box info-box--important">
                            <h3>Baba Umakant Ji's active social mission includes:</h3>
                            <ul>
                                <li>Stopping cow slaughter and the killing of animals and birds</li>
                                <li>Ending human violence and conflict</li>
                                <li>Making people virtuous, vegetarian, and free from intoxication</li>
                                <li>Guiding people to live hardworking, moral, honest, and patriotic lives</li>
                                <li>Granting Naamdaan to connect souls with the divine path</li>
                            </ul>
                        </div>
                        <p>
                            Through the practice of Naamdaan given by Baba Umakant Ji Maharaj, millions are experiencing both worldly and spiritual benefits, leading them toward inner peace and ultimate liberation.
                        </p>
                    </section>

                    {/* FAQ */}
                    <section className="content-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>How did Baba Jaigurudev bring peace to millions?</h3>
                                <p>By 1971, Baba Jaigurudev had over 10 crore disciples. He transformed millions into vegetarians, freed them from intoxication, and guided them toward honest, disciplined, moral lives through satsang, dhyan, and Naamdaan. Communities of his devotees became examples of peaceful, harmonious living.</p>
                            </div>
                            <div className="faq-item">
                                <h3>What is Satya Yug?</h3>
                                <p>Satya Yug (the Age of Truth / Golden Age) is the coming era of truth, virtue, non-violence, and divine order on Earth. Baba Umakant Ji Maharaj actively works toward establishing this age through his social and spiritual mission.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Is spiritual practice connected to social peace?</h3>
                                <p>Yes — directly. Baba Jaigurudev Ji taught that inner transformation through dhyan, vegetarianism, and ethical living changes how individuals relate to others, reducing conflict, violence, and suffering in society as a whole.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="content-cta" style={{ background: 'linear-gradient(135deg, #003366, #0066cc)' }}>
                        <h2>Discover the Path to Inner Peace</h2>
                        <p>Learn how dhyan (meditation) as taught by Baba Jaigurudev Ji brings lasting peace within — and how that inner peace transforms the world.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            <Link to="/meditation" className="bp-btn bp-btn--primary">Begin Dhyan Meditation 🧘</Link>
                            <Link to="/baba-umakant" className="bp-btn bp-btn--outline" style={{ color: '#fff', borderColor: '#fff' }}>About Baba Umakant Ji →</Link>
                        </div>
                    </section>

                </div>
            </article>
        </>
    );
}

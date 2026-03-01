import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles/ContentPage.css';

const vegSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Vegetarian Living — Why Baba Jaigurudev Taught Non-Violence and Pure Diet",
    "description": "Baba Jaigurudev Ji Maharaj taught that vegetarianism and non-violence (ahimsa) purify the mind, body, and soul — essential for those on the Sant Mat path to God-realization. Learn the spiritual basis of vegetarian living.",
    "url": "https://www.humantosoul.com/vegetarian-living",
    "author": { "@id": "https://www.humantosoul.com/#organization" },
    "publisher": { "@id": "https://www.humantosoul.com/#organization" },
    "keywords": "vegetarian, vegetarianism, non-violence, ahimsa, sant mat, baba jaigurudev, satvic diet, spiritual health, soul, God, inner peace",
    "inLanguage": ["en", "hi"]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "Why did Baba Jaigurudev teach vegetarianism?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Baba Jaigurudev Ji Maharaj taught vegetarianism as an inseparable part of the Sant Mat path. He taught that consuming non-vegetarian food creates karmic bonds and impurities in the mind that make it impossible to practice meditation (dhyan) and attain God-realization. By 1971, his message had transformed millions into vegetarians."
            }
        },
        {
            "@type": "Question",
            "name": "Is vegetarianism required to take Naamdaan?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. As stated by Baba Umakant Ji Maharaj: To take Naamdaan (spiritual initiation), it is essential to completely give up non-vegetarian food — eggs, fish, and meat — and all intoxicants. One should follow a pure, sattvic vegetarian diet. This is a non-negotiable prerequisite on the Sant Mat path."
            }
        },
        {
            "@type": "Question",
            "name": "What is the connection between vegetarianism and soul liberation?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "In Sant Mat, the soul's journey to Satlok (eternal liberation) requires a purified mind. Consuming non-vegetarian food involves taking the life of other living beings, creating negative karma and imprints on the mind that block dhyan (meditation) and inner progress. A pure vegetarian diet supports the mental purity necessary for Surat Shabd Yoga."
            }
        }
    ]
};

export default function VegetarianLivingPage() {
    return (
        <>
            <SEO
                title="Vegetarian Living — Baba Jaigurudev's Teaching on Non-Violence & Pure Diet"
                description="Baba Jaigurudev Ji Maharaj taught that vegetarianism and non-violence (ahimsa) are essential on the Sant Mat path. Learn the spiritual basis of vegetarian living for soul purification, inner peace, and God-realization as taught by the mission."
                keywords="vegetarian, vegetarianism, non-violence, ahimsa, sant mat, baba jaigurudev, baba umakant, satvic diet, satvic lifestyle, soul, God, inner peace, spiritual health, intoxication free, pure living, vegetarian diet benefits, spiritual vegetarianism, शाकाहार, अहिंसा"
                url="https://www.humantosoul.com/vegetarian-living"
                schema={[vegSchema, faqSchema]}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Vegetarian Living", url: "https://www.humantosoul.com/vegetarian-living" }
                ]}
            />

            <article className="content-page">

                {/* HERO */}
                <div style={{ background: 'linear-gradient(135deg, #1a4a0a, #2d7a1f)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ color: '#a8e890', fontWeight: '600', marginBottom: '12px', fontSize: '1rem' }}>As Taught by Param Sant Baba Jaigurudev Ji Maharaj</p>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Georgia, serif', marginBottom: '20px', lineHeight: 1.2 }}>
                            Vegetarian Living & Non-Violence (Ahimsa)
                        </h1>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.9 }}>
                            Baba Jaigurudev Ji Maharaj transformed millions into vegetarians — not merely for health, but as the path to spiritual purity, inner peace, and God-realization.
                        </p>
                    </div>
                </div>

                <div className="content-body">

                    {/* SECTION 1: Baba Ji's Core Teaching */}
                    <section className="content-section">
                        <h2>Baba Jaigurudev's Message of Vegetarianism</h2>
                        <p>
                            Among the most powerful social transformations brought by Param Sant Baba Jaigurudev Ji Maharaj was the spread of vegetarianism and freedom from intoxication. By 1971, he had over <strong>ten crore (100 million) disciples</strong>, and he had transformed millions of them into moral, hardworking, honest, and disciplined individuals who lived a vegetarian, intoxication-free life.
                        </p>
                        <p>
                            This was not mere dietary advice. In the Sant Mat tradition, vegetarianism is an inseparable spiritual discipline — a prerequisite for anyone walking the path from Human to Soul.
                        </p>
                        <blockquote className="spiritual-quote">
                            "Freedom from the cycle of birth and death is possible only through true devotion and meditation."
                            <cite>— Baba Umakant Ji Maharaj</cite>
                        </blockquote>
                        <p>
                            True devotion and meditation require a purified mind. Consuming non-vegetarian food creates karmic bonds that obstruct the soul's inner journey.
                        </p>
                    </section>

                    {/* SECTION 2: Spiritual Basis */}
                    <section className="content-section content-section--shaded">
                        <h2>The Spiritual Basis of Non-Violence</h2>
                        <p>
                            In Sant Mat, all living beings — humans, animals, birds, and other creatures — are souls passing through the cycle of 84 lakh (8,400,000) life forms. The soul you were in a previous birth may have been an animal. Every being has an atma (soul) that belongs to God.
                        </p>
                        <p>
                            Baba Jaigurudev Ji was deeply disturbed even in his youth by violence toward animals. During his search for God, when he witnessed a goat being slaughtered near a mosque, it disturbed him deeply and confirmed his commitment to the path of non-violence.
                        </p>
                        <p>
                            Baba Umakant Ji Maharaj continues this mission today — working to <strong>stop cow slaughter, human violence, and the killing of animals and birds</strong> as part of establishing Satya Yug (the Age of Truth) on Earth.
                        </p>
                        <div className="info-box">
                            <h3>What vegetarianism means in Sant Mat:</h3>
                            <ul>
                                <li>Completely giving up non-vegetarian food — meat, fish, and eggs</li>
                                <li>Giving up all intoxicants — alcohol, beedi, cigarettes, tobacco</li>
                                <li>Following a pure, sattvic diet that supports meditation and inner clarity</li>
                                <li>Living without causing harm to other living beings (ahimsa)</li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 3: Naamdaan Requirement */}
                    <section className="content-section">
                        <h2>A Requirement for Naamdaan (Spiritual Initiation)</h2>
                        <p>
                            The connection between vegetarianism and spiritual practice is not optional on this path. As established by Baba Umakant Ji Maharaj, anyone seeking Naamdaan (initiation into Surat Shabd Yoga) must:
                        </p>
                        <div className="info-box info-box--important">
                            <h3>Prerequisites for Naamdaan:</h3>
                            <ul>
                                <li>Completely give up non-vegetarian food (eggs, fish, meat)</li>
                                <li>Completely give up all intoxicants (alcohol, beedi, cigarettes, tobacco, etc.)</li>
                                <li>Follow a pure, sattvic vegetarian diet</li>
                            </ul>
                        </div>
                        <p>
                            This is because the practice of Surat Shabd Yoga (dhyan) requires a purified mind. A mind disturbed by the karma of violence or clouded by intoxicants cannot turn inward effectively to experience the soul.
                        </p>
                    </section>

                    {/* SECTION 4: Ongoing Mission */}
                    <section className="content-section content-section--shaded">
                        <h2>Baba Umakant Ji's Ongoing Mission</h2>
                        <p>
                            Following in his Guru's footsteps, <strong>Baba Umakant Ji Maharaj</strong> travels extensively throughout India and abroad, guiding people to live a vegetarian, intoxication-free, hardworking, moral, and patriotic life.
                        </p>
                        <p>
                            He remains engaged in fulfilling Baba Jaigurudev Ji's mission: to establish Satya Yug on this earth, to stop cow slaughter and the killing of animals and birds, and to uplift souls by making people virtuous, vegetarian, and free from intoxication.
                        </p>
                        <p>
                            <Link to="/satvic-lifestyle" style={{ color: '#2d7a1f', fontWeight: '700' }}>Explore the Satvic Lifestyle in detail →</Link>
                        </p>
                    </section>

                    {/* FAQ */}
                    <section className="content-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>Is vegetarianism required to take Naamdaan?</h3>
                                <p>Yes. As stated by Baba Umakant Ji Maharaj: <em>"To take Naamdaan, it is essential to completely give up non-vegetarian food (eggs, fish, meat) and intoxicants. One should follow a pure, sattvic vegetarian diet."</em></p>
                            </div>
                            <div className="faq-item">
                                <h3>Why did Baba Jaigurudev oppose violence toward animals?</h3>
                                <p>From a young age, Baba Jaigurudev Ji was disturbed by violence toward living beings. The Sant Mat teaching is that all living beings — from humans to animals — carry the soul (atma) of God. Killing them for food creates negative karma that blocks spiritual progress.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="content-cta" style={{ background: 'linear-gradient(135deg, #1a4a0a, #2d7a1f)' }}>
                        <h2>Live the Satvic Life</h2>
                        <p>Explore the full Satvic lifestyle — vegetarianism, non-violence, and spiritual discipline — as practiced by millions of Baba Jaigurudev's devotees.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            <Link to="/satvic-lifestyle" className="bp-btn bp-btn--primary">Satvic Lifestyle 🌿</Link>
                            <Link to="/meditation" className="bp-btn bp-btn--outline" style={{ color: '#fff', borderColor: '#fff' }}>Learn Dhyan Meditation →</Link>
                        </div>
                    </section>

                </div>
            </article>
        </>
    );
}

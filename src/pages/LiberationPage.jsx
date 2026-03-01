import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles/ContentPage.css';

const liberationSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is Liberation (Moksha)? Freedom from Birth and Death — Baba Jaigurudev's Teachings",
    "description": "Baba Jaigurudev Ji Maharaj taught the path to Moksha — liberation from the cycle of 84 lakh births. Learn about the soul (atma), Satlok, and the Sant Mat path to eternal freedom as taught by the mission.",
    "url": "https://www.humantosoul.com/liberation",
    "author": { "@id": "https://www.humantosoul.com/#organization" },
    "publisher": { "@id": "https://www.humantosoul.com/#organization" },
    "keywords": "moksha, liberation, birth and death, soul, atma, satlok, sant mat, baba jaigurudev, 84 lakh births, cycle of rebirth, God realization, naamdaan",
    "inLanguage": ["en", "hi"]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is Moksha (Liberation) according to Baba Jaigurudev?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Moksha is the permanent liberation of the soul from the cycle of birth and death — the 84 lakh (8,400,000) life forms through which the soul passes. According to Baba Jaigurudev Ji Maharaj, liberation is attained by reaching Satlok — the True Home of all souls — through the practice of Surat Shabd Yoga (Naamdaan) given by a living Sant Satguru."
            }
        },
        {
            "@type": "Question",
            "name": "What is Satlok?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Satlok is the eternal realm — the True Home of all souls. It is a place where life exists beyond breath, limitless and infinite. Souls that reach Satlok through Yogic Sadhana and Naamdaan are freed from birth and death, and reside in permanent liberation, divinity, and infinite bliss. Satlok can never be destroyed and will always remain."
            }
        },
        {
            "@type": "Question",
            "name": "What is the cycle of 84 lakh births?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "According to Sant Mat teachings, the soul passes through 84 lakh (8,400,000) different life forms — humans, animals, birds, trees, and other beings — before receiving a human birth again. The human birth is the only opportunity to attain liberation. Without practicing the path of Surat Shabd Yoga, the soul continues cycling through these forms."
            }
        },
        {
            "@type": "Question",
            "name": "How is liberation (Moksha) attained?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Liberation is attained through receiving Naamdaan (spiritual initiation) from the living Sant Satguru — currently Baba Umakant Ji Maharaj — and then practicing Surat Shabd Yoga (dhyan) consistently. Prerequisites include a vegetarian diet and freedom from all intoxicants. Through regular practice, the soul gradually rises through inner spiritual realms and ultimately reaches Satlok."
            }
        }
    ]
};

export default function LiberationPage() {
    return (
        <>
            <SEO
                title="What Is Moksha (Liberation)? Freedom from Birth and Death | Baba Jaigurudev"
                description="Baba Jaigurudev Ji Maharaj taught the path to Moksha — liberation from the cycle of 84 lakh births. Discover the soul (atma), Satlok (True Home), and Surat Shabd Yoga as the path to eternal freedom from birth and death."
                keywords="moksha, liberation, birth and death, soul, atma, satlok, sant mat, baba jaigurudev, 84 lakh, cycle of rebirth, God realization, naamdaan, spiritual liberation, what is moksha, freedom from rebirth, मोक्ष, आत्मा, सतलोक, जन्म मृत्यु, मुक्ति"
                url="https://www.humantosoul.com/liberation"
                schema={[liberationSchema, faqSchema]}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Liberation", url: "https://www.humantosoul.com/liberation" }
                ]}
            />

            <article className="content-page">

                {/* HERO */}
                <div style={{ background: 'linear-gradient(135deg, #0a0a2e, #1a1a6e)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ color: '#f0c030', fontWeight: '600', marginBottom: '12px', fontSize: '1rem' }}>As Taught by Param Sant Baba Jaigurudev Ji Maharaj</p>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Georgia, serif', marginBottom: '20px', lineHeight: 1.2 }}>
                            What Is Liberation (Moksha)?
                        </h1>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.9 }}>
                            The soul's journey through 84 lakh life forms. The True Home called Satlok. And the direct path given by Baba Jaigurudev Ji Maharaj to achieve permanent liberation from birth and death.
                        </p>
                    </div>
                </div>

                <div className="content-body">

                    {/* SECTION 1: The Human Opportunity */}
                    <section className="content-section">
                        <h2>The Urgency of the Human Birth</h2>
                        <p>
                            According to Sant Mat teachings, the soul passes through <strong>84 lakh (8,400,000) different life forms</strong> — humans, animals, birds, trees, and other beings. After traveling through all these forms, the soul receives the rare gift of a human birth.
                        </p>
                        <p>
                            The human birth is the <em>only</em> life form in which the soul has the awareness and capacity to attain liberation. Animals and other beings cannot practice dhyan or receive Naamdaan. This is why Baba Jaigurudev Ji Maharaj taught with such urgency:
                        </p>
                        <blockquote className="spiritual-quote">
                            "The human body has been given a fixed capital of breaths. Once this count is exhausted, the breath ends, the body falls, and a human being dies."
                            <cite>— Param Sant Baba Jaigurudev Ji Maharaj</cite>
                        </blockquote>
                        <p>
                            Every breath spent without spiritual practice is a breath lost. Without attaining liberation in this human birth, the soul returns to cycle through the 84 lakh forms again.
                        </p>
                        <blockquote className="spiritual-quote">
                            "Freedom from the cycle of birth and death is possible only through true devotion and meditation."
                            <cite>— Baba Umakant Ji Maharaj</cite>
                        </blockquote>
                    </section>

                    {/* SECTION 2: The Soul */}
                    <section className="content-section content-section--shaded">
                        <h2>Understanding the Soul (Atma)</h2>
                        <p>
                            The foundation of Sant Mat doctrine is the understanding that every living being contains a <strong>soul (atma)</strong> — a divine spark that belongs to God (Parmatma). The soul is not the body, mind, or intellect. It is eternal, beyond death, and originally from Satlok — the True Home of all souls.
                        </p>
                        <p>
                            The soul descended from Satlok into Mrityulok (the realm of death) and became trapped in the cycle of birth and rebirth due to karma. The path of liberation is the soul's journey back — from this physical world, through inner spiritual realms, to Satlok.
                        </p>
                        <p>
                            As the Sant Mat tradition teaches: <em>"What the power that animates the body (the soul) descended into Mrityulok from Satlok."</em> The entire purpose of spiritual practice is to reverse this descent — to take the soul back up to where it came from.
                        </p>
                        <div className="info-box">
                            <h3>What happens to a soul that does not achieve liberation?</h3>
                            <ul>
                                <li>It continues cycling through 84 lakh life forms after death</li>
                                <li>It may be reborn as a human again — but only after passing through many other life forms</li>
                                <li>The memory of previous lives is erased — each life begins again in ignorance</li>
                                <li>The cycle of birth, death, and suffering continues</li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 3: Satlok */}
                    <section className="content-section">
                        <h2>Satlok — The Eternal True Home</h2>
                        <p>
                            Baba Jaigurudev Ji Maharaj is recognized as the Anami Purush — the Nameless, Formless Supreme Being — who descended to Earth <em>"solely to guide souls back to their True Home — Satlok."</em>
                        </p>
                        <p>
                            As taught by the mission:
                        </p>
                        <blockquote className="spiritual-quote">
                            "Satlok is the realm where life exists beyond breath, limitless and infinite, and where souls have always resided. It is an eternal place, which can never be destroyed and will always remain. It is a state of complete divinity and effortless power, where every experience is natural, infinite, and blissful."
                        </blockquote>
                        <p>
                            What happens when a soul reaches Satlok?
                        </p>
                        <div className="info-box info-box--important">
                            <h3>The State of Liberation in Satlok:</h3>
                            <ul>
                                <li>The soul is permanently freed from birth and death</li>
                                <li>The soul resides in permanent liberation, divinity, and infinite bliss</li>
                                <li>The soul becomes as powerful as the Supreme God</li>
                                <li>The soul can bring other souls to Satlok</li>
                                <li>The soul never returns to the cycle of 84 lakh births</li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 4: The Path */}
                    <section className="content-section content-section--shaded">
                        <h2>The Path to Liberation: Naamdaan & Surat Shabd Yoga</h2>
                        <p>
                            The specific path to liberation given in Sant Mat is <strong>Surat Shabd Yoga</strong> — received through <strong>Naamdaan</strong> (spiritual initiation) from the living Sant Satguru.
                        </p>
                        <p>
                            This path was brought to Earth through the Sant Mat lineage. It was practiced by Baba Jaigurudev Ji Maharaj himself — meditating for eighteen hours a day after initiation. By the grace of his Guru, Ghurelal Ji Maharaj, he attained the highest spiritual state and was recognized as the Anami Purush.
                        </p>
                        <p>
                            Before departing his physical body on <strong>18 May 2012</strong>, he formally appointed <strong>Baba Umakant Ji Maharaj</strong> to continue granting Naamdaan. On 22 July 2013 (Guru Purnima), Baba Umakant Ji Maharaj formally began granting Naamdaan in Jaipur, and has since given initiation to crores of seekers.
                        </p>
                        <p>
                            <Link to="/meditation" style={{ color: '#4a0000', fontWeight: '700' }}>Learn about Surat Shabd Yoga & how to begin dhyan →</Link>
                        </p>
                    </section>

                    {/* SECTION 5: Role of Sants */}
                    <section className="content-section">
                        <h2>The Role of the Sant on the Path to Liberation</h2>
                        <p>
                            In Sant Mat, a living Sant Satguru is essential for liberation. As taught in the About Us section of this mission:
                        </p>
                        <blockquote className="spiritual-quote">
                            "One who has knowledge of the beginning and the end, who explains the difference between the beginning and the end, who shows the path from the beginning to the end and leads one back from the end to the beginning — such a person is called a Sant."
                        </blockquote>
                        <p>
                            Only manifest (living) Sants reveal the path of liberation and give Naamdaan. Hidden Sants protect the earth but do not initiate souls. Only one living Sant at a time holds the authority to grant Naamdaan — currently, that is Baba Umakant Ji Maharaj.
                        </p>
                        <p>
                            <Link to="/baba-umakant" style={{ color: '#4a0000', fontWeight: '700' }}>About Baba Umakant Ji Maharaj and receiving Naamdaan →</Link>
                        </p>
                    </section>

                    {/* FAQ */}
                    <section className="content-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>What is Moksha according to Baba Jaigurudev?</h3>
                                <p>Moksha is the permanent liberation of the soul from the cycle of 84 lakh (8,400,000) births. It is attained by reaching Satlok — the True Home of all souls — through the practice of Surat Shabd Yoga received through Naamdaan from the living Sant Satguru.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Is Satlok real? What is it?</h3>
                                <p>As taught by Baba Jaigurudev Ji Maharaj: Satlok is an eternal place that can never be destroyed and will always remain. It is a realm of complete divinity and effortless power where life exists beyond breath. Souls there are permanently liberated from birth, death, and suffering.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Can anyone attain liberation, regardless of religion?</h3>
                                <p>Yes. As Baba Umakant Ji Maharaj clearly states: <em>"God did not create any caste or religion. He only created human beings. Therefore, the path of saints is for all of humanity, regardless of their caste, religion, sect, or country."</em></p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="content-cta" style={{ background: 'linear-gradient(135deg, #0a0a2e, #1a1a6e)' }}>
                        <h2>Begin the Path to Liberation</h2>
                        <p>Learn about dhyan (meditation) as taught by Baba Jaigurudev Ji, or discover more about our spiritual mission.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            <Link to="/meditation" className="bp-btn bp-btn--primary">Learn Dhyan 🧘</Link>
                            <Link to="/baba-jaigurudev" className="bp-btn bp-btn--outline" style={{ color: '#fff', borderColor: '#fff' }}>About Baba Jaigurudev Ji →</Link>
                        </div>
                    </section>

                </div>
            </article>
        </>
    );
}

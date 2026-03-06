import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles/ContentPage.css';

const meditationSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "What Is Dhyan (Meditation)? As Taught by Baba Jaigurudev Ji Maharaj",
    "description": "Learn the authentic practice of Dhyan (meditation) as taught by Param Sant Baba Jaigurudev Ji Maharaj — the Surat Shabd Yoga method of Sant Mat for soul awakening, inner peace, and God-realization.",
    "url": "https://www.humantosoul.com/meditation",
    "author": { "@id": "https://www.humantosoul.com/#organization" },
    "publisher": { "@id": "https://www.humantosoul.com/#organization" },
    "mainEntityOfPage": "https://www.humantosoul.com/meditation",
    "keywords": "dhyan, meditation, surat shabd yoga, sant mat, baba jaigurudev, raj yog, God realization, soul, inner peace",
    "inLanguage": ["en", "hi"]
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is Dhyan as taught by Baba Jaigurudev?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Dhyan (meditation) as taught by Baba Jaigurudev Ji Maharaj is the practice of Surat Shabd Yoga — the inner focusing of the soul (surat) on the divine Word (shabd). It involves turning attention completely inward, away from the outer world, to experience the soul and connect with God (Parmatma). Baba Jaigurudev himself practiced dhyan for eighteen hours a day after receiving initiation from his Guru, Ghurelal Ji Maharaj."
            }
        },
        {
            "@type": "Question",
            "name": "How does one begin dhyan meditation in Sant Mat?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "In Sant Mat, dhyan begins with receiving Naamdaan (spiritual initiation) from a living Sant Satguru. Currently, Baba Umakant Ji Maharaj grants Naamdaan. Prerequisites include completely giving up non-vegetarian food (meat, eggs, fish) and all intoxicants. There is no fee for Naamdaan — it is freely given as an act of divine service."
            }
        },
        {
            "@type": "Question",
            "name": "Is dhyan meditation available for all castes and religions?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. As Baba Umakant Ji Maharaj explains: God did not create any caste or religion — He only created human beings. Therefore, the Sant Mat path of dhyan and God-realization is for all of humanity, regardless of caste, religion, sect, or country."
            }
        },
        {
            "@type": "Question",
            "name": "What is Surat Shabd Yoga?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Surat Shabd Yoga is the ancient spiritual technique revealed by the Sant Mat lineage — from Kabir Das Ji (Jogjeet), through the succession of saints down to Baba Jaigurudev Ji Maharaj. 'Surat' means the soul's attention, and 'Shabd' means the divine Sound or Word. The practice involves focusing the soul's attention on the inner divine Sound to travel from the body to God's realm (Satlok)."
            }
        }
    ]
};

export default function MeditationPage() {
    return (
        <>
            <SEO
                title="What Is Dhyan (Meditation)? As Taught by Baba Jaigurudev Ji Maharaj"
                description="Learn the authentic practice of Dhyan (Surat Shabd Yoga) as taught by Param Sant Baba Jaigurudev Ji Maharaj — the Sant Mat method of meditation for soul awakening, inner peace, and God-realization. Free Naamdaan from Baba Umakant Ji Maharaj."
                keywords="dhyan, meditation, surat shabd yoga, sant mat, baba jaigurudev, raj yog, naamdaan, God realization, soul, inner peace, spiritual awakening, baba umakant, vegetarian, how to meditate, guided meditation baba jaigurudev, ध्यान, सुरत शब्द योग, संतमत"
                url="https://www.humantosoul.com/meditation"
                schema={[meditationSchema, faqSchema]}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Meditation", url: "https://www.humantosoul.com/meditation" }
                ]}
            />

            <article className="content-page">

                {/* HERO */}
                <div className="content-hero" style={{ background: 'linear-gradient(135deg, #4a0000, #c41e3a)', color: '#fff', padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <p style={{ color: '#f0c030', fontWeight: '600', marginBottom: '12px', fontSize: '1rem' }}>As Taught by Param Sant Baba Jaigurudev Ji Maharaj</p>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'Georgia, serif', marginBottom: '20px', lineHeight: 1.2 }}>
                            What Is Dhyan (Meditation)?
                        </h1>
                        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, opacity: 0.9 }}>
                            The ancient Sant Mat path of Surat Shabd Yoga — perfected by Baba Jaigurudev Ji Maharaj through his own life's sacrifice — is the direct, accessible route for all souls to return to God's eternal realm, Satlok.
                        </p>
                    </div>
                </div>

                <div className="content-body">

                    {/* SECTION 1: What is Dhyan */}
                    <section className="content-section">
                        <h2>What Is Dhyan?</h2>
                        <p>
                            Dhyan (ध्यान) is the practice of turning the mind and soul's attention completely inward — away from the outer world — to directly experience the soul (atma) and connect with the Supreme God (Parmatma). It is not merely relaxation or concentration, but the direct path of the soul returning to its True Home.
                        </p>
                        <p>
                            Baba Jaigurudev Ji Maharaj himself practiced dhyan for <strong>eighteen hours a day</strong> after receiving spiritual initiation (Naamdaan) from his Guru, Ghurelal Ji Maharaj. By doing so, he "opened the doors" of the spiritual realm, making this direct connection with God simple and attainable for ordinary people and householders today.
                        </p>
                        <blockquote className="spiritual-quote">
                            "The human body has been given a fixed capital of breaths. Once this count is exhausted, the breath ends, the body falls, and a human being dies."
                            <cite>— Param Sant Baba Jaigurudev Ji Maharaj</cite>
                        </blockquote>
                        <p>
                            This teaching reveals why dhyan is urgent: every breath spent without spiritual practice is a breath lost. The goal is to use this human birth — which the soul receives only rarely after passing through 84 lakh (8,400,000) life forms — to attain God-realization.
                        </p>
                    </section>

                    {/* SECTION 2: Surat Shabd Yoga */}
                    <section className="content-section content-section--shaded">
                        <h2>Surat Shabd Yoga — The Method Taught by Baba Jaigurudev</h2>
                        <p>
                            The specific method of meditation taught in Sant Mat is called <strong>Surat Shabd Yoga</strong>. "Surat" means the soul's attention, and "Shabd" means the divine Sound or Word — the vibration of God that permeates all creation.
                        </p>
                        <p>
                            This method was not invented recently. It was brought to Earth by Jogjeet (Kabir Das Ji) — one of the sixteen sons of Satpurush — who revealed the secret of Satlok and disclosed all spiritual secrets. The lineage of living Sants has carried this method forward through the ages.
                        </p>
                        <p>
                            Baba Jaigurudev Ji Maharaj received this initiation from his Guru, Ghurelal Ji Maharaj of Chirauli village near Aligarh, around 1945. After one month of practice, by his Guru's grace, he began to experience divine realization. He then guided tens of millions of souls on this same path.
                        </p>
                        <div className="info-box">
                            <h3>What happens through Surat Shabd Yoga?</h3>
                            <ul>
                                <li>The soul's attention is withdrawn from the body and outer world</li>
                                <li>The soul focuses on the inner divine Sound (Shabd)</li>
                                <li>The soul travels upward through inner spiritual realms</li>
                                <li>The soul reaches Satlok — the eternal realm where life exists beyond breath, limitless and infinite</li>
                                <li>The soul is freed from birth and death, and resides in permanent liberation, divinity, and infinite bliss</li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 3: Naamdaan */}
                    <section className="content-section">
                        <h2>How to Begin: Naamdaan (Spiritual Initiation)</h2>
                        <p>
                            In Sant Mat, one cannot begin Surat Shabd Yoga independently. The practice begins with <strong>Naamdaan</strong> — the spiritual initiation given by a living Sant Satguru. Only one living Sant at a time holds the authority to grant Naamdaan.
                        </p>
                        <p>
                            Before leaving his physical body on 18 May 2012, Baba Jaigurudev Ji Maharaj publicly declared on 16 May 2007 that <strong>Baba Umakant Ji Maharaj</strong> would continue the mission and grant Naamdaan to new seekers.
                        </p>
                        <p>
                            In his own words: <em>"Whenever I come from now on, it will be through him. For spiritual welfare and for new seekers who come for Naamdaan, Umakant Tiwari will grant it."</em>
                        </p>
                        <div className="info-box info-box--important">
                            <h3>Requirements for Naamdaan</h3>
                            <ul>
                                <li><strong>No fee:</strong> Naamdaan is given completely free of cost — it is an act of divine service</li>
                                <li><strong>Vegetarian diet:</strong> Completely give up non-vegetarian food (meat, eggs, fish)</li>
                                <li><strong>No intoxicants:</strong> Completely give up alcohol, beedi, cigarettes, tobacco, etc.</li>
                                <li><strong>Physical presence:</strong> Naamdaan cannot be given via telephone or online — the seeker must be present</li>
                                <li><strong>No language requirement:</strong> Knowing Hindi is not mandatory</li>
                            </ul>
                        </div>
                        <p>
                            <Link to="/baba-umakant" style={{ color: '#c41e3a', fontWeight: '700' }}>Learn more about Baba Umakant Ji Maharaj →</Link>
                        </p>
                    </section>

                    {/* SECTION 4: Satlok */}
                    <section className="content-section content-section--shaded">
                        <h2>The Goal: Reaching Satlok</h2>
                        <p>
                            Through the practice of Surat Shabd Yoga (dhyan), the soul's ultimate destination is <strong>Satlok</strong> — the True Home of all souls, the eternal realm where life exists beyond breath, limitless and infinite.
                        </p>
                        <p>
                            As taught by Baba Jaigurudev Ji Maharaj:
                        </p>
                        <blockquote className="spiritual-quote">
                            "Those who reach Satlok through the path of Yogic Sadhana and Naamdaan never return to this world. They are freed from birth and death, pain, and the endless cycles of existence. Upon reaching this abode, the soul resides in permanent liberation, divinity, and infinite bliss."
                        </blockquote>
                        <p>
                            Satlok is not merely a concept — it is an eternal place of complete divinity and effortless power, where every experience is natural, infinite, and blissful. A soul that reaches Satlok becomes as powerful as the Supreme God.
                        </p>
                    </section>

                    {/* SECTION 5: FAQ */}
                    <section className="content-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>Is dhyan meditation for all people regardless of religion?</h3>
                                <p>Yes. As Baba Umakant Ji Maharaj explains: <em>"God did not create any caste or religion. He only created human beings. Therefore, the path of saints is for all of humanity, regardless of their caste, religion, sect, or country."</em></p>
                            </div>
                            <div className="faq-item">
                                <h3>Can dhyan be learned online or by phone?</h3>
                                <p>No. Naamdaan (initiation into Surat Shabd Yoga) cannot be given over the phone or online. The seeker must be physically present in the presence of Baba Umakant Ji Maharaj or his authorized representatives.</p>
                            </div>
                            <div className="faq-item">
                                <h3>What was Baba Jaigurudev's daily meditation practice?</h3>
                                <p>After receiving Naamdaan from Ghurelal Ji Maharaj, Baba Jaigurudev Ji Maharaj practiced meditation (dhyan) for eighteen hours a day. Surviving on one meal a day, he attained the highest spiritual state within a short period through the grace of his Guru.</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="content-cta">
                        <h2>Begin Your Spiritual Journey</h2>
                        <p>Explore the prayers and meditation practices on our site, or learn about receiving Naamdaan from Baba Umakant Ji Maharaj.</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                            <Link to="/prarthana" className="bp-btn bp-btn--primary">Explore Meditation & Prayer 🙏</Link>
                            <Link to="/baba-umakant" className="bp-btn bp-btn--outline">About Baba Umakant Ji →</Link>
                        </div>
                    </section>

                </div>
            </article>
        </>
    );
}

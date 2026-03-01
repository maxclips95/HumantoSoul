import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/BlueprintHome.css';

/* ── Scroll-reveal hook ── */
function useScrollReveal(threshold = 0.15) {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { el.classList.add('bp-revealed'); observer.disconnect(); } },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);
    return ref;
}

export default function BlueprintHomeSections() {
    const section2Ref = useScrollReveal();
    const pillarsRef = useScrollReveal(0.1);
    const deepRef = useScrollReveal();
    const ctaRef = useScrollReveal();

    return (
        <>
            {/* ═══════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ═══════════════════════════════════════ */}
            <section className="bp-hero" id="inner-transformation" aria-label="Hero">
                <div className="bp-hero__bg" style={{ backgroundImage: "url('/assets/images/temple-bg.jpg')" }} />
                <div className="bp-hero__veil" />
                <div className="bp-hero__content">
                    <p className="bp-hero__eyebrow">Jai Gurudev</p>
                    <h1 className="bp-hero__title">Inner Transformation</h1>
                    <p className="bp-hero__subtitle">
                        Discover a stillness, clarity, and joy that exist beyond the reach of the thinking mind.
                        Through the ancient practice of Yog Sadhna, connect with the Supreme and begin an endless journey within.
                        Guided today by <strong style={{ color: '#f0c030' }}>Baba Umakant Ji Maharaj</strong>, appointed Spiritual Successor of Param Sant Baba Jaigurudev Ji Maharaj.
                    </p>
                    <div className="bp-hero__divider" />
                    <div className="bp-hero__buttons">
                        <Link to="/prarthana" className="bp-btn bp-btn--gold">Begin Meditation 🧘</Link>
                        <Link to="/baba-jaigurudev" className="bp-btn bp-btn--ghost">Explore the Path →</Link>
                    </div>
                </div>

            </section>

            {/* ═══════════════════════════════════════
          SECTION 2 — WHY INNER CHANGE MATTERS
      ═══════════════════════════════════════ */}
            <section className="bp-section bp-why bp-reveal" ref={section2Ref} id="why-inner-change">
                <div className="bp-why__quote-panel">
                    <div className="bp-why__quote-inner">
                        <div className="bp-why__quote-mark">&ldquo;</div>
                        <p className="bp-why__quote-text">
                            The human body has been given a fixed capital of breaths. Once this count is exhausted, the breath ends, the body falls, and a human being dies.
                        </p>
                        <cite className="bp-why__quote-cite">— Param Sant Baba Jaigurudev Ji Maharaj</cite>
                    </div>
                </div>
                <div className="bp-why__text">
                    <span className="bp-label">The Need of Our Time</span>
                    <h2>Why Inner Change Matters</h2>
                    <p>
                        Ancient wisdom teaches that the soul journeys through <strong>84 lakh (8.4 million) forms of life</strong> before receiving the rare and precious human birth. This human form is the only opportunity to consciously pursue liberation and guide the soul back to God.
                    </p>
                    <p>
                        Baba Jaigurudev Ji taught that the root of all suffering lies within the untrained mind. True transformation begins with <strong>dhyan (meditation)</strong>, vegetarian living, and recognizing the soul within every human being.
                    </p>
                    <Link to="/liberation" className="bp-text-link">Learn about the cycle of 84 lakh births →</Link>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          SECTION 3 — THREE PILLARS
      ═══════════════════════════════════════ */}
            <section className="bp-section bp-pillars-section bp-reveal" ref={pillarsRef} id="three-pillars">
                <div className="bp-container">
                    <span className="bp-label bp-label--light">The Path</span>
                    <h2 className="bp-section__heading bp-section__heading--light">A Practical Path to Transformation</h2>
                    <p className="bp-section__subheading">As taught by Param Sant Baba Jaigurudev Ji Maharaj</p>
                    <div className="bp-pillars">

                        <div className="bp-pillar">
                            <div className="bp-pillar__num">01</div>
                            <div className="bp-pillar__icon">🧘</div>
                            <h3>Dhyan — Meditation</h3>
                            <p>
                                Baba Jaigurudev Ji revealed the path of Surat Shabd Yoga. Today, Baba Umakant Ji Maharaj grants Naamdaan — guiding the soul step by step toward God-realization.
                            </p>
                            <Link to="/meditation" className="bp-pillar__cta">Begin Dhyan →</Link>
                        </div>

                        <div className="bp-pillar bp-pillar--featured">
                            <div className="bp-pillar__num">02</div>
                            <div className="bp-pillar__icon">🌿</div>
                            <h3>Vegetarian &amp; Ethical Living</h3>
                            <p>
                                Non-violence (ahimsa) and vegetarianism purify mind, body, and soul — essential on the Santmat path to God-realization.
                            </p>
                            <Link to="/vegetarian-living" className="bp-pillar__cta">Explore Ahimsa →</Link>
                        </div>

                        <div className="bp-pillar">
                            <div className="bp-pillar__num">03</div>
                            <div className="bp-pillar__icon">⚖️</div>
                            <h3>Discipline &amp; Responsibility</h3>
                            <p>
                                Personal discipline through satsang, prayer, and righteous living strengthens character and creates lasting peace within and in society.
                            </p>
                            <Link to="/peace-and-society" className="bp-pillar__cta">Our Mission →</Link>
                        </div>

                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          SECTION 4 — DEEPER PHILOSOPHY (split)
      ═══════════════════════════════════════ */}
            <section className="bp-section bp-deep bp-reveal" ref={deepRef} id="deeper-purpose">
                <div className="bp-deep__text">
                    <span className="bp-label">The Deeper Teaching</span>
                    <h2>Understanding the Purpose of Life</h2>
                    <p>
                        Baba Jaigurudev Ji Maharaj — now the omnipresent Supreme God (Anami Purush) — revealed that human life is the sacred opportunity to attain <strong>moksha (liberation)</strong>: eternal freedom from the cycle of 84 lakh births. His mission is continued by the appointed Spiritual Successor, Baba Umakant Ji Maharaj.
                    </p>
                    <p>
                        The soul (atma) within every human being is divine. Baba Umakant Ji Maharaj today grants Naamdaan — the path of Surat Shabd Yoga — through which the soul reconnects with God (Parmatma) and returns to Satlok, its eternal home.
                    </p>
                    <Link to="/liberation" className="bp-text-link">Learn about liberation (Moksha) →</Link>
                </div>
                <div className="bp-deep__stats-panel">
                    <div className="bp-deep__stat">
                        <div className="bp-deep__stat-num">500M+</div>
                        <div className="bp-deep__stat-label">Across 42 Countries</div>
                    </div>
                    <div className="bp-deep__stat-divider" />
                    <div className="bp-deep__stat">
                        <div className="bp-deep__stat-num">500M+</div>
                        <div className="bp-deep__stat-label">Naamdaan Initiated</div>
                    </div>
                    <div className="bp-deep__stat-divider" />
                    <div className="bp-deep__stat">
                        <div className="bp-deep__stat-num">600+</div>
                        <div className="bp-deep__stat-label">Years of Mission</div>
                    </div>
                    <div className="bp-deep__stat-verse">Jai Gurudev 🙏</div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
          SECTION 5 — CINEMATIC CTA
      ═══════════════════════════════════════ */}
            <section className="bp-cta bp-reveal" ref={ctaRef} id="begin-journey"
                style={{ backgroundImage: "url('/assets/images/temple-bg.jpg')", backgroundPosition: 'center bottom' }}>
                <div className="bp-cta__veil" />
                <div className="bp-cta__content">
                    <span className="bp-label bp-label--light">Begin Today</span>
                    <h2>Begin the Journey</h2>
                    <p>
                        Hundreds of millions across the world have walked this path and discovered a profound stillness,
                        inner clarity, and a power that lies beyond the reach of the thinking mind.
                        Begin your journey of Yog Sadhna — guided today by{' '}
                        <strong style={{ color: '#f0c030' }}>Baba Umakant Ji Maharaj</strong>,
                        the living Spiritual Successor of Param Sant Baba Jaigurudev Ji Maharaj (Omnipresent Supreme God).
                        Awaken to your true nature, discover lasting peace, and attain liberation from the cycle of birth and death.
                    </p>
                    <div className="bp-hero__buttons">
                        <Link to="/prarthana" className="bp-btn bp-btn--gold">Start Now 🙏</Link>
                        <Link to="/prophecies" className="bp-btn bp-btn--ghost">Prophecies →</Link>
                    </div>
                </div>
            </section>
        </>
    );
}

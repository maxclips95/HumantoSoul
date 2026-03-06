import React from 'react';
import '../styles/BlueprintHome.css';

function HeroSection() {
  return (
    <section
      style={{
        backgroundColor: 'var(--off-white)',
        padding: '100px 24px',
        color: 'var(--text-body)',
        fontFamily: 'var(--sans)'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="bp-label">The Divine Path</span>
          <h2 className="bp-section__heading" style={{ color: 'var(--dark)' }}>
            JaiGuruDev – Name of Supreme God
          </h2>
          <p style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.4rem',
            fontStyle: 'italic',
            color: 'var(--gold)',
            marginTop: '16px',
            lineHeight: '1.6'
          }}>
            Spiritual Prophecies, Divine Protection & The Path to Enlightenment
          </p>
        </div>

        {/* Intro */}
        <div style={{
          backgroundColor: '#fff',
          padding: '40px 50px',
          borderRadius: '4px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.03)',
          borderTop: '3px solid var(--gold)',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-body)' }}>
            By chanting <strong>“Jaigurudev Jaigurudev Jaigurudev Jai Jaigurudev”</strong> you engage in a divine practice whose powerful effects include <strong>protection in difficult times</strong> and spiritual awakening. This sacred name provides guidance, <strong>warnings about future times (prophecies)</strong>, and inner strength even when all hope seems lost, offering support to anyone, at any time.
          </p>
        </div>

        {/* 2-Column Grid for the main concepts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>✦</span> The Precious Human Life
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-body)' }}>
              <strong>The human body is extremely rare and precious.</strong> Ancient spiritual wisdom reveals that the <strong>soul journeys through 8.4 million forms of life</strong>—including plants, trees, birds, animals, insects, and aquatic beings—before attaining the <strong>rare and precious human birth</strong>. This human form is received only once in that vast journey and offers a unique opportunity to consciously pursue the true purpose of life: <strong>guiding the soul back to the Supreme Lord.</strong>
            </p>
          </div>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>✦</span> Naamdan: The Sacred Initiation
            </h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-body)' }}>
              Through <strong>Naamdan</strong>, the sacred initiation bestowed by Baba Umakant Ji Maharaj, <strong>seekers receive the guidance and meditation practices essential for liberating the soul from the cycles of birth and death.</strong> This sacred initiation can be received only through <strong>personal presence at the ashram or during his programs held across India and abroad, predominantly in India each month. Online initiation is not offered.</strong>
            </p>
          </div>

        </div>

        {/* Community Block */}
        <div style={{ textAlign: 'center', padding: '0 20px', marginBottom: '60px' }}>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: 'var(--dark)', marginBottom: '16px' }}>
            Visit the Ashram and Join the Global Community
          </h3>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-body)', maxWidth: '800px', margin: '0 auto' }}>
            Over <strong>500 million people across 42 countries</strong> have embraced this practice, experiencing <strong>profound inner transformation</strong>. Chant and immerse yourself in the <strong>eternal power of Jaigurudev</strong>, embarking on a journey toward <strong>divine grace, blessings, and spiritual awakening</strong>.
          </p>
        </div>

        {/* Alerts / Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
            backgroundColor: 'rgba(201, 151, 44, 0.08)',
            borderLeft: '4px solid var(--gold)',
            padding: '24px 30px',
            borderRadius: '0 4px 4px 0'
          }}>
            <div style={{ fontSize: '1.4rem' }}>⚠️</div>
            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--dark)' }}>
              <strong>Important:</strong> Do not disclose or share the Naamdan word
              and method with anyone. This sacred practice must be received directly
              from Baba Umakant Ji Maharaj during his programmes.
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'flex-start',
            backgroundColor: 'rgba(196, 30, 58, 0.04)',
            borderLeft: '4px solid var(--crimson-mid)',
            padding: '24px 30px',
            borderRadius: '0 4px 4px 0'
          }}>
            <div style={{ fontSize: '1.4rem' }}>🙏</div>
            <div style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--dark)' }}>
              <strong>Note for Visitors:</strong> When referring to the spiritual
              guide, kindly use "<strong>Maalik (Owner of Souls)</strong>" instead
              of the personal name.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default HeroSection;


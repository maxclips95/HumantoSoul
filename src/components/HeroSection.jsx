import React from 'react';

function HeroSection() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/temple-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '0px 20px 20px 20px',
        marginTop: '-20px',
        textAlign: 'center',
        color: '#1E3A8A',
        position: 'relative',
      }}
    >
      {/* Soft overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 1,
        }}
      ></div>

      <div
        className="hero-content"
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* MAIN HEADING */}
        <h1
          style={{
            fontSize: '3.2rem',
            color: '#5233ffff',
            fontWeight: '800',
            textShadow: '3px 3px 8px rgba(0,0,0,0.4)',
            margin: '0px 0 15px 0',
            fontFamily: 'Poppins, Arial, sans-serif',
          }}
        >
          JaiGuruDev – Name of Supreme God
        </h1>

        {/* MAIN PARAGRAPH CONTAINER */}
        <div
          style={{
            margin: '0 auto 20px auto',
            color: '#2E3A59',
            backgroundColor: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            padding: '30px 40px',
            borderRadius: '20px',
            maxWidth: '1100px',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
            borderTop: '6px solid #ad33ffff',
            lineHeight: '1.6',
            textAlign: 'left',
          }}
        >
          {/* INTRO */}
          <p style={{ fontSize: '1.3rem', fontWeight: '500', color: '#1E3A8A', marginBottom: '20px', textAlign: 'center', fontStyle: 'italic' }}>
            Spiritual Prophecies, Divine Protection & The Path to Enlightenment
          </p>

          <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
            By chanting <strong>“Jaigurudev Jaigurudev Jaigurudev Jai Jaigurudev”</strong> you engage in a divine practice whose powerful effects include <strong>protection in difficult times</strong> and spiritual awakening. This sacred name provides guidance, <strong>warnings about future times (prophecies)</strong>, and inner strength even when all hope seems lost, offering support to anyone, at any time.
          </p>

          {/* SECTION 1: GUIDANCE */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '1.1rem' }}><span style={sectionHeadingStyle}>Guidance from the Living Guru:</span> This sacred practice is shared exclusively by <strong>Baba Umakant Ji Maharaj</strong>, <strong>revered as a living spiritual Guru, ever-present and omnipresent,</strong> who lovingly guides seekers to connect with the Supreme and receive divine blessings.
            </p>
          </div>

          {/* SECTION 2: THE PATH */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '1.1rem' }}><span style={sectionHeadingStyle}>The Precious Human Life & Path to Liberation:</span> <strong>The human body is extremely rare and precious.</strong> Ancient spiritual wisdom reveals that the <strong>soul journeys through 8.4 million forms of life</strong>—including plants, trees, birds, animals, insects, and aquatic beings—before attaining the <strong>rare and precious human birth</strong>. This human form is received only once in that vast journey and offers a unique opportunity to consciously pursue the true purpose of life: <strong>guiding the soul back to the Supreme Lord.</strong>
            </p>
          </div>

          {/* SECTION 3: NAAMDAN */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '1.1rem' }}><span style={sectionHeadingStyle}>Naamdan: The Sacred Initiation:</span> Through <strong>Naamdan</strong>, the sacred initiation bestowed by Baba Umakant Ji Maharaj, <strong>seekers receive the guidance and meditation practices essential for liberating the soul from the cycles of birth and death.</strong> This sacred initiation can be received only through <strong>personal presence at the ashram or during his programs held across India and abroad, predominantly in India each month. Online initiation is not offered.</strong>
            </p>
          </div>

          {/* SECTION 4: COMMUNITY */}
          <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '20px' }}>
            <p style={{ fontSize: '1.05rem', color: '#4B5563', margin: 0 }}>
              <span style={sectionHeadingStyle}>Visit the Ashram and Join the Global Community</span> — Over <strong>500 million people across 42 countries</strong> have embraced this practice, experiencing <strong>profound inner transformation</strong>. Chant and immerse yourself in the <strong>eternal power of Jaigurudev</strong>, embarking on a journey toward <strong>divine grace, blessings, and spiritual awakening</strong>.
            </p>
          </div>
        </div>

        {/* IMPORTANT NOTES SECTION */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* IMPORTANT NOTE */}
          <div
            style={{
              fontSize: '1rem',
              color: '#1E3A8A',
              backgroundColor: '#F8FAFC',
              padding: '16px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #E2E8F0',
            }}
          >
            ⚜️ <strong>Important:</strong> Do not disclose or share the Naamdan word
            and method with anyone. This sacred practice must be received directly
            from Baba Umakant Ji Maharaj during his programmes.
          </div>

          {/* VISITORS NOTE */}
          <div
            style={{
              fontSize: '1rem',
              color: '#1E3A8A',
              backgroundColor: '#F8FAFC',
              padding: '16px 20px',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: '600',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #E2E8F0',
            }}
          >
            🌼 <strong>Note for Visitors:</strong> When referring to the spiritual
            guide, kindly use "<strong>Maalik (Owner of Souls)</strong>" instead
            of the personal name.
          </div>
        </div>
      </div>
    </section>
  );
}

const sectionHeadingStyle = {
  fontSize: '1.25rem',
  color: '#5233ffff',
  fontWeight: '700',
  marginBottom: '10px',
  borderBottom: '2px solid #5233ffff',
  display: 'inline-block',
  paddingBottom: '5px'
};

export default HeroSection;


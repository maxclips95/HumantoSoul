import React from 'react';

function HeroSection() {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/temple-bg.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '40px 20px 20px 20px',   // ⬅ moved UP
        marginTop: '-20px',               // ⬅ reduces empty gap above
        textAlign: 'center',
        color: '#1E3A8A',
        position: 'relative',
      }}
    >
      {/* Soft overlay for beautiful look */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(2px)',
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
            color: '#FF9933',
            fontWeight: '800',
            textShadow: '3px 3px 8px rgba(0,0,0,0.4)',
            margin: '0px 0 15px 0',
            fontFamily: 'Poppins, Arial, sans-serif',
          }}
        >
          JaiGuruDev – Name of Supreme God
        </h1>

        {/* MAIN PARAGRAPH */}
        <p
          style={{
            fontSize: '1.1rem',
            margin: '0 auto 20px auto',
            color: '#2E3A59',
            backgroundColor: 'rgba(255,255,255,0.92)',
            padding: '16px 20px',
            borderRadius: '12px',
            lineHeight: '1.8',
            textAlign: 'justify',
            maxWidth: '1500px',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
          }}
        >
          Experience the Transformative Power of Jaigurudev. The sacred name “Jaigurudev” connects you to the very essence of life and awakens your inner strength. By chanting: “Jaigurudev Jaigurudev Jaigurudev Jai Jaigurudev” every morning and evening, you engage in a divine practice whose effects can be felt immediately. Guidance from Baba Umakant Ji Maharaj — This practice is shared exclusively by Baba Umakant Ji Maharaj, revered as a living spiritual guide, who helps seekers connect with the Supreme and receive divine blessings. Following his guidance can deepen your spiritual connection and bring inner peace, purpose, and lasting transformation. The Precious Human Life and the Path to Liberation — The human body is extremely rare and precious—it is said to be attained only once after millions of births across various forms such as animals, birds, trees, and other beings. This unique opportunity is critical, because only as humans can we consciously pursue the true goal of life: guiding our soul back to the Supreme Lord, the Creator, or Existence itself. Through Naamdan, a sacred initiation given by Baba Umakant Ji Maharaj, you can receive the guidance and meditation practices needed to liberate your soul from the cycles of birth and death. By following this divine path, you can reach your eternal home and experience the blissful presence of the Supreme. This sacred initiation is available only in person at the ashram and cannot be received online. Visiting the ashram and receiving Naamdan allows you to embrace your spiritual destiny and achieve lasting connection with the Divine. Visit the Ashram and Join the Global Community — Attending the ashram during programs allows you to connect directly with Baba Ji, receive guidance, and experience the fullness of blessings in your life. Over 500 million people across 42 countries have embraced this practice, experiencing profound inner transformation. Come, chant, and immerse yourself in the eternal power of Jaigurudev—a journey toward divine grace, limitless possibilities, and the omnipresent blessings of Baba Ji (Omnipresent Avtar of God).
        </p>

        {/* IMPORTANT NOTE */}
        <p
          style={{
            fontSize: '1.05rem',
            margin: '0 auto 15px auto',
            color: '#1E3A8A',
            backgroundColor: 'rgba(255,255,255,0.92)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'justify',
            maxWidth: '1500px',
            fontWeight: 'bold',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
          }}
        >
          ⚜️ <strong>Important:</strong> Do not disclose or share the Naamdan word
          and method with anyone. This sacred practice must be received directly
          from Baba Umakant Ji Maharaj during his programmes.
        </p>

        {/* VISITORS NOTE */}
        <p
          style={{
            fontSize: '1.05rem',
            margin: '0 auto',
            color: '#1E3A8A',
            backgroundColor: 'rgba(255,255,255,0.92)',
            padding: '12px',
            borderRadius: '10px',
            textAlign: 'justify',
            maxWidth: '1500px',
            fontWeight: 'bold',
            boxShadow: '0px 3px 10px rgba(0,0,0,0.1)',
          }}
        >
          🌼 <strong>Note for Visitors:</strong> When referring to the spiritual
          guide, kindly use "<strong>Maalik (Owner of Souls)</strong>" instead
          of the personal name.
        </p>
      </div>
    </section>
  );
}

export default HeroSection;

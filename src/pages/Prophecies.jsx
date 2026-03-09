import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import SEO from '../components/common/SEO';
import ShareButtons from '../components/common/ShareButtons';
import ProphecyTimeline from '../components/ProphecyTimeline';

const propheciesSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "url": "https://www.humantosoul.com/prophecies",
      "name": "Baba Jaigurudev Prophecies & Future Predictions | Bhavishyavani",
      "description": "Divine prophecies of Baba Jaigurudev and Baba Umakant Ji — predictions about world events, Satyug, Yug Parivartan, and the spiritual transformation of humanity.",
      "keywords": "prophecy, prophecies, baba jaigurudev prophecies, baba umakant prophecies, predictions, bhavishyavani, satyug, yug parivartan, 2026 predictions",
      "author": { "@id": "https://www.humantosoul.com/#organization" },
      "publisher": { "@id": "https://www.humantosoul.com/#organization" },
      "inLanguage": ["en", "hi"]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the prophecies of Baba Jaigurudev?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Baba Jaigurudev has made divine prophecies (Bhavishyavani) about world events including: natural calamities, world wars, political changes, the transition from Kaliyug to Satyug (Golden Age), and the spiritual awakening of humanity. Many prophecies have already come true. Visit humantosoul.com/prophecies for complete details."
          }
        },
        {
          "@type": "Question",
          "name": "What is Yug Parivartan (Time Change)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yug Parivartan (युग परिवर्तन) means the change of cosmic age or era. According to Baba Jaigurudev's prophecies, the world is transitioning from Kaliyug (age of darkness) to Satyug (age of truth/golden age). This change will bring massive upheaval followed by a new era of peace, harmony, power, and prosperity for all of humanity."
          }
        }
      ]
    }
  ]
};



export default function Prophecies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textProphecies, setTextProphecies] = useState([]);

  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const getLocalizedLink = (baseId) => {
    return currentLang === 'en' ? `/prophecy/${baseId}` : `/${currentLang}/prophecy/${baseId}`;
  };

  useEffect(() => {
    axios.get("/api/prophecies")
      .then((res) => {
        const data = res.data;
        let allItems = Array.isArray(data) ? data : [...(data.manual || []), ...(data.automated || [])];
        const uniqueItems = [];
        const seenLinks = new Set();
        for (const item of allItems) {
          if (item.link && !seenLinks.has(item.link)) {
            uniqueItems.push(item);
            seenLinks.add(item.link);
          }
        }
        // Default sort: Latest synced items first (by ID)
        uniqueItems.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        setItems(uniqueItems);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    axios.get("/api/prophecy-highlight")
      .then(res => setTextProphecies(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, []);

  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  const filteredItems = items.filter(item =>
    !searchQuery || [item.title, item.transcript, item.description].some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredTextProphecies = textProphecies.filter(item =>
    !searchQuery || [item.title, item.content].some(f => f?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Classification logic
  const getCategory = (item) => {
    const title = item.title?.toLowerCase() || '';
    if (title.includes('tv episode')) return 'tv';
    if (title.includes('satsang |') || title.includes('satsang vid') || title.startsWith('satsang')) return 'satsang';
    return 'short';
  };

  const allShortsList = filteredItems.filter(i => getCategory(i) === 'short');

  // Define time window: current month and last month
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Rule: Exactly 5 items for the first row (Priority Transcripts) - exempt from date filter
  const priorityTranscripts = allShortsList
    .filter(i => i.transcriptStatus === 'Approved')
    .slice(0, 5);

  const priorityIds = new Set(priorityTranscripts.map(i => i.id));

  // Rule: All other shorts start from the 2nd row, filtered for current/last month only
  const otherShorts = allShortsList
    .filter(i => {
      if (priorityIds.has(i.id)) return false;
      // Filter by date: current and previous month only
      if (!i.publishedAt) return true; // Keep if no date available
      const pubDate = new Date(i.publishedAt);
      return pubDate >= startOfLastMonth;
    });

  const shorts = [...priorityTranscripts, ...otherShorts].slice(0, 50);

  const tvEpisodes = filteredItems.filter(i => {
    if (getCategory(i) !== 'tv') return false;
    if (!i.publishedAt) return true;
    return new Date(i.publishedAt) >= startOfLastMonth;
  }).slice(0, 12);

  const satsangVideos = filteredItems.filter(i => {
    if (getCategory(i) !== 'satsang') return false;
    if (!i.publishedAt) return true;
    return new Date(i.publishedAt) >= startOfLastMonth;
  }).slice(0, 12);

  const SectionHeader = ({ title, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 15px 0', borderBottom: '1px solid rgba(196,30,58,0.1)', paddingBottom: '8px' }}>
      <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      <h2 style={{ margin: 0, color: '#c41e3a', fontSize: '1.3rem', fontWeight: '700', textTransform: 'uppercase' }}>{title}</h2>
    </div>
  );

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;

  return (
    <>
      <SEO
        title={searchQuery ? `Search: ${searchQuery} - Baba Jaigurudev Prophecies` : "Baba Jaigurudev Prophecies & Predictions | Bhavishyavani | भविष्यवाणियाँ"}
        description="Read the divine prophecies (Bhavishyavani) of Baba Jaigurudev and Baba Umakant Ji — predictions about world events, Satyug (Golden Age), Yug Parivartan, natural calamities, and the spiritual transformation of humanity. Many prophecies have already come true. बाबा जयगुरुदेव और बाबा उमाकांत जी की भविष्यवाणियाँ।"
        keywords="prophecy, prophecies, baba jaigurudev prophecies, baba umakant prophecies, predictions, bhavishyavani, satyug, yug parivartan, 2026 predictions, kaliyug to satyug, time change, parivartan, world events, spiritual predictions, divine prophecy, future predictions, india prophecy, jai gurudev predictions, umakant predictions, भविष्यवाणी, सत्युग, युग परिवर्तन, कलयुग"
        url="https://www.humantosoul.com/prophecies"
        schema={propheciesSchema}
        breadcrumbs={[
          { name: "Home", url: "https://www.humantosoul.com/" },
          { name: "Prophecies", url: "https://www.humantosoul.com/prophecies" }
        ]}
      />
      <section style={{ padding: '0 20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* SEO Header Section - Highly compressed */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <h1 style={{ color: '#c41e3a', fontSize: '2.3rem', margin: '10px 0 0 0' }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : "Baba Umakant Ji Maharaj’s Prophecies"}
          </h1>
          {!searchQuery && (
            <p style={{ fontSize: '1rem', color: '#555', maxWidth: '950px', margin: '5px auto 0 auto', lineHeight: '1.3' }}>
              Explore the profound <strong>spiritual warnings</strong> and <strong>divine prophecies</strong> of Baba Jai Gurudev. Understand the coming transformation (Parivartan)
              and how to prepare for the <strong>Golden Age (Satya Yuga)</strong> through inner awakening and a pure sattvic way of life.
            </p>
          )}
        </div>

        {!searchQuery && <ProphecyTimeline />}

        {/* Text Prophecies */}
        {filteredTextProphecies.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '60px' }}>
            {filteredTextProphecies.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '25px',
                  borderRadius: '15px',
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease'
                }}
              >
                <div style={{
                  background: '#c41e3a',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  alignSelf: 'flex-start',
                  marginBottom: '15px'
                }}>
                  {item.year || '2026'}
                </div>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#333' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
                  {item.content?.substring(0, 160)}...
                </p>
                <Link
                  to={getLocalizedLink(item.id)}
                  style={{
                    background: '#c41e3a',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: 'fit-content',
                    textDecoration: 'none',
                    textAlign: 'center'
                  }}
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        )}

        <div id="prophecy-videos">
          {shorts.length > 0 && (
            <>
              <SectionHeader title="Latest Prophecy Shorts" icon="⚡" />
              <div className="card-grid" style={{ marginBottom: '50px' }}>
                {shorts.map((item, i) => <Card key={i} item={item} isShort={true} getLocalizedLink={getLocalizedLink} />)}
              </div>
            </>
          )}

          {tvEpisodes.length > 0 && (
            <>
              <SectionHeader title="TV Episodes" icon="📺" />
              <div className="card-grid" style={{ marginBottom: '50px' }}>
                {tvEpisodes.map((item, i) => <Card key={i} item={item} isShort={false} getLocalizedLink={getLocalizedLink} />)}
              </div>
            </>
          )}

          {satsangVideos.length > 0 && (
            <>
              <SectionHeader title="Full Satsangs & Prophecies" icon="🎥" />
              <div className="card-grid" style={{ marginBottom: '50px' }}>
                {satsangVideos.map((item, i) => <Card key={i} item={item} isShort={false} getLocalizedLink={getLocalizedLink} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

const Card = ({ item, isShort, getLocalizedLink }) => (
  <div className="card" style={{ position: 'relative' }}>
    <div style={{ position: 'relative' }}>
      {item.year && <div className="year-badge" style={{ position: 'absolute', top: '10px', right: '10px', background: '#c41e3a', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>{item.year}</div>}
      <a href={item.link} target="_blank" rel="noreferrer">
        <img src={item.thumbnail?.startsWith('/') ? `${window.API_BASE || ''}${item.thumbnail}` : item.thumbnail} alt={item.title} className="card-img" />
      </a>
    </div>
    <div className="card-content">
      <h3 className="prophecy-title">{item.title}</h3>
      <div className="prophecy-text" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
        {item.transcriptStatus === 'Approved' && item.transcript ? (
          <>
            <div style={{ marginBottom: '8px' }}>
              <em style={{ color: '#c41e3a', fontWeight: 'bold', fontStyle: 'normal', display: 'block' }}>हिंदी:</em>
              <span style={{ color: '#555' }}>{item.transcript.split('|||')[0]?.substring(0, 150)}...</span>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <em style={{ color: '#c41e3a', fontWeight: 'bold', fontStyle: 'normal', display: 'block' }}>English:</em>
              <span style={{ color: '#555' }}>{item.transcript.split('|||')[1]?.substring(0, 150)}...</span>
            </div>
            <Link
              to={getLocalizedLink(item.id)}
              style={{
                background: '#c41e3a', color: 'white', border: 'none',
                padding: '10px 15px', borderRadius: '5px', cursor: 'pointer',
                fontWeight: 'bold', width: '100%', marginBottom: '15px',
                display: 'block', textAlign: 'center', boxSizing: 'border-box',
                textDecoration: 'none'
              }}
            >
              📖 Read Full Transcript
            </Link>
          </>
        ) : (
          <div style={{ color: '#555', marginBottom: '15px' }}>
            {item.description || item.text ? (item.description || item.text).substring(0, 180) + '...' : 'Prophecy details...'}
          </div>
        )}
      </div>
      <div style={{ marginTop: '5px' }}>
        <a href={item.link} target="_blank" rel="noreferrer" style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none' }}>Watch Video →</a>
      </div>
      <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
        <ShareButtons title={item.title} url={item.link} />
      </div>
    </div>
  </div>
);

